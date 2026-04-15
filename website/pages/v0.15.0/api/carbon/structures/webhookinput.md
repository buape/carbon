---
title: WebhookInput
hidden: true
---

## Signature

```ts
type WebhookInput = | APIWebhook
	| { id: string; token: string; threadId?: string }
	| string
```

