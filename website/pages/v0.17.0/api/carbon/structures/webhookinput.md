---
title: WebhookInput
hidden: true
---

## Signature

```ts
type WebhookInput = | APIWebhook
	| { id: WebhookIdLike; token: string; threadId?: ChannelIdLike }
	| string
```

