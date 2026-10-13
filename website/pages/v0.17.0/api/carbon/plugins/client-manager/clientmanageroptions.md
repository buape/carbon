---
title: ClientManagerOptions
description: Options for the ClientManager
hidden: true
---

## interface `ClientManagerOptions`

Options for the ClientManager

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| baseUrl | `string` | Yes | The base URL of the applications to mount the proxy at |
| deploySecret | `string` | Yes | The deploy secret of the applications |
| sharedOptions | `Omit<
		ClientOptions,
		"baseUrl" | "deploySecret" | "clientId" | "publicKey" | "token"
	>` | Yes | Shared options that apply to all applications |
| applications | `ApplicationCredentials[]` | No | Array of application credentials. If you need dynamic application loading (e.g., from a database), extend ClientManager and override getClient/getClients/getClientIds instead. |
| initialSetupOptions | `ClientSetupOptions` | No | The initial setup options for the clients, this will be passed to clientManager#setupClient |
| startup | `ClientManagerStartupOptions` | No | Startup orchestration controls. |
