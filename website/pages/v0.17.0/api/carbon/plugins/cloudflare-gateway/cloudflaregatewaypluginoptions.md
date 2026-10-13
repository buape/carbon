---
title: CloudflareGatewayPluginOptions
hidden: true
---

## interface `CloudflareGatewayPluginOptions`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| intents | `number` | Yes | Gateway intents passed to the internal GatewayPlugin running in the Durable Object. |
| reconnect | `GatewayPluginOptions["reconnect"]` | No | Gateway reconnect strategy passed through to GatewayPlugin. |
| autoInteractions | `boolean` | No | Whether autoInteractions should be enabled in the Durable Object GatewayPlugin. @default false |
| forwardPath | ``/${string}`` | No | Route on your Worker that receives forwarded events from the Durable Object. @default "/__carbon/gateway-events" |
| secretHeader | `string` | No | Header used to authenticate forwarded events. @default "x-carbon-gateway-secret" |
| durableObjectBinding | `string` | No | Durable Object binding name in Wrangler. @default "CARBON_GATEWAY" |
| durableObjectName | `string` | No | Durable Object instance name. @default "default" |
| connectPath | ``/${string}`` | No | Connect endpoint implemented by the Durable Object. @default "/connect" |
| connectDebounceMs | `number` | No | Minimum time between automatic connect calls. @default 10000 |
