import { EventEmitter } from "node:events"

export interface ConnectionMetrics {
	latency: number
	uptime: number
	reconnects: number
	zombieConnections: number
	messagesReceived: number
	messagesSent: number
	errors: number
}

export interface MonitorConfig {
	/** Monitoring interval in milliseconds (default: 60000) */
	interval?: number
	/** Warning threshold for latency in milliseconds (default: 1000) */
	latencyThreshold?: number
}

export class ConnectionMonitor extends EventEmitter {
	private metrics: ConnectionMetrics = {
		latency: 0,
		uptime: 0,
		reconnects: 0,
		zombieConnections: 0,
		messagesReceived: 0,
		messagesSent: 0,
		errors: 0
	}

	private startTime = Date.now()
	private lastHeartbeat = 0
	private metricsInterval: NodeJS.Timeout
	private readonly config: Required<MonitorConfig>

	constructor(config: MonitorConfig = {}) {
		super()
		this.config = {
			interval: config.interval ?? 60000,
			latencyThreshold: config.latencyThreshold ?? 1000
		}
		this.metricsInterval = setInterval(() => {
			this.metrics.uptime = Date.now() - this.startTime
			this.emit("metrics", this.getMetrics())

			if (this.metrics.latency > this.config.latencyThreshold) {
				this.emit("warning", `High latency detected: ${this.metrics.latency}ms`)
			}

			const errorRate = (
				this.metrics.errors /
				(this.metrics.uptime / 60000)
			).toFixed(1)
			if (Number(errorRate) > 5) {
				this.emit(
					"warning",
					`High error rate detected: ${errorRate} errors/minute`
				)
			}
		}, this.config.interval)
	}

	public recordError(): void {
		this.metrics.errors++
	}

	public recordZombieConnection(): void {
		this.metrics.zombieConnections++
	}

	public recordHeartbeat(): void {
		this.lastHeartbeat = Date.now()
	}

	public recordHeartbeatAck(): void {
		if (this.lastHeartbeat > 0) {
			this.metrics.latency = Date.now() - this.lastHeartbeat
		}
	}

	public recordReconnect(): void {
		this.metrics.reconnects++
	}

	public recordMessageReceived(): void {
		this.metrics.messagesReceived++
	}

	public recordMessageSent(): void {
		this.metrics.messagesSent++
	}

	public getMetrics(): ConnectionMetrics {
		return { ...this.metrics }
	}

	public reset(): void {
		this.metrics = {
			latency: 0,
			uptime: 0,
			reconnects: 0,
			zombieConnections: 0,
			messagesReceived: 0,
			messagesSent: 0,
			errors: 0
		}
		this.startTime = Date.now()
		this.lastHeartbeat = 0
	}

	public destroy(): void {
		clearInterval(this.metricsInterval)
		this.removeAllListeners()
	}
}
