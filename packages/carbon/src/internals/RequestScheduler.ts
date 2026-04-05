import type { RuntimeProfile } from "../classes/RequestClient.js"

export type RequestLane = "critical" | "standard" | "background"

export type RequestSchedulerLaneOptions = {
	weight?: number
	maxQueueSize?: number
	staleAfterMs?: number
}

export type RequestSchedulerOptions = {
	maxConcurrency?: number
	maxRateLimitRetries?: number
	lanes?: Partial<Record<RequestLane, RequestSchedulerLaneOptions>>
}

export const requestSchedulerProfileDefaults = {
	serverless: {
		maxConcurrency: 3,
		maxRateLimitRetries: 2,
		lanes: {
			critical: { weight: 7, maxQueueSize: 2000 },
			standard: { weight: 2, maxQueueSize: 1500, staleAfterMs: 20_000 },
			background: { weight: 1, maxQueueSize: 600, staleAfterMs: 7_500 }
		}
	},
	persistent: {
		maxConcurrency: 8,
		maxRateLimitRetries: 3,
		lanes: {
			critical: { weight: 6, maxQueueSize: 6000 },
			standard: { weight: 3, maxQueueSize: 10_000, staleAfterMs: 60_000 },
			background: { weight: 1, maxQueueSize: 5_000, staleAfterMs: 20_000 }
		}
	}
} satisfies Record<
	RuntimeProfile,
	{
		maxConcurrency: number
		maxRateLimitRetries: number
		lanes: Record<
			RequestLane,
			{
				weight: number
				maxQueueSize: number
				staleAfterMs?: number
			}
		>
	}
>

function assertPositiveInteger(name: string, value: number | undefined) {
	if (value === undefined) return
	if (!Number.isInteger(value) || value < 1) {
		throw new Error(`${name} must be an integer greater than or equal to 1`)
	}
}

function assertNonNegativeInteger(name: string, value: number | undefined) {
	if (value === undefined) return
	if (!Number.isInteger(value) || value < 0) {
		throw new Error(`${name} must be a non-negative integer`)
	}
}

export function normalizeRequestSchedulerOptions({
	runtimeProfile,
	maxQueueSize,
	scheduler
}: {
	runtimeProfile: RuntimeProfile
	maxQueueSize?: number
	scheduler?: RequestSchedulerOptions
}) {
	assertPositiveInteger("scheduler.maxConcurrency", scheduler?.maxConcurrency)
	assertNonNegativeInteger(
		"scheduler.maxRateLimitRetries",
		scheduler?.maxRateLimitRetries
	)

	const defaults = requestSchedulerProfileDefaults[runtimeProfile]
	const fallbackQueueSize = Math.max(1, maxQueueSize ?? 1000)
	const laneInput = scheduler?.lanes

	return {
		maxConcurrency: scheduler?.maxConcurrency ?? defaults.maxConcurrency,
		maxRateLimitRetries:
			scheduler?.maxRateLimitRetries ?? defaults.maxRateLimitRetries,
		lanes: {
			critical: {
				weight: Math.max(
					1,
					laneInput?.critical?.weight ?? defaults.lanes.critical.weight
				),
				maxQueueSize: Math.max(
					1,
					laneInput?.critical?.maxQueueSize ??
						maxQueueSize ??
						defaults.lanes.critical.maxQueueSize ??
						fallbackQueueSize
				),
				staleAfterMs: laneInput?.critical?.staleAfterMs
			},
			standard: {
				weight: Math.max(
					1,
					laneInput?.standard?.weight ?? defaults.lanes.standard.weight
				),
				maxQueueSize: Math.max(
					1,
					laneInput?.standard?.maxQueueSize ??
						maxQueueSize ??
						defaults.lanes.standard.maxQueueSize ??
						fallbackQueueSize
				),
				staleAfterMs:
					laneInput?.standard?.staleAfterMs ??
					defaults.lanes.standard.staleAfterMs
			},
			background: {
				weight: Math.max(
					1,
					laneInput?.background?.weight ?? defaults.lanes.background.weight
				),
				maxQueueSize: Math.max(
					1,
					laneInput?.background?.maxQueueSize ??
						maxQueueSize ??
						defaults.lanes.background.maxQueueSize ??
						fallbackQueueSize
				),
				staleAfterMs:
					laneInput?.background?.staleAfterMs ??
					defaults.lanes.background.staleAfterMs
			}
		} satisfies Record<
			RequestLane,
			{
				weight: number
				maxQueueSize: number
				staleAfterMs?: number
			}
		>
	}
}

export class RequestScheduler<
	T extends {
		routeKey: string
		priority: RequestLane
		enqueuedAt: number
		reject(reason?: unknown): void
	}
> {
	private pendingByRoute = new Map<
		string,
		{
			critical: T[]
			standard: T[]
			background: T[]
		}
	>()
	private laneCounts = {
		critical: 0,
		standard: 0,
		background: 0
	}
	private laneDropped = {
		critical: 0,
		standard: 0,
		background: 0
	}
	private laneSchedule: RequestLane[] = []
	private laneCursor = 0
	private routeCursorByLane = {
		critical: 0,
		standard: 0,
		background: 0
	}
	private laneConfig: Record<
		RequestLane,
		{
			weight: number
			maxQueueSize: number
			staleAfterMs?: number
		}
	>

	constructor(config: {
		lanes: Record<
			RequestLane,
			{
				weight: number
				maxQueueSize: number
				staleAfterMs?: number
			}
		>
	}) {
		this.laneConfig = config.lanes
		for (const lane of ["critical", "standard", "background"] as const) {
			for (let i = 0; i < this.laneConfig[lane].weight; i += 1) {
				this.laneSchedule.push(lane)
			}
		}
		if (this.laneSchedule.length === 0) {
			this.laneSchedule = ["critical", "standard", "background"]
		}
	}

	enqueue(request: T) {
		const lane = request.priority
		const laneConfig = this.laneConfig[lane]
		if (this.laneCounts[lane] >= laneConfig.maxQueueSize) {
			this.laneDropped[lane] += 1
			return new Error(
				`Request queue for ${lane} is full (${this.laneCounts[lane]} / ${laneConfig.maxQueueSize}).`
			)
		}

		const routeQueues =
			this.pendingByRoute.get(request.routeKey) ??
			({
				critical: [],
				standard: [],
				background: []
			} satisfies {
				critical: T[]
				standard: T[]
				background: T[]
			})

		routeQueues[lane].push(request)
		this.pendingByRoute.set(request.routeKey, routeQueues)
		this.laneCounts[lane] += 1
		return null
	}

	takeNext(options: {
		isRouteReady(routeKey: string): number
		isBucketActive(routeKey: string): boolean
	}): { request: T | null; waitMs: number | null } {
		const now = Date.now()
		let earliestWaitMs: number | null = null

		for (
			let laneOffset = 0;
			laneOffset < this.laneSchedule.length;
			laneOffset += 1
		) {
			const lane =
				this.laneSchedule[
					(this.laneCursor + laneOffset) % this.laneSchedule.length
				]
			if (!lane || this.laneCounts[lane] <= 0) continue

			const routeKeys: string[] = []
			for (const [routeKey, queues] of this.pendingByRoute.entries()) {
				if (queues[lane].length > 0) {
					routeKeys.push(routeKey)
				}
			}
			if (routeKeys.length === 0) continue

			const startIndex = this.routeCursorByLane[lane] % routeKeys.length
			for (
				let routeOffset = 0;
				routeOffset < routeKeys.length;
				routeOffset += 1
			) {
				const routeKey =
					routeKeys[(startIndex + routeOffset) % routeKeys.length]
				if (!routeKey) continue
				const routeQueues = this.pendingByRoute.get(routeKey)
				if (!routeQueues) continue
				const queue = routeQueues[lane]

				while (queue.length > 0 && this.isStale(queue[0], now)) {
					const stale = queue.shift()
					if (!stale) break
					this.laneCounts[lane] -= 1
					this.laneDropped[lane] += 1
					stale.reject(
						new Error(
							`Dropped stale ${lane} request after ${now - stale.enqueuedAt}ms`
						)
					)
				}

				if (queue.length === 0) {
					this.compactRoute(routeKey, routeQueues)
					continue
				}

				const waitMs = options.isRouteReady(routeKey)
				if (waitMs > 0) {
					earliestWaitMs =
						earliestWaitMs === null ? waitMs : Math.min(earliestWaitMs, waitMs)
					continue
				}

				if (options.isBucketActive(routeKey)) {
					earliestWaitMs =
						earliestWaitMs === null ? 5 : Math.min(earliestWaitMs, 5)
					continue
				}

				const dequeued = queue.shift()
				if (!dequeued) continue

				this.laneCounts[lane] -= 1
				this.routeCursorByLane[lane] =
					(startIndex + routeOffset + 1) % routeKeys.length
				this.laneCursor =
					(this.laneCursor + laneOffset + 1) % this.laneSchedule.length
				this.compactRoute(routeKey, routeQueues)
				return { request: dequeued, waitMs: null }
			}
		}

		return { request: null, waitMs: earliestWaitMs }
	}

	clear(reason = new Error("Request queue cleared")) {
		for (const routeQueues of this.pendingByRoute.values()) {
			for (const lane of ["critical", "standard", "background"] as const) {
				for (const request of routeQueues[lane]) {
					request.reject(reason)
				}
			}
		}
		this.pendingByRoute.clear()
		this.laneCounts.critical = 0
		this.laneCounts.standard = 0
		this.laneCounts.background = 0
	}

	get size() {
		return (
			this.laneCounts.critical +
			this.laneCounts.standard +
			this.laneCounts.background
		)
	}

	getMetrics() {
		return {
			laneCounts: {
				...this.laneCounts
			},
			laneDropped: {
				...this.laneDropped
			},
			oldestByLane: {
				critical: this.getOldestAgeForLane("critical"),
				standard: this.getOldestAgeForLane("standard"),
				background: this.getOldestAgeForLane("background")
			}
		}
	}

	private compactRoute(
		routeKey: string,
		routeQueues: {
			critical: T[]
			standard: T[]
			background: T[]
		}
	) {
		if (
			routeQueues.critical.length +
				routeQueues.standard.length +
				routeQueues.background.length ===
			0
		) {
			this.pendingByRoute.delete(routeKey)
		}
	}

	private isStale(request: T | undefined, now = Date.now()) {
		if (!request) return false
		const staleAfterMs = this.laneConfig[request.priority].staleAfterMs
		if (!staleAfterMs || staleAfterMs <= 0) return false
		return now - request.enqueuedAt > staleAfterMs
	}

	private getOldestAgeForLane(lane: RequestLane) {
		const now = Date.now()
		let oldest = 0
		for (const routeQueues of this.pendingByRoute.values()) {
			const head = routeQueues[lane][0]
			if (!head) continue
			oldest = Math.max(oldest, now - head.enqueuedAt)
		}
		return oldest
	}
}
