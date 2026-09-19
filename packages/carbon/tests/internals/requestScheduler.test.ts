import { expect, test, vi } from "vitest"
import {
	type RequestLane,
	RequestScheduler
} from "../../src/internals/RequestScheduler.js"

type TestRequest = {
	id: string
	routeKey: string
	priority: RequestLane
	enqueuedAt: number
	reject: ReturnType<typeof vi.fn>
}

const createScheduler = () =>
	new RequestScheduler<TestRequest>({
		lanes: {
			critical: { weight: 1, maxQueueSize: 100, staleAfterMs: 100 },
			standard: { weight: 1, maxQueueSize: 100, staleAfterMs: 100 },
			background: { weight: 1, maxQueueSize: 100, staleAfterMs: 100 }
		}
	})

const request = (
	id: string,
	routeKey: string,
	priority: RequestLane,
	enqueuedAt = Date.now()
): TestRequest => ({
	id,
	routeKey,
	priority,
	enqueuedAt,
	reject: vi.fn()
})

const readyOptions = {
	isRouteReady: () => 0,
	isBucketActive: () => false
}

test("RequestScheduler keeps routes active per lane", () => {
	const scheduler = createScheduler()
	const critical = request("critical", "/shared", "critical")
	const background = request("background", "/shared", "background")

	scheduler.enqueue(critical)
	scheduler.enqueue(background)

	expect(scheduler.takeNext(readyOptions).request).toBe(critical)
	expect(scheduler.takeNext(readyOptions).request).toBe(background)
	expect(scheduler.size).toBe(0)
})

test("RequestScheduler removes stale routes from the active lane index", () => {
	vi.useFakeTimers()
	vi.setSystemTime(1_000)
	const scheduler = createScheduler()
	const stale = request("stale", "/stale", "standard", 800)
	const fresh = request("fresh", "/fresh", "standard", 1_000)

	scheduler.enqueue(stale)
	scheduler.enqueue(fresh)

	expect(scheduler.takeNext(readyOptions).request).toBe(fresh)
	expect(stale.reject).toHaveBeenCalledOnce()
	expect(scheduler.takeNext(readyOptions).request).toBeNull()
	expect(scheduler.getMetrics().laneCounts.standard).toBe(0)
	expect(scheduler.getMetrics().laneDropped.standard).toBe(1)
	vi.useRealTimers()
})

test("RequestScheduler clear empties primary and active route indexes", () => {
	const scheduler = createScheduler()
	const first = request("first", "/first", "critical")
	const second = request("second", "/second", "standard")

	scheduler.enqueue(first)
	scheduler.enqueue(second)
	scheduler.clear()

	expect(first.reject).toHaveBeenCalledOnce()
	expect(second.reject).toHaveBeenCalledOnce()
	expect(scheduler.size).toBe(0)
	expect(scheduler.takeNext(readyOptions).request).toBeNull()

	const afterClear = request("after-clear", "/first", "critical")
	scheduler.enqueue(afterClear)
	expect(scheduler.takeNext(readyOptions).request).toBe(afterClear)
})
