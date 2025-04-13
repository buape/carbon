import { EventEmitter } from "node:events"

export interface ConnectionMetrics {
	latency: number // Time between heartbeat and ack in ms
	uptime: number // Connection uptime in ms
	reconnects: number // Number of reconnections
	zombieConnections: number // Number of zombie connections detected
	messagesReceived: number // Number of messages received
	messagesSent: number // Number of messages sent
	errors: number // Number of errors encountered
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

	constructor() {
		super()
		this.metricsInterval = setInterval(() => {
			this.metrics.uptime = Date.now() - this.startTime
			this.emit("metrics", this.getMetrics())

			// Check for high latency
			if (this.metrics.latency > 1000) {
				this.emit("warning", `High latency detected: ${this.metrics.latency}ms`)
			}

			// Check for high error rate
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
		}, 60000)
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
