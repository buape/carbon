---
title: GatewayConnectionState
hidden: true
---

## Signature

```ts
type GatewayConnectionState = | { kind: "idle"; reconnect: false }
	| {
			kind: "connecting"
			socket: GatewayWebSocketLike
			generation: number
			resume: boolean
	  }
	| {
			kind: "connected"
			socket: GatewayWebSocketLike
			generation: number
			session: GatewaySessionState
	  }
	| {
			kind: "reconnecting"
			attempt: number
			resume: boolean
			timeout: NodeJS.Timeout
	  }
	| { kind: "disconnecting" }
```

