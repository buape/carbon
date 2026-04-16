---
title: GatewayPlugin
hidden: true
---

## class `GatewayPlugin`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `unknown` | Yes |  |
| client | `Client` | No |  |
| options | `GatewayPluginOptions` | Yes |  |
| state | `GatewayState` | Yes |  |
| ws | `GatewayWebSocketLike | null` | Yes |  |
| monitor | `ConnectionMonitor` | Yes |  |
| rateLimit | `GatewayRateLimit` | Yes |  |
| heartbeatInterval | `NodeJS.Timeout` | No |  |
| firstHeartbeatTimeout | `NodeJS.Timeout` | No |  |
| sequence | `number | null` | Yes |  |
| lastHeartbeatAck | `unknown` | Yes |  |
| emitter | `EventEmitter` | Yes |  |
| reconnectAttempts | `unknown` | Yes |  |
| shardId | `number` | No |  |
| totalShards | `number` | No |  |
| gatewayInfo | `APIGatewayBotInfo` | No |  |
| isConnected | `unknown` | Yes |  |
| pings | `number[]` | Yes |  |
| babyCache | `BabyCache` | Yes |  |
| reconnectTimeout | `NodeJS.Timeout` | No |  |
| isConnecting | `unknown` | Yes |  |
| socketGeneration | `unknown` | Yes |  |
| shouldReconnect | `unknown` | Yes |  |
| nextConnectionShouldResume | `unknown` | Yes |  |
| silentSocketClosures | `unknown` | Yes |  |
| consecutiveResumeFailures | `unknown` | Yes |  |
| registerClient | `(client: Client) => Promise<void>` | Yes | Bootstraps gateway metadata and opens the initial websocket connection. |
| connect | `(resume: unknown) => void` | Yes | Opens a new websocket connection and prepares either IDENTIFY or RESUME on HELLO. |
| disconnect | `() => void` | Yes | Stops heartbeats, clears reconnect state, and closes the active socket intentionally. |
| createWebSocket | `(url: string) => GatewayWebSocketLike` | Yes | Creates the websocket instance for a gateway URL. Override in tests if needed. |
| setupWebSocket | `() => void` | Yes | Attaches websocket lifecycle handlers for open, message, close, and error. |
| handleClose | `(code: number) => void` | Yes | Handles close codes and decides whether reconnection should resume or re-identify. |
| handleZombieConnection | `() => void` | Yes | Handles missing heartbeat acknowledgements by forcing a reconnect flow. |
| handleReconnect | `() => void` | Yes | Compatibility wrapper that maps to reconnect opcode handling. |
| canResume | `() => boolean` | Yes | Returns whether session_id and sequence are both available for RESUME. |
| resume | `() => void` | Yes | Sends a RESUME payload using cached session_id and latest sequence. |
| send | `(payload: GatewayPayload, skipRateLimit: unknown) => void` | Yes | Sends a gateway payload with size and rate-limit safeguards. |
| identify | `() => void` | Yes | Sends an IDENTIFY payload for a fresh gateway session. |
| updatePresence | `(data: UpdatePresenceData) => void` | Yes | Updates bot presence over the gateway connection. |
| updateVoiceState | `(data: UpdateVoiceStateData) => void` | Yes | Updates bot voice state for a guild over the gateway connection. |
| requestGuildMembers | `(data: RequestGuildMembersData) => void` | Yes | Requests guild members and validates required intents/options. |
| getRateLimitStatus | `() => void` | Yes | Returns the current outbound gateway rate-limit snapshot. |
| getIntentsInfo | `() => void` | Yes | Returns helpers describing which intents are currently enabled. |
| hasIntent | `(intent: number) => boolean` | Yes | Checks if a specific intent bit is enabled. |
| isCurrentSocket | `(socket: GatewayWebSocketLike, generation: number) => boolean` | Yes | Guards handlers from acting on stale websocket instances. |
| onSocketEvent | `(socket: GatewayWebSocketLike, event: "open" | "message" | "close" | "error", handler: (incoming: unknown) => void) => void` | Yes |  |
| getMessageText | `(incoming: unknown) => string | null` | Yes |  |
| extractSocketPayload | `(incoming: unknown) => void` | Yes |  |
| getCloseCode | `(incoming: unknown) => void` | Yes |  |
| getSocketError | `(incoming: unknown) => void` | Yes |  |
| closeSocketImmediately | `(socket: GatewayWebSocketLike) => void` | Yes |  |
| handleHello | `(data: unknown, generation: number) => void` | Yes | Processes HELLO, starts heartbeat scheduling, then sends RESUME or IDENTIFY. |
| handleHeartbeatAck | `() => void` | Yes | Marks heartbeat acknowledged and updates rolling ping metrics. |
| sendHeartbeatNow | `() => void` | Yes | Immediately sends a heartbeat in response to gateway heartbeat requests. |
| handleDispatch | `(payload: GatewayDispatchPayload) => void` | Yes | Processes dispatch events, session caching, and Carbon event forwarding. |
| handleInvalidSession | `(data: unknown) => void` | Yes | Handles INVALID_SESSION and schedules reconnect with Discord-compliant delay. |
| handleReconnectOpcode | `() => void` | Yes | Handles RECONNECT opcode by scheduling reconnect with resume preference. |
| reconnectWithSocketRestart | `() => void` | Yes | Terminates the current socket after reconnect has been scheduled. |
| scheduleReconnect | `(options: ReconnectScheduleOptions) => void` | Yes | Schedules a single reconnect attempt with backoff and attempt limits. |
| computeReconnectDelay | `(options: ReconnectScheduleOptions) => number` | Yes | Computes exponential reconnect delay with jitter and optional minimum delay. |
| clearReconnectTimeout | `() => void` | Yes | Clears any pending reconnect timer. |
| resetSessionState | `() => void` | Yes | Clears resume-related session state after non-resumable failures. |
| ensureGatewayParams | `(url: string) => string` | Yes | Ensures gateway URLs include v=10 and encoding=json query parameters. |
