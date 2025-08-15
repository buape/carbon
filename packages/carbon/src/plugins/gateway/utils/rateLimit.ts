export interface RateLimitConfig {
	/** Maximum number of events allowed in the time window */
	maxEvents: number
	/** Time window in milliseconds */
	windowMs: number
}

export class GatewayRateLimit {
	private events: number[] = []
	private readonly config: RateLimitConfig

	constructor(config: RateLimitConfig = { maxEvents: 120, windowMs: 60000 }) {
		this.config = config
	}

	/**
	 * Check if sending an event would exceed the rate limit
	 * @returns true if the event can be sent, false if rate limited
	 */
	public canSend(): boolean {
		this.cleanupOldEvents()
		return this.events.length < this.config.maxEvents
	}

	/**
	 * Record that an event was sent
	 */
	public recordEvent(): void {
		this.events.push(Date.now())
	}

	/**
	 * Get the current number of events in the time window
	 */
	public getCurrentEventCount(): number {
		this.cleanupOldEvents()
		return this.events.length
	}

	/**
	 * Get remaining events before hitting rate limit
	 */
	public getRemainingEvents(): number {
		return Math.max(0, this.config.maxEvents - this.getCurrentEventCount())
	}

	/**
	 * Get time until rate limit resets (in milliseconds)
	 */
	public getResetTime(): number {
		this.cleanupOldEvents()
		if (this.events.length === 0) return 0

		const oldestEvent = this.events[0]
		if (!oldestEvent) return 0
		return Math.max(0, this.config.windowMs - (Date.now() - oldestEvent))
	}

	/**
	 * Remove events outside the current time window
	 */
	private cleanupOldEvents(): void {
		const now = Date.now()
		const cutoff = now - this.config.windowMs
		this.events = this.events.filter((timestamp) => timestamp > cutoff)
	}

	/**
	 * Reset the rate limiter
	 */
	public reset(): void {
		this.events = []
	}
}
