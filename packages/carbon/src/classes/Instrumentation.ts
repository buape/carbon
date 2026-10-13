export type InstrumentationAttributes = Record<
	string,
	string | number | boolean
>

export type InstrumentedOperation = {
	id: number
	name: string
	attributes: InstrumentationAttributes
}

export type InstrumentationEvent =
	| {
			type: "operation.start"
			operation: InstrumentedOperation
	  }
	| {
			type: "operation.end"
			operation: InstrumentedOperation
			durationMs: number
			status: "success" | "error"
			statusCode?: number
			error?: unknown
	  }
	| {
			type: "event"
			name: string
			attributes: InstrumentationAttributes
	  }

export type InstrumentationMiddleware = <T>(
	operation: InstrumentedOperation,
	next: () => Promise<T>
) => Promise<T>

/**
 * Runtime-neutral instrumentation hooks for observing Carbon operations.
 * Plugins can wrap operations (for example, to create active tracing spans)
 * and subscribe to lifecycle and framework events.
 */
export class Instrumentation {
	private middlewares = new Set<InstrumentationMiddleware>()
	private listeners = new Set<(event: InstrumentationEvent) => void>()
	private nextOperationId = 0

	/**
	 * Add middleware that wraps every instrumented Carbon operation.
	 * Middleware should call `next()` exactly once and return its result.
	 */
	use(middleware: InstrumentationMiddleware): () => void {
		this.middlewares.add(middleware)
		return () => this.middlewares.delete(middleware)
	}

	/** Subscribe to operation lifecycle and framework events. */
	onEvent(listener: (event: InstrumentationEvent) => void): () => void {
		this.listeners.add(listener)
		return () => this.listeners.delete(listener)
	}

	/** Run work inside the registered instrumentation middleware chain. */
	async run<T>(
		name: string,
		attributes: InstrumentationAttributes,
		callback: () => T | Promise<T>
	): Promise<T> {
		const operation = {
			id: this.nextOperationId++,
			name,
			attributes
		}
		const startedAt = Date.now()
		this.dispatchEvent({ type: "operation.start", operation })

		let callbackPromise: Promise<T> | undefined
		let next = () => (callbackPromise ??= Promise.resolve().then(callback))
		for (const middleware of [...this.middlewares].reverse()) {
			const currentNext = next
			let middlewarePromise: Promise<T> | undefined
			next = () =>
				(middlewarePromise ??= Promise.resolve(
					middleware(operation, currentNext)
				))
		}

		try {
			const result = await next()
			this.dispatchEvent({
				type: "operation.end",
				operation,
				durationMs: Date.now() - startedAt,
				status: "success",
				...(typeof Response !== "undefined" && result instanceof Response
					? { statusCode: result.status }
					: {})
			})
			return result
		} catch (error) {
			this.dispatchEvent({
				type: "operation.end",
				operation,
				durationMs: Date.now() - startedAt,
				status: "error",
				error
			})
			throw error
		}
	}

	/** Emit a framework event that is not naturally represented by an operation. */
	emit(name: string, attributes: InstrumentationAttributes = {}): void {
		this.dispatchEvent({ type: "event", name, attributes })
	}

	private dispatchEvent(event: InstrumentationEvent): void {
		for (const listener of [...this.listeners]) {
			try {
				listener(event)
			} catch {
				// Observers must not break Carbon's operation flow.
			}
		}
	}
}
