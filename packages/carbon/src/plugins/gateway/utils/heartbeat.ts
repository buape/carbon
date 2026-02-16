import { GatewayOpcodes } from "../types.js"

export interface HeartbeatManager {
	sequence: number | null
	lastHeartbeatAck: boolean
	heartbeatInterval?: NodeJS.Timeout
	firstHeartbeatTimeout?: NodeJS.Timeout
	send(payload: {
		op: (typeof GatewayOpcodes)[keyof typeof GatewayOpcodes]
		d: number | null
	}): void
}

export interface HeartbeatOptions {
	interval: number
	reconnectCallback: () => void
}

export function startHeartbeat(
	manager: HeartbeatManager,
	options: HeartbeatOptions
): void {
	stopHeartbeat(manager)
	manager.lastHeartbeatAck = true

	const jitter = Math.random()
	const initialDelay = Math.floor(options.interval * jitter)
	const interval = options.interval

	const sendHeartbeat = () => {
		if (!manager.lastHeartbeatAck) {
			options.reconnectCallback()
			return
		}

		manager.lastHeartbeatAck = false
		manager.send({
			op: GatewayOpcodes.Heartbeat,
			d: manager.sequence
		})
	}

	manager.firstHeartbeatTimeout = setTimeout(() => {
		sendHeartbeat()
		manager.heartbeatInterval = setInterval(sendHeartbeat, interval)
	}, initialDelay)
}

export function stopHeartbeat(manager: HeartbeatManager): void {
	if (manager.firstHeartbeatTimeout) {
		clearTimeout(manager.firstHeartbeatTimeout)
		manager.firstHeartbeatTimeout = undefined
	}
	if (manager.heartbeatInterval) {
		clearInterval(manager.heartbeatInterval)
		manager.heartbeatInterval = undefined
	}
}
