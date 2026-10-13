---
title: GatewaySessionState
hidden: true
---

## Signature

```ts
type GatewaySessionState = | {
			resumable: false
			sequence: null
			sessionId: null
			resumeGatewayUrl: null
	  }
	| {
			resumable: true
			sequence: number
			sessionId: string
			resumeGatewayUrl: string | null
	  }
```

