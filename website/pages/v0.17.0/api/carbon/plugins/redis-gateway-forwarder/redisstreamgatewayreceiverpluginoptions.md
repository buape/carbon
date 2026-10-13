---
title: RedisStreamGatewayReceiverPluginOptions
hidden: true
---

## interface `RedisStreamGatewayReceiverPluginOptions`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| redis | `RedisStreamClient` | Yes | Non-blocking connection used for XGROUP/XACK/XAUTOCLAIM admin commands. |
| blockingRedis | `RedisStreamClient` | Yes | A dedicated connection (e.g. `redis.duplicate()`) used exclusively for the blocking XREADGROUP read loop. Must not be shared with `redis` or any other blocking/subscribe usage — a connection blocked in XREADGROUP can't service other commands until the block returns. |
| consumerGroup | `string` | Yes | Redis consumer group name shared by every processor replica. |
| consumerName | `string` | Yes | Unique consumer name for this process/replica, e.g. `${hostname}:${pid}`. |
| streamKeyPrefix | `string` | No | Prefix used to derive the per-client stream key (`<prefix>:<clientId>`). Must match the sender's `streamKeyPrefix`.  @default "carbon:events" |
| blockMs | `number` | No | How long each `XREADGROUP` blocks waiting for new entries, in ms. This is a real blocking wait, not a poll — Redis holds the connection open and replies the instant an entry lands on any watched stream (or when `blockMs` elapses with nothing new), so there's no busy looping while traffic is flowing. The bound only matters for two edge cases: noticing a stream `registerClient`'d during a total lull with zero events across every other watched stream, and pacing the periodic `XAUTOCLAIM` sweep (see `autoclaimIntervalMs`) — both of which are naturally rare since a live gateway connection is rarely fully silent.  @default 5000 |
| batchCount | `number` | No | Max entries read per stream per XREADGROUP call.  @default 50 |
| autoclaimIntervalMs | `number` | No | How often to sweep for stale pending entries from dead consumers, in ms.  @default 30_000 |
| autoclaimMinIdleMs | `number` | No | Minimum idle time before a pending entry is considered stale/claimable.  @default 30_000 |
| onBackpressure | `(clientId: string) => void` | No | Called when a client's event queue is full and an entry is left unacked. |
| onDeliverError | `(clientId: string, error: unknown) => void` | No | Called when dispatching an entry to a client's listeners throws. |
| onRegisterError | `(clientId: string, error: unknown) => void` | No | Called when creating a client's consumer group fails for a reason other than the group already existing (e.g. the stream's Redis is briefly unreachable). The client is still watched — its stream just won't be read from a Redis-level consumer group until this succeeds, so a later `registerClient` call (or Carbon's own client-recreate path) can recover. |
| onDeliveryLatency | `(
		clientId: string,
		latencyMs: number,
		context: { isReplay: boolean }
	) => void` | No | Called for every entry successfully delivered to a client's listeners, with the end-to-end latency (ms) from when the forwarder first received the gateway event (the entry's `ts` field) to right now. `isReplay` is true for entries delivered via the own-pending drain or an `XAUTOCLAIM` sweep rather than a fresh `>` read — a high replay latency reflects recovery time (a stalled consumer, a processor restart), not steady-state pipeline latency, so callers should usually track these separately. |
