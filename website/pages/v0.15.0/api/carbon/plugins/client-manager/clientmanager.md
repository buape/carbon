---
title: ClientManager
description: Manages multiple Discord applications, routing requests to the appropriate client
hidden: true
---

## class `ClientManager`

Manages multiple Discord applications, routing requests to the appropriate client
based on the client ID in the URL path (/:clientId/*)

To use with a database, extend this class and override:
- getClient(clientId) - Return the client for a specific ID (or create it)
- getClients() - Return all available clients
- getClientIds() - Return all available client IDs

Then call setupClient(credentials) to create clients on-demand.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| routes | `Route[]` | Yes | The routes that the application manager will handle |
| deploySecret | `string` | No | The shared deploy secret used for all applications |
| baseUrl | `string` | Yes | The base URL of the applications to mount the proxy at |
| sharedOptions | `Omit<
		ClientOptions,
		"baseUrl" | "deploySecret" | "clientId" | "publicKey" | "token"
	>` | Yes | Shared options that apply to all applications Protected to allow subclasses to use it when creating clients |
| clients | `Map<string, Client>` | Yes |  |
| staticApplications | `ApplicationCredentials[]` | Yes |  |
| initialHandlers | `ConstructorParameters<typeof Client>[1]` | Yes |  |
| initialPlugins | `ConstructorParameters<typeof Client>[2]` | Yes |  |
| startupPromise | `Promise<ClientManagerStartupResult>` | Yes |  |
| whenReady | `() => Promise<ClientManagerStartupResult>` | Yes |  |
| initializeClients | `(initialSetupOptions: ClientSetupOptions, startupOptions: ClientManagerStartupOptions) => Promise<ClientManagerStartupResult>` | Yes |  |
| setupClient | `(credentials: ApplicationCredentials, options: ClientSetupOptions) => Promise<Client>` | Yes | Setup a client from credentials.  @param credentials The application credentials @param options The setup options for the client @returns A configured Client instance |
| setupRoutes | `() => void` | Yes | Set up the routing for the application manager |
| handleGlobalDeploy | `(req: Request) => Promise<Response>` | Yes | Deploy all applications |
| handleRequest | `(req: Request, ctx: Context) => Promise<Response>` | Yes | Handle a request and route it to the appropriate client @param req The incoming request @param ctx Optional context (for Cloudflare Workers, etc.) |
| handleProxyRequest | `(req: Request, ctx: Context) => Promise<Response>` | Yes |  |
| getClient | `(clientId: string) => Client | undefined` | Yes | Get a client by its client ID @param clientId The client ID to look up |
| getClients | `() => Client[]` | Yes | Get all clients that the manager is managing |
| getClientIds | `() => string[]` | Yes | Get all client IDs that the manager is managing |
| getApplications | `() => Promise<ApplicationCredentials[]>` | Yes | Get all applications You can override this in an extended class to return dynamic applications |
| getApplication | `(clientId: string) => Promise<ApplicationCredentials | undefined>` | Yes | Get an application by its client ID You can override this in an extended class to return dynamic applications |
| isValidClientId | `(id: string) => boolean` | Yes | Validate if a string is a valid Discord snowflake |
