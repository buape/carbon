export function createBoundedExecutor<T>({
	concurrency,
	run,
	getQueuedAt
}: {
	concurrency: number
	run: (task: T) => Promise<void>
	getQueuedAt?: (task: T) => number | undefined
}) {
	const queue: T[] = []
	let inFlight = 0
	const idleWaiters: Array<() => void> = []

	const notifyIfIdle = () => {
		if (inFlight > 0 || queue.length > 0) return
		for (const resolve of idleWaiters.splice(0)) {
			resolve()
		}
	}

	const pump = () => {
		while (inFlight < concurrency && queue.length > 0) {
			const task = queue.shift()
			if (!task) continue
			inFlight += 1
			void run(task)
				.catch(() => {
					// caller handles errors inside run
				})
				.finally(() => {
					inFlight -= 1
					pump()
					notifyIfIdle()
				})
		}
	}

	return {
		schedule(task: T) {
			queue.push(task)
			pump()
		},
		async onIdle() {
			if (inFlight === 0 && queue.length === 0) return
			await new Promise<void>((resolve) => {
				idleWaiters.push(resolve)
			})
		},
		getInFlight() {
			return inFlight
		},
		getQueueDepth() {
			return queue.length
		},
		getOldestQueuedAgeMs() {
			if (queue.length === 0 || !getQueuedAt) return 0
			const first = queue[0]
			if (!first) return 0
			const queuedAt = getQueuedAt(first)
			if (typeof queuedAt !== "number") return 0
			return Math.max(0, Date.now() - queuedAt)
		}
	}
}
