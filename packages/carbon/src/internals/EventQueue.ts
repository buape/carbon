import type { BaseListener } from "../abstracts/BaseListener.js"
import type { Client } from "../classes/Client.js"
import type {
	ListenerEventAdditionalData,
	ListenerEventRawData
} from "../types/index.js"

interface QueuedEvent<T extends keyof ListenerEventRawData> {
	payload: ListenerEventRawData[T] & ListenerEventAdditionalData
	type: T
	timestamp: number
}

export interface EventQueueOptions {
	/**
	 * Maximum number of events that can be queued before backpressure is applied
	 * @default 10000
	 */
	maxQueueSize?: number

	/**
	 * Maximum number of concurrent event processing operations
	 * @default 50
	 */
	maxConcurrency?: number

	/**
	 * Maximum time (in ms) a single listener can take before timing out
	 * @default 30000 (30 seconds)
	 */
	listenerTimeout?: number

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

export class EventQueue {
	private client: Client
	private queue: QueuedEvent<keyof ListenerEventRawData>[] = []
	private processing = 0
	private options: Required<EventQueueOptions>

	// Metrics
	private processedCount = 0
	private droppedCount = 0
	private timeoutCount = 0

	constructor(client: Client, options: EventQueueOptions = {}) {
		this.client = client
		this.options = {
			maxQueueSize: options.maxQueueSize ?? 10000,
			maxConcurrency: options.maxConcurrency ?? 50,
			listenerTimeout: options.listenerTimeout ?? 30000,
			logSlowListeners: options.logSlowListeners ?? true,
			slowListenerThreshold: options.slowListenerThreshold ?? 1000
		}
	}

	enqueue<T extends keyof ListenerEventRawData>(
		payload: ListenerEventRawData[T] & ListenerEventAdditionalData,
		type: T
	): boolean {
		if (this.queue.length >= this.options.maxQueueSize) {
			this.droppedCount++
			return false
		}

		this.queue.push({
			payload,
			type,
			timestamp: Date.now()
		})

		this.processNext()

		return true
	}

	private async processNext(): Promise<void> {
		if (
			this.processing >= this.options.maxConcurrency ||
			this.queue.length === 0
		) {
			return
		}

		const event = this.queue.shift()
		if (!event) return

		this.processing++

		this.processEvent(event)
			.catch((error) => {
				console.error("[EventQueue] Unexpected error processing event:", error)
			})
			.finally(() => {
				this.processing--
				this.processedCount++

				if (this.queue.length > 0) {
					this.processNext()
				}
			})
	}

	private async processEvent<T extends keyof ListenerEventRawData>(
		event: QueuedEvent<T>
	): Promise<void> {
		const listeners = this.client.listeners.filter((x) => x.type === event.type)

		await Promise.allSettled(
			listeners.map((listener) => this.processListener(listener, event))
		)
	}

	private async processListener<T extends keyof ListenerEventRawData>(
		listener: BaseListener,
		event: QueuedEvent<T>
	): Promise<void> {
		const startTime = Date.now()

		try {
			const timeoutPromise = new Promise<never>((_, reject) => {
				setTimeout(() => {
					reject(
						new Error(
							`Listener timeout after ${this.options.listenerTimeout}ms`
						)
					)
				}, this.options.listenerTimeout)
			})

			const data = listener.parseRawData(event.payload, this.client)
			await Promise.race([
				listener.handle(
					{ ...data, clientId: event.payload.clientId },
					this.client
				),
				timeoutPromise
			])

			const duration = Date.now() - startTime

			if (
				this.options.logSlowListeners &&
				duration >= this.options.slowListenerThreshold
			) {
				console.warn(
					`[EventQueue] Slow listener detected: ${listener.constructor.name} took ${duration}ms for event ${String(event.type)}`
				)
			}
		} catch (error) {
			if (error instanceof Error && error.message.includes("timeout")) {
				this.timeoutCount++
				console.error(
					`[EventQueue] Listener ${listener.constructor.name} timed out after ${this.options.listenerTimeout}ms for event ${String(event.type)}`
				)
			} else {
				console.error(
					`[EventQueue] Listener ${listener.constructor.name} failed for event ${String(event.type)}:`,
					error
				)
			}
		}
	}

	getMetrics() {
		return {
			queueSize: this.queue.length,
			processing: this.processing,
			processed: this.processedCount,
			dropped: this.droppedCount,
			timeouts: this.timeoutCount,
			maxQueueSize: this.options.maxQueueSize,
			maxConcurrency: this.options.maxConcurrency
		}
	}

	hasCapacity(): boolean {
		return this.queue.length < this.options.maxQueueSize
	}

	getUtilization(): number {
		return this.queue.length / this.options.maxQueueSize
	}
}
