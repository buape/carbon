import { EventEmitter } from "node:events"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import type { Client } from "../../src/classes/Client.js"
import {
	GatewayOpcodes,
	type GatewayPayload
} from "../../src/plugins/gateway/types.js"
import { RedisStreamGatewayForwarderPlugin } from "../../src/plugins/redis-gateway-forwarder/RedisStreamGatewayForwarderPlugin.js"
import { RedisStreamGatewayReceiverPlugin } from "../../src/plugins/redis-gateway-forwarder/RedisStreamGatewayReceiverPlugin.js"

class MockWebSocket extends EventEmitter {
	readyState = 1
	send = vi.fn()
	close = vi.fn()
}

function createSenderPlugin(
	redis: { xadd: ReturnType<typeof vi.fn> },
	options: Partial<
		ConstructorParameters<typeof RedisStreamGatewayForwarderPlugin>[0]
	> = {}
) {
	const plugin = new RedisStreamGatewayForwarderPlugin({
		intents: 1,
		redis: redis as never,
		...options
	})
	// Simulate `registerClient` having already derived the stream key.
	;(plugin as unknown as { streamKey: string }).streamKey = "carbon:events:123"
	const ws = new MockWebSocket()
	;(plugin as unknown as { ws: MockWebSocket | null }).ws = ws
	;(plugin as unknown as { setupWebSocket: () => void }).setupWebSocket()
	return { ws, plugin }
}

function emitPayload(ws: MockWebSocket, payload: GatewayPayload) {
	ws.emit("message", Buffer.from(JSON.stringify(payload)))
}

function getForwardedEvents(xadd: ReturnType<typeof vi.fn>) {
	return xadd.mock.calls.map((call: unknown[]) => {
		// call shape is [streamKey, ...maybeMaxlenTriple, id, "type", <type>, "data", <json>, "ts", <ts>]
		const typeIndex = call.indexOf("type")
		const fields = call.slice(typeIndex).map(String)
		let type = "unknown"
		let data: unknown = null
		let enqueuedAt: number | undefined
		for (let i = 0; i < fields.length; i += 2) {
			const field = fields[i]
			const value = fields[i + 1]
			if (field === "type" && typeof value === "string") {
				type = value
			}
			if (field === "data" && typeof value === "string") {
				try {
					data = JSON.parse(value)
				} catch {
					data = null
				}
			}
			if (field === "ts" && typeof value === "string") {
				const parsed = Number(value)
				if (Number.isFinite(parsed)) enqueuedAt = parsed
			}
		}
		return { type, data, enqueuedAt }
	})
}

async function flushForwarding() {
	await new Promise((resolve) => setTimeout(resolve, 0))
}

describe("RedisStreamGatewayForwarderPlugin guild availability forwarding", () => {
	let xadd: ReturnType<typeof vi.fn>

	beforeEach(() => {
		xadd = vi.fn().mockResolvedValue("1-1")
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	test("forwards startup guild create as GUILD_AVAILABLE", async () => {
		const { ws } = createSenderPlugin({ xadd })
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "READY",
			d: {
				session_id: "session",
				resume_gateway_url: "wss://gateway.discord.gg",
				guilds: [{ id: "1" }]
			}
		})
		const guildCreate = { id: "1", unavailable: false }
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_CREATE",
			d: guildCreate
		})

		await flushForwarding()

		const events = getForwardedEvents(xadd)
		expect(events.map((event) => event.type)).toEqual([
			"READY",
			"GUILD_AVAILABLE"
		])
		expect(events[1]?.data).toEqual(guildCreate)
	})

	test("forwards true new guild join as GUILD_CREATE", async () => {
		const { ws } = createSenderPlugin({ xadd })
		const guildCreate = { id: "2", unavailable: false }
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_CREATE",
			d: guildCreate
		})

		await flushForwarding()

		const events = getForwardedEvents(xadd)
		expect(events.map((event) => event.type)).toEqual(["GUILD_CREATE"])
		expect(events[0]?.data).toEqual(guildCreate)
	})

	test("forwards unavailable guild delete as GUILD_UNAVAILABLE", async () => {
		const { ws } = createSenderPlugin({ xadd })
		const guildDelete = { id: "3", unavailable: true }
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_DELETE",
			d: guildDelete
		})

		await flushForwarding()

		const events = getForwardedEvents(xadd)
		expect(events.map((event) => event.type)).toEqual(["GUILD_UNAVAILABLE"])
		expect(events[0]?.data).toEqual(guildDelete)
	})

	test("retries transient xadd failures with bounded backoff", async () => {
		xadd
			.mockRejectedValueOnce(new Error("connection reset"))
			.mockResolvedValueOnce("1-1")

		const { ws, plugin } = createSenderPlugin(
			{ xadd },
			{
				delivery: {
					maxRetries: 2,
					baseBackoffMs: 1,
					maxBackoffMs: 1,
					jitterRatio: 0,
					timeoutMs: 50,
					maxInFlight: 1
				}
			}
		)

		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_CREATE",
			d: { id: "retry-guild", unavailable: false }
		})

		await new Promise((resolve) => setTimeout(resolve, 20))

		expect(xadd).toHaveBeenCalledTimes(2)
		const metrics = plugin.getDeliveryMetrics()
		expect(metrics.retried).toBe(1)
		expect(metrics.sent).toBe(1)
		expect(metrics.failed).toBe(0)
	})

	test("respects maxInFlight by queueing excess deliveries", async () => {
		const resolvers: Array<() => void> = []
		xadd.mockImplementation(
			() =>
				new Promise((resolve) => {
					resolvers.push(() => resolve("1-1"))
				})
		)

		const { ws, plugin } = createSenderPlugin(
			{ xadd },
			{
				delivery: {
					maxInFlight: 1,
					maxQueueSize: 10,
					maxRetries: 0,
					timeoutMs: 5000
				}
			}
		)

		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_CREATE",
			d: { id: "A", unavailable: false }
		})
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_CREATE",
			d: { id: "B", unavailable: false }
		})

		await Promise.resolve()
		expect(xadd).toHaveBeenCalledTimes(1)
		expect(plugin.getDeliveryMetrics().queueDepth).toBe(1)

		resolvers.shift()?.()
		await Promise.resolve()
		await Promise.resolve()
		await new Promise((resolve) => setTimeout(resolve, 0))

		expect(xadd).toHaveBeenCalledTimes(2)
		resolvers.shift()?.()
		await Promise.resolve()
		await new Promise((resolve) => setTimeout(resolve, 0))

		expect(plugin.getDeliveryMetrics().sent).toBe(2)
	})

	test("throws for invalid delivery maxInFlight", () => {
		expect(() =>
			createSenderPlugin(
				{ xadd },
				{
					delivery: {
						maxInFlight: 0
					}
				}
			)
		).toThrow("delivery.maxInFlight")
	})
})

/**
 * A minimal in-memory double for the subset of Redis Streams commands
 * `RedisStreamGatewayReceiverPlugin` uses. Tracks per-(stream, group) delivery
 * via an index cursor rather than real entry IDs, which keeps ordering
 * comparisons trivial for test purposes.
 */
class FakeRedisStream {
	private streams = new Map<string, string[][]>()
	private groups = new Map<string, Map<string, { deliveredIndex: number }>>()
	private pending = new Map<
		string,
		Map<string, Map<string, { consumer: string; fields: string[] }>>
	>()
	private idSeq = 0

	private groupsFor(key: string) {
		let groupsForStream = this.groups.get(key)
		if (!groupsForStream) {
			groupsForStream = new Map()
			this.groups.set(key, groupsForStream)
		}
		return groupsForStream
	}

	private pendingFor(key: string, group: string) {
		let pendingForStream = this.pending.get(key)
		if (!pendingForStream) {
			pendingForStream = new Map()
			this.pending.set(key, pendingForStream)
		}
		let pendingForGroup = pendingForStream.get(group)
		if (!pendingForGroup) {
			pendingForGroup = new Map()
			pendingForStream.set(group, pendingForGroup)
		}
		return pendingForGroup
	}

	async xadd(...args: unknown[]) {
		const key = String(args[0])
		const fields = args.slice(1).map(String)
		this.idSeq += 1
		const id = `${this.idSeq}-0`
		const entries = this.streams.get(key) ?? []
		entries.push([id, ...fields])
		this.streams.set(key, entries)
		return id
	}

	async xgroup(...args: unknown[]) {
		const [sub, key, group] = args.map(String)
		if (sub === "CREATE") {
			const groupsForStream = this.groupsFor(key)
			if (groupsForStream.has(group)) {
				throw new Error("BUSYGROUP Consumer Group name already exists")
			}
			if (!this.streams.has(key)) this.streams.set(key, [])
			groupsForStream.set(group, {
				deliveredIndex: (this.streams.get(key) ?? []).length
			})
			return "OK"
		}
		return "OK"
	}

	async xreadgroup(...args: unknown[]) {
		const a = args.map(String)
		let i = 0
		i++ // "GROUP"
		const group = a[i++] ?? ""
		const consumer = a[i++] ?? ""
		let count = Number.POSITIVE_INFINITY
		let blocked = false
		while (i < a.length) {
			if (a[i] === "COUNT") {
				count = Number(a[i + 1])
				i += 2
				continue
			}
			if (a[i] === "BLOCK") {
				blocked = true
				i += 2
				continue
			}
			if (a[i] === "STREAMS") {
				i++
				break
			}
			i++
		}
		const rest = a.slice(i)
		const n = rest.length / 2
		const keys = rest.slice(0, n)
		const ids = rest.slice(n)

		const collect = (): [string, [string, string[]][]][] => {
			const result: [string, [string, string[]][]][] = []
			for (let k = 0; k < keys.length; k++) {
				const key = keys[k] ?? ""
				const idArg = ids[k] ?? ""
				const entries = this.streams.get(key) ?? []
				const groupState = this.groupsFor(key).get(group)
				if (!groupState) continue
				const pendingForGroup = this.pendingFor(key, group)

				let matched: [string, string[]][] = []
				if (idArg === ">") {
					const available = entries.slice(groupState.deliveredIndex)
					const take = Number.isFinite(count) ? count : available.length
					matched = available
						.slice(0, take)
						.map(([id, ...fields]) => [id, fields] as [string, string[]])
					groupState.deliveredIndex += matched.length
					for (const [id, fields] of matched) {
						pendingForGroup.set(id, { consumer, fields })
					}
				} else {
					matched = [...pendingForGroup.entries()]
						.filter(([, p]) => p.consumer === consumer)
						.map(([id, p]) => [id, p.fields] as [string, string[]])
				}
				if (matched.length > 0) result.push([key, matched])
			}
			return result
		}

		let result = collect()
		if (result.length === 0 && blocked) {
			await new Promise((resolve) => setTimeout(resolve, 5))
			result = collect()
		}
		return result.length > 0 ? result : null
	}

	async xack(...args: unknown[]) {
		const [key, group, ...ids] = args.map(String)
		const pendingForGroup = this.pendingFor(key ?? "", group ?? "")
		let acked = 0
		for (const id of ids) {
			if (pendingForGroup.delete(id)) acked += 1
		}
		return acked
	}

	async xautoclaim(...args: unknown[]) {
		const [key, group, consumer] = args.map(String)
		const pendingForGroup = this.pendingFor(key ?? "", group ?? "")
		const claimed: [string, string[]][] = []
		for (const [id, entry] of pendingForGroup) {
			if (entry.consumer !== consumer) {
				entry.consumer = consumer ?? ""
				claimed.push([id, entry.fields])
			}
		}
		return ["0-0", claimed]
	}

	pendingCount(key: string, group: string) {
		return this.pendingFor(key, group).size
	}
}

function fakeClient(clientId: string, handleEvent: ReturnType<typeof vi.fn>) {
	return {
		clientId,
		eventHandler: { handleEvent }
	} as unknown as Client
}

describe("RedisStreamGatewayReceiverPlugin", () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	test("registerClient creates the consumer group and swallows BUSYGROUP on re-registration", async () => {
		const redis = new FakeRedisStream()
		const receiver = new RedisStreamGatewayReceiverPlugin({
			redis: redis as never,
			blockingRedis: redis as never,
			consumerGroup: "group",
			consumerName: "consumer-1",
			blockMs: 10
		})

		const client = fakeClient("123", vi.fn().mockReturnValue(true))
		await receiver.registerClient(client)
		await expect(receiver.registerClient(client)).resolves.toBeUndefined()

		receiver.stop()
	})

	test("delivers entries from multiple streams to the right client", async () => {
		const redis = new FakeRedisStream()
		const onBackpressure = vi.fn()
		const receiver = new RedisStreamGatewayReceiverPlugin({
			redis: redis as never,
			blockingRedis: redis as never,
			consumerGroup: "group",
			consumerName: "consumer-1",
			blockMs: 10,
			onBackpressure
		})

		const handleA = vi.fn().mockReturnValue(true)
		const handleB = vi.fn().mockReturnValue(true)
		const clientA = fakeClient("A", handleA)
		const clientB = fakeClient("B", handleB)

		await receiver.registerClient(clientA)
		await receiver.registerClient(clientB)

		await redis.xadd(
			"carbon:events:A",
			"type",
			"MESSAGE_CREATE",
			"data",
			JSON.stringify({ id: "1" })
		)
		await redis.xadd(
			"carbon:events:B",
			"type",
			"GUILD_CREATE",
			"data",
			JSON.stringify({ id: "2" })
		)

		await vi.waitFor(() => {
			expect(handleA).toHaveBeenCalledTimes(1)
			expect(handleB).toHaveBeenCalledTimes(1)
		})

		expect(handleA).toHaveBeenCalledWith(
			{ id: "1", clientId: "A" },
			"MESSAGE_CREATE"
		)
		expect(handleB).toHaveBeenCalledWith(
			{ id: "2", clientId: "B" },
			"GUILD_CREATE"
		)
		expect(onBackpressure).not.toHaveBeenCalled()

		receiver.stop()
	})

	test("backpressure skips the ack and redelivers once capacity frees up", async () => {
		const redis = new FakeRedisStream()
		const onBackpressure = vi.fn()
		const receiver = new RedisStreamGatewayReceiverPlugin({
			redis: redis as never,
			blockingRedis: redis as never,
			consumerGroup: "group",
			consumerName: "consumer-1",
			blockMs: 10,
			onBackpressure
		})

		let full = true
		const handleEvent = vi.fn().mockImplementation(() => !full)
		const client = fakeClient("A", handleEvent)
		await receiver.registerClient(client)

		await redis.xadd(
			"carbon:events:A",
			"type",
			"MESSAGE_CREATE",
			"data",
			JSON.stringify({ id: "1" })
		)

		await vi.waitFor(() => {
			expect(onBackpressure).toHaveBeenCalledWith("A")
		})
		expect(redis.pendingCount("carbon:events:A", "group")).toBe(1)

		full = false

		await vi.waitFor(() => {
			expect(redis.pendingCount("carbon:events:A", "group")).toBe(0)
		})
		expect(handleEvent).toHaveBeenCalledWith(
			{ id: "1", clientId: "A" },
			"MESSAGE_CREATE"
		)

		receiver.stop()
	})

	test("detach stops future delivery without crashing the loop", async () => {
		const redis = new FakeRedisStream()
		const receiver = new RedisStreamGatewayReceiverPlugin({
			redis: redis as never,
			blockingRedis: redis as never,
			consumerGroup: "group",
			consumerName: "consumer-1",
			blockMs: 10
		})

		const handleEvent = vi.fn().mockReturnValue(true)
		const client = fakeClient("A", handleEvent)
		await receiver.registerClient(client)
		receiver.detach("A")

		await redis.xadd(
			"carbon:events:A",
			"type",
			"MESSAGE_CREATE",
			"data",
			JSON.stringify({ id: "1" })
		)

		await new Promise((resolve) => setTimeout(resolve, 30))
		expect(handleEvent).not.toHaveBeenCalled()

		receiver.stop()
	})

	test("XAUTOCLAIM sweep reclaims an entry left pending by a dead consumer", async () => {
		const redis = new FakeRedisStream()
		// Manually create the group and deliver an entry to a "dead" consumer,
		// bypassing the plugin, to simulate a crash mid-processing.
		await redis.xgroup("CREATE", "carbon:events:A", "group", "$")
		await redis.xadd(
			"carbon:events:A",
			"type",
			"MESSAGE_CREATE",
			"data",
			JSON.stringify({ id: "1" })
		)
		await redis.xreadgroup(
			"GROUP",
			"group",
			"dead-consumer",
			"STREAMS",
			"carbon:events:A",
			">"
		)
		expect(redis.pendingCount("carbon:events:A", "group")).toBe(1)

		const receiver = new RedisStreamGatewayReceiverPlugin({
			redis: redis as never,
			blockingRedis: redis as never,
			consumerGroup: "group",
			consumerName: "consumer-1",
			blockMs: 10,
			autoclaimIntervalMs: 0
		})

		const handleEvent = vi.fn().mockReturnValue(true)
		const client = fakeClient("A", handleEvent)
		await receiver.registerClient(client)

		await vi.waitFor(() => {
			expect(handleEvent).toHaveBeenCalledWith(
				{ id: "1", clientId: "A" },
				"MESSAGE_CREATE"
			)
		})
		expect(receiver.getMetrics().autoclaimReclaimed).toBeGreaterThanOrEqual(1)

		receiver.stop()
	})
})
