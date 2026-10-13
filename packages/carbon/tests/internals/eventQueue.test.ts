import { afterEach, expect, test, vi } from "vitest"
import { BaseListener } from "../../src/abstracts/BaseListener.js"
import { EventQueue } from "../../src/internals/EventQueue.js"
import {
	ListenerEvent,
	type ListenerEventAdditionalData,
	type ListenerEventData,
	type ListenerEventRawData
} from "../../src/types/index.js"

const testEventType = ListenerEvent.GuildDelete

type TestEventType = typeof testEventType

class GuildDeleteTestListener extends BaseListener {
	readonly type = testEventType
	private onHandle: (
		data: ListenerEventData[TestEventType] & ListenerEventAdditionalData
	) => Promise<void>

	constructor(
		onHandle: (
			data: ListenerEventData[TestEventType] & ListenerEventAdditionalData
		) => Promise<void>
	) {
		super()
		this.onHandle = onHandle
	}

	async handle(
		data: ListenerEventData[TestEventType] & ListenerEventAdditionalData
	): Promise<void> {
		await this.onHandle(data)
	}

	parseRawData(
		data: ListenerEventRawData[TestEventType] & ListenerEventAdditionalData
	): ListenerEventData[TestEventType] {
		return data as unknown as ListenerEventData[TestEventType]
	}
}

afterEach(() => {
	vi.useRealTimers()
})

test("EventQueue: applies global fallback limits to non-critical lanes", () => {
	const queue = new EventQueue(
		{
			listeners: [],
			options: {
				runtimeProfile: "persistent"
			}
		} as never,
		{
			maxQueueSize: 9,
			maxConcurrency: 3,
			listenerTimeout: 4567,
			listenerConcurrency: 2
		}
	)

	const laneConfig = queue.getMetrics().laneConfig
	expect(laneConfig.standard.maxQueueSize).toBe(9)
	expect(laneConfig.background.maxQueueSize).toBe(9)
	expect(laneConfig.standard.maxConcurrency).toBe(3)
	expect(laneConfig.background.maxConcurrency).toBe(3)
	expect(laneConfig.standard.listenerTimeout).toBe(4567)
	expect(laneConfig.background.listenerTimeout).toBe(4567)
	expect(laneConfig.standard.listenerConcurrency).toBe(2)
	expect(laneConfig.background.listenerConcurrency).toBe(2)
})

test("EventQueue: drops stale background events instead of processing ancient backlog", async () => {
	vi.useFakeTimers()
	let releaseHold: (() => void) | undefined
	let handled = 0

	const listener = new GuildDeleteTestListener(async (data) => {
		handled += 1
		if ((data as { marker?: string }).marker === "hold") {
			await new Promise<void>((resolve) => {
				releaseHold = resolve
			})
		}
	})

	const queue = new EventQueue(
		{
			listeners: [listener],
			options: {
				runtimeProfile: "persistent"
			}
		} as never,
		{
			lanes: {
				background: {
					maxQueueSize: 10,
					maxConcurrency: 1,
					listenerTimeout: 10_000,
					listenerConcurrency: 1,
					maxEventAgeMs: 25
				}
			}
		}
	)

	queue.enqueue(
		{
			id: "guild-hold",
			unavailable: true,
			marker: "hold",
			clientId: "c1"
		} as unknown as ListenerEventRawData[TestEventType] &
			ListenerEventAdditionalData,
		testEventType
	)
	queue.enqueue(
		{
			id: "guild-stale",
			unavailable: true,
			marker: "stale",
			clientId: "c1"
		} as unknown as ListenerEventRawData[TestEventType] &
			ListenerEventAdditionalData,
		testEventType
	)

	await Promise.resolve()
	await vi.advanceTimersByTimeAsync(50)
	releaseHold?.()
	await Promise.resolve()
	await Promise.resolve()
	await vi.advanceTimersByTimeAsync(0)

	expect(handled).toBe(1)
	expect(queue.getMetrics().droppedStale).toBe(1)
})

test("EventQueue: listener timeout aborts signal and quarantines zombie work", async () => {
	vi.useFakeTimers()
	let releaseWork: (() => void) | undefined
	let observedSignal: AbortSignal | undefined

	const listener = new GuildDeleteTestListener(async (data) => {
		observedSignal = data.abortSignal
		await new Promise<void>((resolve) => {
			releaseWork = resolve
		})
	})

	const queue = new EventQueue(
		{
			listeners: [listener],
			options: {
				runtimeProfile: "persistent"
			}
		} as never,
		{
			lanes: {
				background: {
					maxQueueSize: 10,
					maxConcurrency: 1,
					listenerTimeout: 20,
					listenerConcurrency: 1,
					maxEventAgeMs: 5000
				}
			}
		}
	)

	queue.enqueue(
		{
			id: "guild-timeout",
			unavailable: true,
			clientId: "c1"
		} as unknown as ListenerEventRawData[TestEventType] &
			ListenerEventAdditionalData,
		testEventType
	)

	await Promise.resolve()
	await vi.advanceTimersByTimeAsync(30)

	const timedOutMetrics = queue.getMetrics()
	expect(timedOutMetrics.timeouts).toBe(1)
	expect(timedOutMetrics.zombieExecutions).toBe(1)
	expect(observedSignal?.aborted).toBe(true)

	releaseWork?.()
	await Promise.resolve()
	await Promise.resolve()
	await vi.advanceTimersByTimeAsync(0)

	expect(queue.getMetrics().zombieExecutions).toBe(0)
})
