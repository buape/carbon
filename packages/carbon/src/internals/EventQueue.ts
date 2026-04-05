import type { BaseListener } from "../abstracts/BaseListener.js"
import type { Client } from "../classes/Client.js"
import type {
	ListenerEventAdditionalData,
	ListenerEventRawData
} from "../types/index.js"

type RuntimeProfile = "serverless" | "persistent"
type EventQueueLane = "critical" | "standard" | "background"

interface QueuedEvent<T extends keyof ListenerEventRawData> {
	payload: ListenerEventRawData[T] & ListenerEventAdditionalData
	type: T
	timestamp: number
	lane: EventQueueLane
}

export interface EventQueueLaneOptions {
	maxQueueSize?: number
	maxConcurrency?: number
	listenerTimeout?: number
	listenerConcurrency?: number
	maxEventAgeMs?: number
}

export interface EventQueueOptions {
	runtimeProfile?: RuntimeProfile
	lanes?: Partial<Record<EventQueueLane, EventQueueLaneOptions>>

	/**
	 * Global fallback maximum queue size.
	 */
	maxQueueSize?: number
	/**
	 * Global fallback max event concurrency.
	 */
	maxConcurrency?: number
	/**
	 * Global fallback listener timeout.
	 */
	listenerTimeout?: number
	/**
	 * Global fallback per-event listener concurrency.
	 */
	listenerConcurrency?: number

	yieldIntervalMs?: number
	/**
	 * Whether to log slow listeners
	 * @default true
	 */
	logSlowListeners?: boolean
	/**
	 * Threshold (in ms) for logging slow listeners
	 * @default 1000 (1 second)
	 */
	slowListenerThreshold?: number
}

const criticalEvents = new Set([
	"INTERACTION_CREATE",
	"APPLICATION_AUTHORIZED",
	"APPLICATION_DEAUTHORIZED"
])

const standardEventPrefixes = [
	"MESSAGE_",
	"CHANNEL_",
	"THREAD_",
	"VOICE_",
	"GUILD_MEMBER_"
]

const laneProfileDefaults = {
	serverless: {
		critical: {
			maxQueueSize: 5000,
			maxConcurrency: 20,
			listenerTimeout: 8000,
			listenerConcurrency: 5,
			maxEventAgeMs: 20_000
		},
		standard: {
			maxQueueSize: 3500,
			maxConcurrency: 12,
			listenerTimeout: 12_000,
			listenerConcurrency: 4,
			maxEventAgeMs: 15_000
		},
		background: {
			maxQueueSize: 1500,
			maxConcurrency: 6,
			listenerTimeout: 6000,
			listenerConcurrency: 2,
			maxEventAgeMs: 8000
		}
	},
	persistent: {
		critical: {
			maxQueueSize: 12_000,
			maxConcurrency: 40,
			listenerTimeout: 20_000,
			listenerConcurrency: 10,
			maxEventAgeMs: 60_000
		},
		standard: {
			maxQueueSize: 10_000,
			maxConcurrency: 24,
			listenerTimeout: 25_000,
			listenerConcurrency: 8,
			maxEventAgeMs: 45_000
		},
		background: {
			maxQueueSize: 6000,
			maxConcurrency: 12,
			listenerTimeout: 15_000,
			listenerConcurrency: 4,
			maxEventAgeMs: 20_000
		}
	}
} satisfies Record<
	RuntimeProfile,
	Record<EventQueueLane, Required<EventQueueLaneOptions>>
>

export class EventQueue {
	private client: Client
	private queues: Record<
		EventQueueLane,
		QueuedEvent<keyof ListenerEventRawData>[]
	> = {
		critical: [],
		standard: [],
		background: []
	}
	private processingByLane = {
		critical: 0,
		standard: 0,
		background: 0
	}
	private options: {
		lanes: Record<EventQueueLane, Required<EventQueueLaneOptions>>
		yieldIntervalMs: number
		logSlowListeners: boolean
		slowListenerThreshold: number
	}
	private lastYieldAt = 0

	private processedCount = 0
	private droppedCount = 0
	private droppedStaleCount = 0
	private timeoutCount = 0
	private zombieExecutionCount = 0

	constructor(client: Client, options: EventQueueOptions = {}) {
		this.client = client
		const profile =
			options.runtimeProfile ??
			client.options.runtimeProfile ??
			("serverless" satisfies RuntimeProfile)
		const defaults = laneProfileDefaults[profile]
		const fallbackQueueSize = Math.max(1, options.maxQueueSize ?? 10_000)
		const fallbackConcurrency = Math.max(1, options.maxConcurrency ?? 50)
		const fallbackTimeout = Math.max(500, options.listenerTimeout ?? 30_000)
		const fallbackListenerConcurrency = Math.max(
			1,
			options.listenerConcurrency ?? 10
		)

		const laneInput = {
			critical: options.lanes?.critical,
			standard: options.lanes?.standard,
			background: options.lanes?.background
		}

		this.options = {
			lanes: {
				critical: {
					maxQueueSize:
						laneInput.critical?.maxQueueSize ??
						options.maxQueueSize ??
						defaults.critical.maxQueueSize ??
						fallbackQueueSize,
					maxConcurrency:
						laneInput.critical?.maxConcurrency ??
						options.maxConcurrency ??
						defaults.critical.maxConcurrency ??
						fallbackConcurrency,
					listenerTimeout:
						laneInput.critical?.listenerTimeout ??
						options.listenerTimeout ??
						defaults.critical.listenerTimeout ??
						fallbackTimeout,
					listenerConcurrency:
						laneInput.critical?.listenerConcurrency ??
						options.listenerConcurrency ??
						defaults.critical.listenerConcurrency ??
						fallbackListenerConcurrency,
					maxEventAgeMs:
						laneInput.critical?.maxEventAgeMs ?? defaults.critical.maxEventAgeMs
				},
				standard: {
					maxQueueSize:
						laneInput.standard?.maxQueueSize ??
						options.maxQueueSize ??
						defaults.standard.maxQueueSize ??
						fallbackQueueSize,
					maxConcurrency:
						laneInput.standard?.maxConcurrency ??
						options.maxConcurrency ??
						defaults.standard.maxConcurrency ??
						fallbackConcurrency,
					listenerTimeout:
						laneInput.standard?.listenerTimeout ??
						options.listenerTimeout ??
						defaults.standard.listenerTimeout ??
						fallbackTimeout,
					listenerConcurrency:
						laneInput.standard?.listenerConcurrency ??
						options.listenerConcurrency ??
						defaults.standard.listenerConcurrency ??
						fallbackListenerConcurrency,
					maxEventAgeMs:
						laneInput.standard?.maxEventAgeMs ?? defaults.standard.maxEventAgeMs
				},
				background: {
					maxQueueSize:
						laneInput.background?.maxQueueSize ??
						options.maxQueueSize ??
						defaults.background.maxQueueSize ??
						fallbackQueueSize,
					maxConcurrency:
						laneInput.background?.maxConcurrency ??
						options.maxConcurrency ??
						defaults.background.maxConcurrency ??
						fallbackConcurrency,
					listenerTimeout:
						laneInput.background?.listenerTimeout ??
						options.listenerTimeout ??
						defaults.background.listenerTimeout ??
						fallbackTimeout,
					listenerConcurrency:
						laneInput.background?.listenerConcurrency ??
						options.listenerConcurrency ??
						defaults.background.listenerConcurrency ??
						fallbackListenerConcurrency,
					maxEventAgeMs:
						laneInput.background?.maxEventAgeMs ??
						defaults.background.maxEventAgeMs
				}
			},
			yieldIntervalMs: options.yieldIntervalMs ?? 0,
			logSlowListeners: options.logSlowListeners ?? true,
			slowListenerThreshold: options.slowListenerThreshold ?? 1000
		}
	}

	enqueue<T extends keyof ListenerEventRawData>(
		payload: ListenerEventRawData[T] & ListenerEventAdditionalData,
		type: T
	): boolean {
		const lane = this.getLane(type)
		if (this.queues[lane].length >= this.options.lanes[lane].maxQueueSize) {
			this.droppedCount += 1
			return false
		}

		this.queues[lane].push({
			payload,
			type,
			timestamp: Date.now(),
			lane
		})

		this.processLane(lane)
		return true
	}

	private processLane(lane: EventQueueLane): void {
		while (
			this.processingByLane[lane] < this.options.lanes[lane].maxConcurrency &&
			this.queues[lane].length > 0
		) {
			const event = this.queues[lane].shift()
			if (!event) return
			this.processingByLane[lane] += 1
			void this.processEvent(event)
				.catch((error) => {
					console.error(
						"[EventQueue] Unexpected error processing event:",
						error
					)
				})
				.finally(() => {
					this.processingByLane[lane] -= 1
					this.processedCount += 1
					this.processLane(lane)
				})
		}
	}

	private async processEvent<T extends keyof ListenerEventRawData>(
		event: QueuedEvent<T>
	): Promise<void> {
		const laneConfig = this.options.lanes[event.lane]
		const age = Date.now() - event.timestamp
		if (age > laneConfig.maxEventAgeMs) {
			this.droppedCount += 1
			this.droppedStaleCount += 1
			return
		}

		const listeners = this.client.listeners.filter((x) => x.type === event.type)
		const concurrency = Math.max(
			1,
			Math.min(laneConfig.listenerConcurrency, listeners.length || 1)
		)

		let index = 0
		const runNext = async (): Promise<void> => {
			while (index < listeners.length) {
				const listener = listeners[index++]
				if (!listener) continue
				await this.maybeYield()
				await this.processListener(listener, event, laneConfig.listenerTimeout)
			}
		}

		const workers = Array.from({ length: concurrency }, () => runNext())
		await Promise.allSettled(workers)
	}

	private async processListener<T extends keyof ListenerEventRawData>(
		listener: BaseListener,
		event: QueuedEvent<T>,
		listenerTimeout: number
	): Promise<void> {
		const startTime = Date.now()
		const abortController = new AbortController()
		let timeoutId: ReturnType<typeof setTimeout> | undefined
		let timedOut = false
		let listenerPromise: Promise<void> | null = null

		try {
			const data = listener.parseRawData(event.payload, this.client)
			listenerPromise = listener.handle(
				{
					...data,
					clientId: event.payload.clientId,
					abortSignal: abortController.signal
				},
				this.client
			)

			const timeoutPromise = new Promise<never>((_, reject) => {
				timeoutId = setTimeout(() => {
					timedOut = true
					abortController.abort("listener-timeout")
					reject(new Error(`Listener timeout after ${listenerTimeout}ms`))
				}, listenerTimeout)
			})

			await Promise.race([listenerPromise, timeoutPromise])
			const duration = Date.now() - startTime

			if (
				this.options.logSlowListeners &&
				duration >= this.options.slowListenerThreshold
			) {
				console.warn(
					JSON.stringify({
						scope: "event-queue",
						level: "warn",
						type: "slow-listener",
						listener: listener.constructor.name,
						eventType: String(event.type),
						durationMs: duration,
						lane: event.lane
					})
				)
			}
		} catch (error) {
			if (timedOut) {
				this.timeoutCount += 1
				this.zombieExecutionCount += 1
				listenerPromise
					?.catch(() => {})
					.finally(() => {
						this.zombieExecutionCount = Math.max(
							0,
							this.zombieExecutionCount - 1
						)
					})
				console.error(
					JSON.stringify({
						scope: "event-queue",
						level: "error",
						type: "listener-timeout",
						listener: listener.constructor.name,
						eventType: String(event.type),
						lane: event.lane,
						timeoutMs: listenerTimeout
					})
				)
				return
			}
			console.error(
				JSON.stringify({
					scope: "event-queue",
					level: "error",
					type: "listener-failure",
					listener: listener.constructor.name,
					eventType: String(event.type),
					lane: event.lane,
					error: error instanceof Error ? error.message : String(error)
				})
			)
		} finally {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	}

	private getLane(type: keyof ListenerEventRawData): EventQueueLane {
		const event = String(type)
		if (criticalEvents.has(event)) {
			return "critical"
		}
		if (standardEventPrefixes.some((prefix) => event.startsWith(prefix))) {
			return "standard"
		}
		return "background"
	}

	private async maybeYield(): Promise<void> {
		if (this.options.yieldIntervalMs <= 0) return
		const now = Date.now()
		if (now - this.lastYieldAt < this.options.yieldIntervalMs) return
		this.lastYieldAt = now
		await new Promise<void>((resolve) => {
			if (typeof setImmediate === "function") {
				setImmediate(resolve)
				return
			}
			setTimeout(resolve, 0)
		})
	}

	getMetrics() {
		const queueSizeByLane = {
			critical: this.queues.critical.length,
			standard: this.queues.standard.length,
			background: this.queues.background.length
		}
		const processingByLane = {
			...this.processingByLane
		}
		const oldestAgeMsByLane = {
			critical: this.getOldestAgeMs("critical"),
			standard: this.getOldestAgeMs("standard"),
			background: this.getOldestAgeMs("background")
		}

		return {
			queueSize:
				queueSizeByLane.critical +
				queueSizeByLane.standard +
				queueSizeByLane.background,
			queueSizeByLane,
			processingByLane,
			processed: this.processedCount,
			dropped: this.droppedCount,
			droppedStale: this.droppedStaleCount,
			timeouts: this.timeoutCount,
			zombieExecutions: this.zombieExecutionCount,
			oldestAgeMsByLane,
			laneConfig: this.options.lanes
		}
	}

	hasCapacity(): boolean {
		return (
			this.queues.critical.length < this.options.lanes.critical.maxQueueSize ||
			this.queues.standard.length < this.options.lanes.standard.maxQueueSize ||
			this.queues.background.length < this.options.lanes.background.maxQueueSize
		)
	}

	getUtilization(): number {
		const totalQueued =
			this.queues.critical.length +
			this.queues.standard.length +
			this.queues.background.length
		const totalCapacity =
			this.options.lanes.critical.maxQueueSize +
			this.options.lanes.standard.maxQueueSize +
			this.options.lanes.background.maxQueueSize
		return totalQueued / totalCapacity
	}

	private getOldestAgeMs(lane: EventQueueLane) {
		const head = this.queues[lane][0]
		if (!head) return 0
		return Math.max(0, Date.now() - head.timestamp)
	}
}
