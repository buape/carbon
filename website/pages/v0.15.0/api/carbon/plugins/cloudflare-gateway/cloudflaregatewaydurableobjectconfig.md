---
title: CloudflareGatewayDurableObjectConfig
hidden: true
---

## Signature

```ts
type CloudflareGatewayDurableObjectConfig = Omit<
	Pick<ClientOptions, "baseUrl" | "deploySecret" | "token" | "clientId">,
	"deploySecret"
> & {
	deploySecret: string
	forwardPath: `/${string}
```

	secretHeader: string
	gateway: {
		intents: number
		autoInteractions?: boolean
		reconnect?: GatewayPluginOptions["reconnect"]
	}
}`
