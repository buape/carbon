import type { Client } from "../../classes/Client.js"
import type { RuntimeProfile } from "../../classes/RequestClient.js"
import { createBoundedExecutor } from "../../internals/BoundedExecutor.js"
import type { ListenerEventType } from "../../types/index.js"
import { GatewayPlugin } from "../gateway/GatewayPlugin.js"
import type { GatewayPayload, GatewayPluginOptions } from "../gateway/types.js"
import type { RedisStreamClient } from "./types.js"

export interface RedisStreamDeliveryOptions {
	timeoutMs?: number
	maxRetries?: number
	baseBackoffMs?: number
	maxBackoffMs?: number
	jitterRatio?: number
	maxInFlight?: number
	maxQueueSize?: number
}

export interface RedisStreamGatewayForwarderPluginOptions
	extends GatewayPluginOptions {
	/**
	 * The ioredis client (or cluster client) to publish gateway events to.
	 * This connection is owned and managed by the caller.
	 */
	redis: RedisStreamClient
	/**
	 * Prefix used to derive the per-client stream key (`<prefix>:<clientId>`).
	 *
	 * @default "carbon:events"
	 */
	streamKeyPrefix?: string
	/**
	 * Approximate maximum stream length (`XADD ... MAXLEN ~ N`), used to bound
	 * unbounded stream growth. Set to `undefined` to disable trimming.
	 *
	 * @default 100_000
	 */
	maxStreamLength?: number
	/**
	 * Runtime profile that controls delivery defaults.
	 *
	 * @default "serverless"
	 */
	runtimeProfile?: RuntimeProfile
	/**
	 * Delivery policy for forwarded events.
	 */
	delivery?: RedisStreamDeliveryOptions
}

type DeliveryTask = {
	eventType: string
	fields: string[]
	attempt: number
	enqueuedAt: number
}

const deliveryDefaults = {
	serverless: {
		timeoutMs: 2500,
		maxRetries: 2,
		baseBackoffMs: 150,
		maxBackoffMs: 1800,
		jitterRatio: 0.2,
		maxInFlight: 8,
		maxQueueSize: 2000
	},
	persistent: {
		timeoutMs: 6000,
		maxRetries: 3,
		baseBackoffMs: 250,
		maxBackoffMs: 4000,
		jitterRatio: 0.2,
		maxInFlight: 16,
		maxQueueSize: 8000
	}
} satisfies Record<RuntimeProfile, Required<RedisStreamDeliveryOptions>>

/**
 * Forwards gateway events to a Redis Stream (one stream per client) instead of
 * a signed HTTP webhook. Intended for trusted, internal delivery between a
 * gateway-connected forwarder process and a processor that consumes the
 * stream with `RedisStreamGatewayReceiverPlugin`.
 *
 * Delivery and message-parsing failures are reported through the inherited
 * `emitter`'s `"error"` event (the same channel `GatewayPlugin` already uses
 * for websocket-level errors), not by throwing. Both failure paths happen
 * inside a websocket message handler and a background bounded-executor retry
 * loop — neither is awaited by anything, so a thrown error there would only
 * become an unhandled promise rejection instead of reaching a caller.
 * Subscribe with `plugin.emitter.on("error", (error) => ...)`, exactly how
 * `ForwarderRuntime.attachForwarderErrorHandler` already does for the base
 * gateway connection.
 */
export class RedisStreamGatewayForwarderPlugin extends GatewayPlugin {
	override readonly id = "redis-gateway-forwarder" as "gateway"

	readonly options: RedisStreamGatewayForwarderPluginOptions
	private streamKey?: string
	private guildAvailabilityCache: Map<string, boolean> = new Map()
	private deliveryPolicy: Required<RedisStreamDeliveryOptions>
	private deliveryExecutor: ReturnType<
		typeof createBoundedExecutor<DeliveryTask>
	>
	private deliveryMetrics = {
		accepted: 0,
		sent: 0,
		retried: 0,
		failed: 0,
		dropped: 0,
		timeouts: 0,
		lastFailureReason: null as string | null,
		lastFailureEventType: null as string | null,
		lastFailureAt: 0,
		lastSuccessAt: 0,
		oldestQueuedAgeMs: 0
	}
	private failureReasons = new Map<string, number>()

	constructor(options: RedisStreamGatewayForwarderPluginOptions) {
		super(options)
		const profile = options.runtimeProfile ?? "serverless"
		const defaults = deliveryDefaults[profile]
		this.deliveryPolicy = {
			...defaults,
			...options.delivery
		}
		if (
			!Number.isInteger(this.deliveryPolicy.maxInFlight) ||
			this.deliveryPolicy.maxInFlight < 1
		) {
			throw new Error(
				"delivery.maxInFlight must be an integer greater than or equal to 1"
			)
		}
		this.deliveryExecutor = createBoundedExecutor<DeliveryTask>({
			concurrency: this.deliveryPolicy.maxInFlight,
			run: async (task) => {
				await this.deliver(task)
			},
			getQueuedAt: (task) => task.enqueuedAt
		})
		this.options = {
			maxStreamLength: 100_000,
			...options
		}
	}

	override async registerClient(client: Client): Promise<void> {
		this.streamKey = `${this.options.streamKeyPrefix ?? "carbon:events"}:${client.clientId}`
		return super.registerClient(client)
	}

	protected override setupWebSocket(): void {
		super.setupWebSocket()

		if (!this.ws) return

		this.onSocketEvent(this.ws, "message", async (incoming) => {
			try {
				const payloadText = this.getMessageText(incoming)
				if (!payloadText) {
					return
				}
				const payload = JSON.parse(payloadText) as GatewayPayload

				if (payload.t && payload.d) {
					const gatewayType = payload.t as ListenerEventType
					let forwardedType = gatewayType

					if (gatewayType === "READY") {
						const readyData = payload.d as {
							guilds?: Array<{ id: string }>
						}
						this.guildAvailabilityCache.clear()
						readyData.guilds?.forEach((guild) => {
							this.guildAvailabilityCache.set(guild.id, false)
						})
					}

					if (gatewayType === "GUILD_CREATE") {
						const guildCreateData = payload.d as { id: string }
						const cachedAvailability = this.guildAvailabilityCache.get(
							guildCreateData.id
						)
						if (cachedAvailability === false) {
							forwardedType = "GUILD_AVAILABLE"
						}
						this.guildAvailabilityCache.set(guildCreateData.id, true)
					}

					if (gatewayType === "GUILD_DELETE") {
						const guildDeleteData = payload.d as {
							id: string
							unavailable?: boolean
						}
						if (guildDeleteData.unavailable) {
							forwardedType = "GUILD_UNAVAILABLE"
							this.guildAvailabilityCache.set(guildDeleteData.id, false)
						} else {
							this.guildAvailabilityCache.delete(guildDeleteData.id)
						}
					}

					if (
						this.options.eventFilter &&
						!this.options.eventFilter(forwardedType)
					) {
						return
					}

					this.enqueueDelivery({
						eventType: forwardedType,
						fields: [
							"type",
							forwardedType,
							"data",
							JSON.stringify(payload.d),
							"ts",
							String(Date.now())
						],
						attempt: 0,
						enqueuedAt: Date.now()
					})
				}
			} catch (error) {
				this.emitter.emit(
					"error",
					error instanceof Error
						? error
						: new Error(`Error forwarding gateway event to Redis: ${error}`)
				)
			}
		})
	}

	getDeliveryMetrics() {
		this.deliveryMetrics.oldestQueuedAgeMs =
			this.deliveryExecutor.getOldestQueuedAgeMs()
		return {
			...this.deliveryMetrics,
			queueDepth: this.deliveryExecutor.getQueueDepth(),
			inFlight: this.deliveryExecutor.getInFlight(),
			policy: this.deliveryPolicy,
			failureReasons: Object.fromEntries(this.failureReasons)
		}
	}

	private enqueueDelivery(task: DeliveryTask) {
		if (
			this.deliveryExecutor.getQueueDepth() >= this.deliveryPolicy.maxQueueSize
		) {
			this.deliveryMetrics.dropped += 1
			this.trackFailure("queue_full", task.eventType)
			return
		}
		this.deliveryMetrics.accepted += 1
		this.deliveryExecutor.schedule(task)
	}

	private async deliver(task: DeliveryTask) {
		for (
			let attempt = task.attempt;
			attempt <= this.deliveryPolicy.maxRetries;
			attempt += 1
		) {
			const response = await this.sendWithTimeout(task)
			if (response.ok) {
				this.deliveryMetrics.sent += 1
				this.deliveryMetrics.lastSuccessAt = Date.now()
				return
			}

			const finalAttempt = attempt >= this.deliveryPolicy.maxRetries
			if (finalAttempt) {
				this.deliveryMetrics.failed += 1
				this.trackFailure(response.reason, task.eventType)
				this.emitter.emit(
					"error",
					new Error(
						`redis-gateway-forwarder delivery failed for event ${task.eventType} after ${attempt + 1}/${this.deliveryPolicy.maxRetries + 1} attempt(s): ${response.reason}`
					)
				)
				return
			}

			this.deliveryMetrics.retried += 1
			await new Promise((resolve) => {
				setTimeout(resolve, Math.max(0, this.getRetryDelay(attempt)))
			})
		}
	}

	private async sendWithTimeout(task: DeliveryTask) {
		if (!this.streamKey) {
			return { ok: false, reason: "no_stream_key" } as const
		}

		const args: (string | number)[] = this.options.maxStreamLength
			? [
					this.streamKey,
					"MAXLEN",
					"~",
					this.options.maxStreamLength,
					"*",
					...task.fields
				]
			: [this.streamKey, "*", ...task.fields]

		const xadd = (
			this.options.redis.xadd as unknown as (
				...args: (string | number)[]
			) => Promise<unknown>
		).bind(this.options.redis)

		let timeoutHandle: ReturnType<typeof setTimeout> | undefined
		try {
			const result = await Promise.race([
				xadd(...args),
				new Promise<never>((_, reject) => {
					timeoutHandle = setTimeout(() => {
						this.deliveryMetrics.timeouts += 1
						reject(new Error("redis-gateway-forwarder timeout"))
					}, this.deliveryPolicy.timeoutMs)
				})
			])
			if (result === null || result === undefined) {
				return { ok: false, reason: "xadd_null" } as const
			}
			return { ok: true, reason: "ok" } as const
		} catch (error) {
			return {
				ok: false,
				reason:
					error instanceof Error ? `redis:${error.message}` : "redis:unknown"
			} as const
		} finally {
			if (timeoutHandle) clearTimeout(timeoutHandle)
		}
	}

	private getRetryDelay(attempt: number) {
		const base = this.deliveryPolicy.baseBackoffMs * 2 ** attempt
		const bounded = Math.min(base, this.deliveryPolicy.maxBackoffMs)
		const jitter = this.deliveryPolicy.jitterRatio
		const factor = 1 - jitter + Math.random() * jitter * 2
		return Math.max(0, Math.floor(bounded * factor))
	}

	private trackFailure(reason: string, eventType: string) {
		this.deliveryMetrics.lastFailureReason = reason
		this.deliveryMetrics.lastFailureEventType = eventType
		this.deliveryMetrics.lastFailureAt = Date.now()
		this.failureReasons.set(reason, (this.failureReasons.get(reason) ?? 0) + 1)
	}
}
