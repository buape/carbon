import { Routes } from "discord-api-types/v10"
import type { Context, Route } from "../../abstracts/Plugin.js"
import { Client, type ClientOptions } from "../../classes/Client.js"

/**
 * Credentials for a single application in the ClientManager
 */
export interface ApplicationCredentials {
	/**
	 * The client ID of the application - must be a valid Discord snowflake
	 */
	clientId: string
	/**
	 * The public key of the app, used for interaction verification
	 * Can be a single key or an array of keys
	 */
	publicKey: string | string[]
	/**
	 * The token of the bot
	 */
	token: string
}

export interface ClientSetupOptions {
	/**
	 * Whether to recreate the client if it already exists
	 */
	recreate?: boolean
	/**
	 * Whether to set the interactions URL on the Discord Developer Portal
	 */
	setInteractionsUrlOnDevPortal?: boolean
	/**
	 * Whether to set the events URL on the Discord Developer Portal
	 */
	setEventsUrlOnDevPortal?: boolean
}

/**
 * Options for the ClientManager
 */
export interface ClientManagerOptions {
	/**
	 * The base URL of the applications to mount the proxy at
	 */
	baseUrl: string
	/**
	 * The deploy secret of the applications
	 */
	deploySecret: string
	/**
	 * Shared options that apply to all applications
	 */
	sharedOptions: Omit<
		ClientOptions,
		"baseUrl" | "deploySecret" | "clientId" | "publicKey" | "token"
	>
	/**
	 * Array of application credentials.
	 * If you need dynamic application loading (e.g., from a database),
	 * extend ClientManager and override getClient/getAllClients/getClientIds instead.
	 */
	applications?: ApplicationCredentials[]
	/**
	 * The initial setup options for the clients, this will be passed to clientManager#setupClient
	 */
	initialSetupOptions?: ClientSetupOptions
}

/**
 * Manages multiple Discord applications, routing requests to the appropriate client
 * based on the client ID in the URL path (/:clientId/*)
 *
 * To use with a database, extend this class and override:
 * - getClient(clientId) - Return the client for a specific ID (or create it)
 * - getAllClients() - Return all available clients
 * - getClientIds() - Return all available client IDs
 *
 * Then call setupClient(credentials) to create clients on-demand.
 */
export class ClientManager {
	/**
	 * The routes that the application manager will handle
	 */
	routes: Route[] = []

	/**
	 * The shared deploy secret used for all applications
	 */
	protected deploySecret?: string

	/**
	 * The base URL of the applications to mount the proxy at
	 */
	protected baseUrl: string

	/**
	 * Shared options that apply to all applications
	 * Protected to allow subclasses to use it when creating clients
	 */
	protected sharedOptions: Omit<
		ClientOptions,
		"baseUrl" | "deploySecret" | "clientId" | "publicKey" | "token"
	>

	protected clients: Map<string, Client> = new Map()
	protected staticApplications: ApplicationCredentials[]
	protected initialHandlers: ConstructorParameters<typeof Client>[1]
	protected initialPlugins: ConstructorParameters<typeof Client>[2]

	/**
	 * Creates a new ClientManager
	 * @param options Configuration options including shared settings and per-app credentials
	 */
	constructor(
		options: ClientManagerOptions,
		handlers: ConstructorParameters<typeof Client>[1],
		plugins: ConstructorParameters<typeof Client>[2]
	) {
		this.sharedOptions = options.sharedOptions
		this.deploySecret = options.deploySecret
		this.baseUrl = options.baseUrl
		this.staticApplications = options.applications ?? []
		this.initialHandlers = handlers
		this.initialPlugins = plugins

		this.setupRoutes()

		this.getApplications().then(async (applications) => {
			applications.map(async (application) => {
				this.setupClient(
					{
						clientId: application.clientId,
						publicKey: application.publicKey,
						token: application.token
					},
					options.initialSetupOptions
				)
			})
		})
	}

	/**
	 * Setup a client from credentials.
	 *
	 * @param credentials The application credentials
	 * @param options The setup options for the client
	 * @returns A configured Client instance
	 */
	public async setupClient(
		credentials: ApplicationCredentials,
		options: ClientSetupOptions = {
			recreate: false,
			setInteractionsUrlOnDevPortal: false,
			setEventsUrlOnDevPortal: false
		}
	): Promise<Client> {
		const existing = this.getClient(credentials.clientId)
		if (existing && !options.recreate) {
			throw new Error(
				`Client ${credentials.clientId} already exists. If you want to recreate it, pass true to the recreate parameter.`
			)
		}

		if (existing && options.recreate) {
			this.clients.delete(credentials.clientId)
		}

		if (!this.isValidClientId(credentials.clientId)) {
			throw new Error(
				`Invalid client ID: ${credentials.clientId}. Client ID must be a valid Discord snowflake (17-19 digits).`
			)
		}

		const clientOptions: ClientOptions = {
			...this.sharedOptions,
			baseUrl: `${this.baseUrl}/${credentials.clientId}`,
			deploySecret: this.deploySecret,
			clientId: credentials.clientId,
			publicKey: credentials.publicKey,
			token: credentials.token
		}

		const client = new Client(
			clientOptions,
			this.initialHandlers,
			this.initialPlugins
		)
		this.clients.set(credentials.clientId, client)

		if (
			options.setInteractionsUrlOnDevPortal ||
			options.setEventsUrlOnDevPortal
		) {
			await client.rest.patch(Routes.currentApplication(), {
				body: {
					interactions_endpoint_url: options.setInteractionsUrlOnDevPortal
						? `${this.baseUrl}/${credentials.clientId}/interactions`
						: undefined,
					event_webhooks_url: options.setEventsUrlOnDevPortal
						? `${this.baseUrl}/${credentials.clientId}/events`
						: undefined
				}
			})
		}

		return client
	}

	/**
	 * Set up the routing for the application manager
	 */
	protected setupRoutes() {
		this.routes.push({
			method: "GET",
			path: "/deploy",
			handler: this.handleGlobalDeploy.bind(this),
			protected: true,
			disabled: !this.deploySecret
		})

		this.routes.push({
			method: "POST",
			path: "/:clientId/*",
			handler: this.handleProxyRequest.bind(this)
		})

		this.routes.push({
			method: "GET",
			path: "/:clientId/*",
			handler: this.handleProxyRequest.bind(this)
		})
	}

	/**
	 * Deploy all applications
	 */
	protected async handleGlobalDeploy(req: Request): Promise<Response> {
		if (this.deploySecret) {
			const url = new URL(req.url)
			const secret = url.searchParams.get("secret")
			if (secret !== this.deploySecret) {
				return new Response("Unauthorized", { status: 401 })
			}
		}

		const results: { clientId: string; status: string }[] = []
		const clientIds = this.getClientIds()

		for (const clientId of clientIds) {
			const client = this.getClient(clientId)
			if (!client) continue

			try {
				await client.handleDeployRequest()
				results.push({ clientId, status: "success" })
			} catch (error) {
				results.push({
					clientId,
					status: `error: ${error instanceof Error ? error.message : String(error)}`
				})
			}
		}

		return Response.json(results, { status: 200 })
	}

	/**
	 * Handle a request and route it to the appropriate client
	 * @param req The incoming request
	 * @param ctx Optional context (for Cloudflare Workers, etc.)
	 */
	async handleRequest(req: Request, ctx?: Context): Promise<Response> {
		const url = new URL(req.url)
		const baseUrl = new URL(this.baseUrl)
		const basePathname = baseUrl.pathname.replace(/\/$/, "")
		const reqPathname = url.pathname.replace(/\/$/, "")
		if (!reqPathname.startsWith(basePathname)) {
			return new Response("Not Found: Invalid base URL", { status: 404 })
		}
		const truePathname = reqPathname.slice(basePathname.length)
		if (truePathname === "/deploy" && req.method === "GET") {
			return this.handleGlobalDeploy(req)
		}
		const pathParts = truePathname.split("/").filter(Boolean)
		if (pathParts.length < 2) {
			return new Response("Bad Request: Invalid path format", { status: 400 })
		}
		const clientId = pathParts[0]
		if (!clientId) {
			return new Response("Bad Request: Missing client ID", { status: 400 })
		}
		const client = this.getClient(clientId)
		if (!client) {
			return new Response(
				`Not Found: No application with client ID ${clientId}`,
				{
					status: 404
				}
			)
		}
		const remainingPath = `/${pathParts.slice(1).join("/")}`
		const route = client.routes.find(
			(r) => r.path === remainingPath && r.method === req.method && !r.disabled
		)
		if (!route) {
			return new Response(
				`Not Found: No route ${req.method} ${remainingPath}`,
				{
					status: 404
				}
			)
		}
		if (route.protected) {
			const secret = url.searchParams.get("secret")
			if (secret !== client.options.deploySecret) {
				return new Response("Unauthorized", { status: 401 })
			}
		}
		return route.handler(req, ctx)
	}

	protected async handleProxyRequest(
		req: Request,
		ctx?: Context
	): Promise<Response> {
		return this.handleRequest(req, ctx)
	}

	/**
	 * Get a client by its client ID
	 * @param clientId The client ID to look up
	 */
	getClient(clientId: string): Client | undefined {
		return this.clients.get(clientId)
	}

	/**
	 * Get all clients that the manager is managing
	 */
	getClients(): Client[] {
		return Array.from(this.clients.values())
	}

	/**
	 * Get all client IDs that the manager is managing
	 */
	getClientIds(): string[] {
		return Array.from(this.clients.keys())
	}

	/**
	 * Get all applications
	 * You can override this in an extended class to return dynamic applications
	 */
	async getApplications(): Promise<ApplicationCredentials[]> {
		return this.staticApplications
	}

	/**
	 * Get an application by its client ID
	 * You can override this in an extended class to return dynamic applications
	 */
	async getApplication(
		clientId: string
	): Promise<ApplicationCredentials | undefined> {
		return this.staticApplications.find((app) => app.clientId === clientId)
	}

	/**
	 * Validate if a string is a valid Discord snowflake
	 */
	protected isValidClientId(id: string): boolean {
		return /^\d{17,19}$/.test(id)
	}
}
