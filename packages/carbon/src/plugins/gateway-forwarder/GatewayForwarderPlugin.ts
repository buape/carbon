import { createPrivateKey, sign } from "node:crypto"
import {
	type APIWebhookEvent,
	ApplicationWebhookType
} from "discord-api-types/v10"
import { createBoundedExecutor } from "../../internals/BoundedExecutor.js"
import type { ListenerEventType } from "../../types/index.js"
import { concatUint8Arrays, valueToUint8Array } from "../../utils/index.js"
import { GatewayPlugin } from "../gateway/GatewayPlugin.js"
import type { GatewayPayload, GatewayPluginOptions } from "../gateway/types.js"

type RuntimeProfile = "serverless" | "persistent"

export interface GatewayForwarderDeliveryOptions {
	timeoutMs?: number
	maxRetries?: number
	baseBackoffMs?: number
	maxBackoffMs?: number
	jitterRatio?: number
	maxInFlight?: number
	maxQueueSize?: number
	retryStatusCodes?: number[]
}

export interface GatewayForwarderPluginOptions extends GatewayPluginOptions {
	/**
	 * The URL to forward webhook events to.
	 * Typically this is your base URL in the client, and then `/events`
	 */
	webhookUrl: string
	/**
	 * Optional headers to add to the webhook request.
	 */
	webhookHeaders?: Record<string, string>
	/**
	 * Runtime profile that controls delivery defaults.
	 *
	 * @default "serverless"
	 */
	runtimeProfile?: RuntimeProfile
	/**
	 * Delivery policy for forwarded events.
	 */
	delivery?: GatewayForwarderDeliveryOptions
	/**
	 * Custom fetch for forwarding delivery.
	 */
	fetch?: (
		input: string | URL | Request,
		init?: RequestInit
	) => Promise<Response>
	/**
	 * The ed25519 private key in PEM format, used to sign forwarded events.
	 * This should include the BEGIN/END markers. When loading from an environment
	 * variable, the newlines can be escaped (\\n).
	 */
	privateKey: string
}

type DeliveryTask = {
	eventType: string
	body: string
	signatureHex: string
	timestamp: string
	eventId: string
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
		maxQueueSize: 2000,
		retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504]
	},
	persistent: {
		timeoutMs: 6000,
		maxRetries: 3,
		baseBackoffMs: 250,
		maxBackoffMs: 4000,
		jitterRatio: 0.2,
		maxInFlight: 16,
		maxQueueSize: 8000,
		retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504]
	}
} satisfies Record<RuntimeProfile, Required<GatewayForwarderDeliveryOptions>>

export class GatewayForwarderPlugin extends GatewayPlugin {
	override readonly id = "gateway-forwarder" as "gateway"

	readonly options: GatewayForwarderPluginOptions
	private privateKey: ReturnType<typeof createPrivateKey>
	private guildAvailabilityCache: Map<string, boolean> = new Map()
	private deliveryPolicy: Required<GatewayForwarderDeliveryOptions>
	private deliveryExecutor!: ReturnType<
		typeof createBoundedExecutor<DeliveryTask>
	>
	private forwardFetch:
		| ((input: string | URL | Request, init?: RequestInit) => Promise<Response>)
		| undefined
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

	constructor(options: GatewayForwarderPluginOptions) {
		if (!options.privateKey) {
			throw new Error("privateKey is required for GatewayForwarderPlugin")
		}

		super(options)
		const profile = options.runtimeProfile ?? "serverless"
		const defaults = deliveryDefaults[profile]
		this.deliveryPolicy = {
			...defaults,
			...options.delivery,
			retryStatusCodes:
				options.delivery?.retryStatusCodes ?? defaults.retryStatusCodes
		}
		assertPositiveInteger(
			"delivery.maxInFlight",
			this.deliveryPolicy.maxInFlight
		)
		this.forwardFetch = options.fetch
		this.deliveryExecutor = createBoundedExecutor<DeliveryTask>({
			concurrency: this.deliveryPolicy.maxInFlight,
			run: async (task) => {
				await this.deliver(task)
			},
			getQueuedAt: (task) => task.enqueuedAt
		})

		try {
			const keyString = options.privateKey.replace(/\\n/g, "\n")
			this.privateKey = createPrivateKey({
				key: keyString,
				format: "pem"
			})
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error)
			throw new Error(`Failed to parse private key: ${message}`)
		}
		this.options = options
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

					const timestamp = Date.now()
					const timestampString = timestamp.toString()
					const webhookEvent: APIWebhookEvent = {
						version: 1,
						application_id: this.client?.options.clientId || "unknown",
						type: ApplicationWebhookType.Event,
						event: {
							type: forwardedType,
							timestamp: new Date().toISOString(),
							data: payload.d
						} as APIWebhookEvent["event"]
					}

					const body = JSON.stringify(webhookEvent)
					const timestampData = valueToUint8Array(timestampString)
					const bodyData = valueToUint8Array(body)
					const message = concatUint8Arrays(timestampData, bodyData)
					const signature = sign(null, message, this.privateKey)
					const signatureHex = signature.toString("hex")

					this.enqueueDelivery({
						eventType: forwardedType,
						body,
						signatureHex,
						timestamp: timestampString,
						eventId: `${forwardedType}:${timestampString}:${Math.random().toString(16).slice(2)}`,
						attempt: 0,
						enqueuedAt: Date.now()
					})
				}
			} catch (error) {
				console.error("Error forwarding webhook event:", error)
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
			const response = await this.sendWithTimeout(task, attempt)
			if (response.ok) {
				this.deliveryMetrics.sent += 1
				this.deliveryMetrics.lastSuccessAt = Date.now()
				return
			}

			const finalAttempt = attempt >= this.deliveryPolicy.maxRetries
			if (!response.retryable || finalAttempt) {
				this.deliveryMetrics.failed += 1
				this.trackFailure(response.reason, task.eventType)
				console.error(
					JSON.stringify({
						scope: "gateway-forwarder",
						level: "error",
						type: "delivery-failed",
						eventType: task.eventType,
						reason: response.reason,
						attempt: attempt + 1,
						maxAttempts: this.deliveryPolicy.maxRetries + 1
					})
				)
				return
			}

			this.deliveryMetrics.retried += 1
			await sleep(this.getRetryDelay(attempt))
		}
	}

	private async sendWithTimeout(task: DeliveryTask, attempt: number) {
		const controller = new AbortController()
		const timeout = setTimeout(() => {
			controller.abort("forwarder-timeout")
		}, this.deliveryPolicy.timeoutMs)

		const headers = new Headers(this.options.webhookHeaders)
		headers.set("Content-Type", "application/json")
		headers.set("X-Signature-Ed25519", task.signatureHex)
		headers.set("X-Signature-Timestamp", task.timestamp)
		headers.set("X-Carbon-Forwarder-Event-Id", task.eventId)
		headers.set("X-Carbon-Forwarder-Attempt", String(attempt + 1))

		const forwardFetch = this.forwardFetch ?? fetch
		try {
			const response = await forwardFetch(this.options.webhookUrl, {
				method: "POST",
				headers,
				body: task.body,
				signal: controller.signal
			})
			await response.text().catch(() => {})

			if (response.ok) {
				return {
					ok: true,
					retryable: false,
					reason: "ok"
				} as const
			}

			const reason = `http_${response.status}`
			return {
				ok: false,
				retryable: this.deliveryPolicy.retryStatusCodes.includes(
					response.status
				),
				reason
			} as const
		} catch (error) {
			if (controller.signal.aborted) {
				this.deliveryMetrics.timeouts += 1
				return {
					ok: false,
					retryable: true,
					reason: "timeout"
				} as const
			}
			return {
				ok: false,
				retryable: true,
				reason:
					error instanceof Error
						? `network:${error.message}`
						: "network:unknown"
			} as const
		} finally {
			clearTimeout(timeout)
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

function assertPositiveInteger(name: string, value: number) {
	if (!Number.isInteger(value) || value < 1) {
		throw new Error(`${name} must be an integer greater than or equal to 1`)
	}
}

const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)))
