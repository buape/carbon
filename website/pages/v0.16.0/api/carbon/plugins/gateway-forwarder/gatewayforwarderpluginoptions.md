---
title: GatewayForwarderPluginOptions
hidden: true
---

## interface `GatewayForwarderPluginOptions`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| webhookUrl | `string` | Yes | The URL to forward webhook events to. Typically this is your base URL in the client, and then `/events` |
| webhookHeaders | `Record<string, string>` | No | Optional headers to add to the webhook request. |
| runtimeProfile | `RuntimeProfile` | No | Runtime profile that controls delivery defaults.  @default "serverless" |
| delivery | `GatewayForwarderDeliveryOptions` | No | Delivery policy for forwarded events. |
| fetch | `(
		input: string | URL | Request,
		init?: RequestInit
	) => Promise<Response>` | No | Custom fetch for forwarding delivery. |
| privateKey | `string` | Yes | The ed25519 private key in PEM format, used to sign forwarded events. This should include the BEGIN/END markers. When loading from an environment variable, the newlines can be escaped (\\n). |
