import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { GatewayPlugin } from "../../src/plugins/gateway/GatewayPlugin.js"
import { GatewayOpcodes } from "../../src/plugins/gateway/types.js"
import {
	type HeartbeatManager,
	startHeartbeat,
	stopHeartbeat
} from "../../src/plugins/gateway/utils/heartbeat.js"

describe("gateway heartbeat resets", () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.spyOn(Math, "random").mockReturnValue(0)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	test("startHeartbeat resets stale ack state before first heartbeat", () => {
		const reconnectCallback = vi.fn()
		const send = vi.fn()
		const manager: HeartbeatManager = {
			sequence: 123,
			lastHeartbeatAck: false,
			send
		}

		startHeartbeat(manager, {
			interval: 1000,
			reconnectCallback
		})
		vi.advanceTimersByTime(0)

		expect(reconnectCallback).not.toHaveBeenCalled()
		expect(send).toHaveBeenCalledWith({
			op: GatewayOpcodes.Heartbeat,
			d: 123
		})

		stopHeartbeat(manager)
	})

	test("disconnect resets stale ack state", () => {
		const gateway = new GatewayPlugin({})
		gateway.lastHeartbeatAck = false

		gateway.disconnect()

		expect(gateway.lastHeartbeatAck).toBe(true)
	})

	test("repeated heartbeat restarts do not inherit stale ack state", () => {
		const reconnectCallback = vi.fn()
		const send = vi.fn()
		const manager: HeartbeatManager = {
			sequence: 7,
			lastHeartbeatAck: false,
			send
		}

		startHeartbeat(manager, {
			interval: 1000,
			reconnectCallback
		})
		vi.advanceTimersByTime(0)
		stopHeartbeat(manager)

		manager.lastHeartbeatAck = false
		startHeartbeat(manager, {
			interval: 1000,
			reconnectCallback
		})
		vi.advanceTimersByTime(0)

		expect(reconnectCallback).not.toHaveBeenCalled()
		expect(send).toHaveBeenCalledTimes(2)

		stopHeartbeat(manager)
	})
})
