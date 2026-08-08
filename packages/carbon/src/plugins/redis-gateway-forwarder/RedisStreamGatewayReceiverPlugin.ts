import { Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"
import type { ListenerEventType } from "../../types/index.js"
import type { RedisStreamClient } from "./types.js"

export interface RedisStreamGatewayReceiverPluginOptions {
	/** Non-blocking connection used for XGROUP/XACK/XAUTOCLAIM admin commands. */
	redis: RedisStreamClient
	/**
	 * A dedicated connection (e.g. `redis.duplicate()`) used exclusively for the
	 * blocking XREADGROUP read loop. Must not be shared with `redis` or any
	 * other blocking/subscribe usage — a connection blocked in XREADGROUP can't
	 * service other commands until the block returns.
	 */
	blockingRedis: RedisStreamClient
	/** Redis consumer group name shared by every processor replica. */
	consumerGroup: string
	/** Unique consumer name for this process/replica, e.g. `${hostname}:${pid}`. */
	consumerName: string
	/**
	 * Prefix used to derive the per-client stream key (`<prefix>:<clientId>`).
	 * Must match the sender's `streamKeyPrefix`.
	 *
	 * @default "carbon:events"
	 */
	streamKeyPrefix?: string
	/**
	 * How long each `XREADGROUP` blocks waiting for new entries, in ms. This
	 * is a real blocking wait, not a poll — Redis holds the connection open
	 * and replies the instant an entry lands on any watched stream (or when
	 * `blockMs` elapses with nothing new), so there's no busy looping while
	 * traffic is flowing. The bound only matters for two edge cases: noticing
	 * a stream `registerClient`'d during a total lull with zero events across
	 * every other watched stream, and pacing the periodic `XAUTOCLAIM` sweep
	 * (see `autoclaimIntervalMs`) — both of which are naturally rare since a
	 * live gateway connection is rarely fully silent.
	 *
	 * @default 5000
	 */
	blockMs?: number
	/** Max entries read per stream per XREADGROUP call.
	 *
	 * @default 50
	 */
	batchCount?: number
	/** How often to sweep for stale pending entries from dead consumers, in ms.
	 *
	 * @default 30_000
	 */
	autoclaimIntervalMs?: number
	/** Minimum idle time before a pending entry is considered stale/claimable.
	 *
	 * @default 30_000
	 */
	autoclaimMinIdleMs?: number
	/** Called when a client's event queue is full and an entry is left unacked. */
	onBackpressure?: (clientId: string) => void
	/** Called when dispatching an entry to a client's listeners throws. */
	onDeliverError?: (clientId: string, error: unknown) => void
	/**
	 * Called when creating a client's consumer group fails for a reason other
	 * than the group already existing (e.g. the stream's Redis is briefly
	 * unreachable). The client is still watched — its stream just won't be
	 * read from a Redis-level consumer group until this succeeds, so a later
	 * `registerClient` call (or Carbon's own client-recreate path) can recover.
	 */
	onRegisterError?: (clientId: string, error: unknown) => void
	/**
	 * Called for every entry successfully delivered to a client's listeners,
	 * with the end-to-end latency (ms) from when the forwarder first received
	 * the gateway event (the entry's `ts` field) to right now. `isReplay` is
	 * true for entries delivered via the own-pending drain or an `XAUTOCLAIM`
	 * sweep rather than a fresh `>` read — a high replay latency reflects
	 * recovery time (a stalled consumer, a processor restart), not steady-state
	 * pipeline latency, so callers should usually track these separately.
	 */
	onDeliveryLatency?: (
		clientId: string,
		latencyMs: number,
		context: { isReplay: boolean }
	) => void
}

// Only used when there is nothing to wait on yet (no client has registered a
// stream at all) — there's no backoff timer or blocking read to compute a
// precise wake time from, so this is a genuine, if rare, poll.
const idlePollMs = 1000
const minBackoffWaitMs = 25
const baseBackoffMs = 200
const maxBackoffMs = 10_000
const autoclaimMaxPages = 10

/**
 * Receives gateway events from Redis Streams (one stream per client),
 * multiplexed through a single blocking XREADGROUP loop shared across every
 * client `registerClient`s this plugin instance with. Meant to be
 * instantiated once and passed to a `ClientManager`'s shared `initialPlugins`
 * (the same pattern `SayPlugin`/`CommandDataPlugin` already rely on), so
 * `registerClient` is called once per tenant `Client`.
 *
 * Errors are reported through the `onRegisterError`/`onDeliverError`/
 * `onBackpressure` callbacks, never by throwing. `registerClient` is called
 * by Carbon's `Client` constructor without being awaited (constructors can't
 * be async), and the read loop is a detached background task with no caller
 * either — a thrown error in either place would only surface as an unhandled
 * promise rejection (which can crash the process) rather than reach anything
 * that could catch it. The callbacks give the host application an explicit,
 * safe place to observe and log these failures instead.
 */
export class RedisStreamGatewayReceiverPlugin extends Plugin {
	readonly id = "redis-gateway-receiver"

	private readonly options: Required<
		Pick<
			RedisStreamGatewayReceiverPluginOptions,
			| "redis"
			| "blockingRedis"
			| "consumerGroup"
			| "consumerName"
			| "streamKeyPrefix"
			| "blockMs"
			| "batchCount"
			| "autoclaimIntervalMs"
			| "autoclaimMinIdleMs"
		>
	> &
		Pick<
			RedisStreamGatewayReceiverPluginOptions,
			| "onBackpressure"
			| "onDeliverError"
			| "onRegisterError"
			| "onDeliveryLatency"
		>

	private watchedStreams = new Map<
		string,
		{ client: Client; streamKey: string }
	>()
	private backoffUntil = new Map<string, number>()
	private backoffAttempt = new Map<string, number>()
	private loopRunning = false
	private stopRequested = false
	private lastAutoclaimAt = 0
	private metrics = {
		backpressureSkips: 0,
		autoclaimReclaimed: 0,
		pendingDrainReplayed: 0,
		processed: 0,
		failed: 0
	}

	constructor(options: RedisStreamGatewayReceiverPluginOptions) {
		super()
		this.options = {
			streamKeyPrefix: "carbon:events",
			blockMs: 5000,
			batchCount: 50,
			autoclaimIntervalMs: 30_000,
			autoclaimMinIdleMs: 30_000,
			...options
		}
	}

	async registerClient(client: Client): Promise<void> {
		const streamKey = `${this.options.streamKeyPrefix}:${client.clientId}`
		this.watchedStreams.set(client.clientId, { client, streamKey })

		const xgroup = this.bindCommand(this.options.redis, "xgroup")
		try {
			await xgroup(
				"CREATE",
				streamKey,
				this.options.consumerGroup,
				"$",
				"MKSTREAM"
			)
		} catch (error) {
			if (!(error instanceof Error && error.message.includes("BUSYGROUP"))) {
				this.options.onRegisterError?.(client.clientId, error)
			}
		}

		if (!this.loopRunning) {
			this.loopRunning = true
			this.stopRequested = false
			void this.runLoop()
		}
	}

	/**
	 * Stops watching a client's stream. Deliberately does not destroy the
	 * consumer group or delete the stream — a disabled-then-re-enabled client
	 * should resume from anything still pending, not lose it.
	 */
	detach(clientId: string): void {
		this.watchedStreams.delete(clientId)
	}

	/**
	 * Signals the read loop to stop after its current blocking call returns
	 * (up to `blockMs`). Does not touch the injected connections — the caller
	 * owns their lifecycle and can disconnect `blockingRedis` itself right
	 * after calling `stop()` for a faster shutdown.
	 */
	stop(): void {
		this.stopRequested = true
	}

	getMetrics() {
		return {
			watchedStreamCount: this.watchedStreams.size,
			...this.metrics
		}
	}

	private bindCommand(
		client: RedisStreamClient,
		name: "xgroup" | "xack" | "xautoclaim" | "xreadgroup"
	): (...args: (string | number)[]) => Promise<unknown> {
		return (
			client[name] as unknown as (
				...args: (string | number)[]
			) => Promise<unknown>
		).bind(client)
	}

	private isBackedOff(streamKey: string): boolean {
		const until = this.backoffUntil.get(streamKey)
		return typeof until === "number" && until > Date.now()
	}

	private setBackoff(streamKey: string): void {
		const attempt = (this.backoffAttempt.get(streamKey) ?? 0) + 1
		this.backoffAttempt.set(streamKey, attempt)
		const delay = Math.min(baseBackoffMs * 2 ** (attempt - 1), maxBackoffMs)
		this.backoffUntil.set(streamKey, Date.now() + delay)
	}

	private clearBackoff(streamKey: string): void {
		this.backoffAttempt.delete(streamKey)
		this.backoffUntil.delete(streamKey)
	}

	/**
	 * Milliseconds until the soonest backoff among `streams` clears, so a
	 * fully-backed-off loop iteration can sleep exactly that long instead of
	 * polling on a fixed interval.
	 */
	private getBackoffWaitMs(streams: Array<{ streamKey: string }>): number {
		const now = Date.now()
		let soonest = Number.POSITIVE_INFINITY
		for (const { streamKey } of streams) {
			const until = this.backoffUntil.get(streamKey)
			if (typeof until === "number") {
				soonest = Math.min(soonest, until - now)
			}
		}
		if (!Number.isFinite(soonest)) return minBackoffWaitMs
		return Math.max(minBackoffWaitMs, soonest)
	}

	private async runLoop(): Promise<void> {
		try {
			while (!this.stopRequested) {
				const watched = [...this.watchedStreams.values()]
				if (watched.length === 0) {
					await new Promise((resolve) => {
						setTimeout(resolve, idlePollMs)
					})
					continue
				}

				if (
					Date.now() - this.lastAutoclaimAt >
					this.options.autoclaimIntervalMs
				) {
					await this.runAutoclaimSweep(watched)
					this.lastAutoclaimAt = Date.now()
				}

				const activeStreams = watched.filter(
					(entry) => !this.isBackedOff(entry.streamKey)
				)
				if (activeStreams.length === 0) {
					await new Promise((resolve) => {
						setTimeout(resolve, this.getBackoffWaitMs(watched))
					})
					continue
				}

				// Always drain each active stream's own previously-delivered-but-
				// unacked entries before reading new ones. This covers both an
				// unclean restart reusing this consumer name, and a stream
				// recovering from a backpressure backoff (`>` only ever returns
				// entries this consumer hasn't already been handed, so a skipped
				// entry can only be retried through an explicit "0" read).
				await this.drainPending(activeStreams)
				const stillActive = activeStreams.filter(
					(entry) => !this.isBackedOff(entry.streamKey)
				)
				if (stillActive.length === 0) {
					await new Promise((resolve) => {
						setTimeout(resolve, this.getBackoffWaitMs(activeStreams))
					})
					continue
				}

				await this.readNewEntries(stillActive)
			}
		} finally {
			this.loopRunning = false
		}
	}

	private async drainPending(
		watched: Array<{ streamKey: string }>
	): Promise<void> {
		const xreadgroup = this.bindCommand(
			this.options.blockingRedis,
			"xreadgroup"
		)
		const streamKeys = watched.map((entry) => entry.streamKey)
		const result = (await xreadgroup(
			"GROUP",
			this.options.consumerGroup,
			this.options.consumerName,
			"COUNT",
			this.options.batchCount,
			"STREAMS",
			...streamKeys,
			...streamKeys.map(() => "0")
		)) as
			| [streamKey: string, entries: [id: string, fields: string[] | null][]][]
			| null
		if (!result) return
		await this.processResult(result, { isReplay: true })
	}

	private async readNewEntries(
		watched: Array<{ streamKey: string }>
	): Promise<void> {
		const xreadgroup = this.bindCommand(
			this.options.blockingRedis,
			"xreadgroup"
		)
		const streamKeys = watched.map((entry) => entry.streamKey)
		const result = (await xreadgroup(
			"GROUP",
			this.options.consumerGroup,
			this.options.consumerName,
			"BLOCK",
			this.options.blockMs,
			"COUNT",
			this.options.batchCount,
			"STREAMS",
			...streamKeys,
			...streamKeys.map(() => ">")
		)) as
			| [streamKey: string, entries: [id: string, fields: string[] | null][]][]
			| null
		if (!result) return
		await this.processResult(result, { isReplay: false })
	}

	private async processResult(
		result: [
			streamKey: string,
			entries: [id: string, fields: string[] | null][]
		][],
		{ isReplay }: { isReplay: boolean }
	): Promise<void> {
		for (const [streamKey, entries] of result) {
			const watched = [...this.watchedStreams.values()].find(
				(entry) => entry.streamKey === streamKey
			)
			if (!watched) continue

			for (const [id, fields] of entries) {
				if (!fields || fields.length === 0) {
					// Entry data is gone (e.g. trimmed by MAXLEN) but still pending;
					// nothing left to deliver, so just clear it from the PEL.
					await this.ack(streamKey, id)
					continue
				}

				let type = "unknown"
				let data: unknown = null
				let enqueuedAt: number | undefined
				for (let i = 0; i < fields.length; i += 2) {
					const field = fields[i]
					const value = fields[i + 1]
					if (field === "type" && typeof value === "string") {
						type = value
					}
					if (field === "data" && typeof value === "string") {
						try {
							data = JSON.parse(value)
						} catch {
							data = null
						}
					}
					if (field === "ts" && typeof value === "string") {
						const parsed = Number(value)
						if (Number.isFinite(parsed)) enqueuedAt = parsed
					}
				}
				let enqueued: boolean
				try {
					enqueued = watched.client.eventHandler.handleEvent(
						{ ...(data as object), clientId: watched.client.clientId },
						type as ListenerEventType
					)
				} catch (error) {
					this.metrics.failed += 1
					this.options.onDeliverError?.(watched.client.clientId, error)
					this.setBackoff(streamKey)
					break
				}

				if (!enqueued) {
					this.metrics.backpressureSkips += 1
					this.options.onBackpressure?.(watched.client.clientId)
					this.setBackoff(streamKey)
					break
				}

				this.clearBackoff(streamKey)
				this.metrics.processed += 1
				if (isReplay) this.metrics.pendingDrainReplayed += 1
				if (enqueuedAt !== undefined) {
					this.options.onDeliveryLatency?.(
						watched.client.clientId,
						Math.max(0, Date.now() - enqueuedAt),
						{ isReplay }
					)
				}
				await this.ack(streamKey, id)
			}
		}
	}

	private async runAutoclaimSweep(
		watched: Array<{ streamKey: string }>
	): Promise<void> {
		const xautoclaim = this.bindCommand(this.options.redis, "xautoclaim")
		for (const { streamKey } of watched) {
			let cursor = "0-0"
			for (let page = 0; page < autoclaimMaxPages; page += 1) {
				const result = (await xautoclaim(
					streamKey,
					this.options.consumerGroup,
					this.options.consumerName,
					this.options.autoclaimMinIdleMs,
					cursor,
					"COUNT",
					this.options.batchCount
				).catch(() => null)) as
					| [string, [id: string, fields: string[] | null][], string[]?]
					| null
				if (!result) break

				const [nextCursor, claimed] = result
				if (claimed.length > 0) {
					this.metrics.autoclaimReclaimed += claimed.length
					await this.processResult([[streamKey, claimed]], { isReplay: true })
				}

				cursor = nextCursor
				if (cursor === "0-0" || claimed.length === 0) break
			}
		}
	}

	private async ack(streamKey: string, id: string): Promise<void> {
		const xack = this.bindCommand(this.options.redis, "xack")
		await xack(streamKey, this.options.consumerGroup, id).catch(() => {})
	}
}
