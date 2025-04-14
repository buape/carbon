import { GatewayOpcodes } from "../types.js"

export interface HeartbeatManager {
	sequence: number | null
	lastHeartbeatAck: boolean
	heartbeatInterval?: NodeJS.Timeout
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

	const jitter = Math.random() * 1000
	const interval = options.interval + jitter

	manager.heartbeatInterval = setInterval(() => {
		if (!manager.lastHeartbeatAck) {
			options.reconnectCallback()
			return
		}

		manager.lastHeartbeatAck = false
		manager.send({
			op: GatewayOpcodes.Heartbeat,
			d: manager.sequence
		})
	}, interval)

	manager.send({
		op: GatewayOpcodes.Heartbeat,
		d: manager.sequence
	})
}

export function stopHeartbeat(manager: HeartbeatManager): void {
	if (manager.heartbeatInterval) {
		clearInterval(manager.heartbeatInterval)
		manager.heartbeatInterval = undefined
	}
}
