import type { Cluster, Redis, RedisValue } from "ioredis"

/**
 * Any ioredis client capable of running stream commands. Accepts a plain
 * `Redis` connection or a `Cluster` client interchangeably.
 */
export type RedisStreamClient = Redis | Cluster

/**
 * ioredis's stream command overloads (`xadd`/`xgroup`/`xack`/`xautoclaim`/
 * `xreadgroup`) are heavily variadic and tuple-typed per-overload, which
 * fights back hard against argument lists built up at runtime. We only ever
 * call these with flat argument lists, so both plugins bind through this
 * simpler signature instead of wrestling the full overload set. `RedisValue`
 * (`string | Buffer | number`) is ioredis's own exported type for a single
 * command argument, so this stays honest about what ioredis actually accepts.
 */
export type VariadicRedisCommand = (...args: RedisValue[]) => Promise<unknown>

/**
 * Derives the Redis Stream key for a client's gateway events. Exported so the
 * sender and receiver plugins can never disagree on the naming convention.
 */
export function deriveStreamKey(
	clientId: string,
	prefix = "carbon:events"
): string {
	return `${prefix}:${clientId}`
}

/** A single parsed entry read back off a stream. */
export interface RedisStreamEntry {
	id: string
	type: string
	data: unknown
	/** `Date.now()` at the forwarder, captured when the gateway event was received (ms epoch). */
	enqueuedAt: number | undefined
}

/**
 * Parses the flat field/value array ioredis returns for a stream entry
 * (as written by `RedisStreamGatewayForwarderPlugin`) into a typed shape.
 */
export function parseStreamEntryFields(fields: string[]): {
	type: string
	data: unknown
	enqueuedAt: number | undefined
} {
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
}
