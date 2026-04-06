import { type Context, Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"
import type {
	ListenerEventAdditionalData,
	ListenerEventRawData,
	ListenerEventType
} from "../../types/index.js"
import type {
	CloudflareGatewayDurableObjectConfig,
	CloudflareGatewayForwardPayload,
	CloudflareGatewayPluginOptions
} from "./types.js"

const defaults = {
	forwardPath: "/__carbon/gateway-events",
	secretHeader: "x-carbon-gateway-secret",
	durableObjectBinding: "CARBON_GATEWAY",
	durableObjectName: "default",
	connectPath: "/connect",
	connectDebounceMs: 10_000
} as const

export class CloudflareGatewayPlugin extends Plugin {
	readonly id = "cloudflare-gateway"
	readonly options: Required<
		Omit<CloudflareGatewayPluginOptions, "reconnect" | "autoInteractions">
	> &
		Pick<CloudflareGatewayPluginOptions, "reconnect" | "autoInteractions">
	protected client?: Client
	protected lastConnectAttempt = 0

	constructor(options: CloudflareGatewayPluginOptions) {
		super()
		this.options = {
			...defaults,
			...options
		}
	}

	registerClient(client: Client) {
		this.client = client
		// Workers + forwarded gateway listeners should avoid cross-request scheduler promises.
		client.rest.options.queueRequests = false
	}

	registerRoutes(client: Client) {
		client.routes.push({
			method: "POST",
			path: this.options.forwardPath,
			handler: this.handleForwardRequest.bind(this)
		})
	}

	onRequest(req: Request, ctx: Context): undefined {
		if (!this.client) {
			return
		}

		const now = Date.now()
		if (now - this.lastConnectAttempt < this.options.connectDebounceMs) {
			return
		}

		const url = new URL(req.url)
		if (url.pathname === this.options.forwardPath) {
			return
		}

		const envValue =
			ctx && typeof ctx === "object" ? Reflect.get(ctx, "env") : null
		if (!envValue || typeof envValue !== "object") {
			return
		}
		const env = envValue as Record<string, unknown>

		this.lastConnectAttempt = now
		const connectPromise = this.connectDurableObject(env).catch((error) => {
			console.error(
				"[CloudflareGatewayPlugin] Failed to connect durable object",
				error
			)
		})
		ctx.waitUntil?.(connectPromise)
	}

	protected async handleForwardRequest(req: Request) {
		if (!this.client) {
			return new Response("Service Unavailable", { status: 503 })
		}

		const deploySecret =
			typeof process === "undefined" ? "" : (process.env?.DEPLOY_SECRET ?? "")
		if (req.headers.get(this.options.secretHeader) !== deploySecret) {
			return new Response("Unauthorized", { status: 401 })
		}

		const payload =
			(await req.json()) as Partial<CloudflareGatewayForwardPayload>
		if (!payload.type || !payload.data) {
			return new Response("Bad Request", { status: 400 })
		}

		const type = payload.type as ListenerEventType
		const rawPayload = {
			...payload.data,
			clientId: this.client.options.clientId
		} as ListenerEventRawData[ListenerEventType] & ListenerEventAdditionalData
		const accepted = this.client.eventHandler.handleEvent(rawPayload, type)
		if (!accepted) {
			return new Response("Service Unavailable", { status: 503 })
		}

		return new Response(null, { status: 204 })
	}

	protected async connectDurableObject(env: Record<string, unknown>) {
		const namespaceValue = env[this.options.durableObjectBinding]
		if (!namespaceValue || typeof namespaceValue !== "object") {
			return
		}

		const namespaceMethods = namespaceValue as {
			idFromName?: unknown
			get?: unknown
		}
		if (
			typeof namespaceMethods.idFromName !== "function" ||
			typeof namespaceMethods.get !== "function"
		) {
			return
		}

		const processEnv = typeof process === "undefined" ? undefined : process.env
		const baseUrl =
			processEnv?.BASE_URL ?? (env.BASE_URL as string | undefined) ?? ""
		const deploySecret =
			processEnv?.DEPLOY_SECRET ??
			(env.DEPLOY_SECRET as string | undefined) ??
			""
		const token =
			processEnv?.DISCORD_BOT_TOKEN ??
			(env.DISCORD_BOT_TOKEN as string | undefined) ??
			""
		const clientId =
			processEnv?.DISCORD_CLIENT_ID ??
			(env.DISCORD_CLIENT_ID as string | undefined) ??
			""
		if (!baseUrl || !deploySecret || !token || !clientId) {
			return
		}

		const config: CloudflareGatewayDurableObjectConfig = {
			baseUrl,
			deploySecret,
			token,
			clientId,
			forwardPath: this.options.forwardPath,
			secretHeader: this.options.secretHeader,
			gateway: {
				intents: this.options.intents,
				autoInteractions: this.options.autoInteractions,
				reconnect: this.options.reconnect
			}
		}

		const namespace = namespaceValue as {
			idFromName(name: string): unknown
			get(id: unknown): {
				fetch(
					input: string | URL | Request,
					init?: RequestInit
				): Promise<Response>
			}
		}
		const id = namespace.idFromName(this.options.durableObjectName)
		const stub = namespace.get(id)
		await stub.fetch(`https://carbon.gateway${this.options.connectPath}`, {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(config)
		})
	}
}
