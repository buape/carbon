---
title: CloudflareGatewayPlugin
hidden: true
---

## class `CloudflareGatewayPlugin`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `unknown` | Yes |  |
| options | `Required<
		Omit<CloudflareGatewayPluginOptions, "reconnect" | "autoInteractions">
	> &
		Pick<CloudflareGatewayPluginOptions, "reconnect" | "autoInteractions">` | Yes |  |
| client | `Client` | No |  |
| lastConnectAttempt | `unknown` | Yes |  |
| registerClient | `(client: Client) => void` | Yes |  |
| registerRoutes | `(client: Client) => void` | Yes |  |
| onRequest | `(req: Request, ctx: Context) => undefined` | Yes |  |
| handleForwardRequest | `(req: Request) => void` | Yes |  |
| connectDurableObject | `(env: Record<string, unknown>) => void` | Yes |  |
