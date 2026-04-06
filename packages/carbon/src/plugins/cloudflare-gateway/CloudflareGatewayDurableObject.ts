import type { Client } from "../../classes/Client.js"
import { GatewayPlugin } from "../gateway/GatewayPlugin.js"
import type {
	CloudflareGatewayDurableObjectConfig,
	CloudflareGatewayForwardPayload
} from "./types.js"

const gatewayConfigStorageKey = "gateway-config"
const connectPath = "/connect"
const disconnectPath = "/disconnect"
const statusPath = "/status"
const reconnectAlarmIntervalMs = 60_000
const defaultForwardPath = "/__carbon/gateway-events"
const defaultSecretHeader = "x-carbon-gateway-secret"

export class CloudflareGatewayDurableObject {
	protected state: {
		storage: {
			get<T>(key: string): Promise<T | undefined>
			put(key: string, value: unknown): Promise<void>
			delete(key: string): Promise<boolean | number | undefined>
			setAlarm(time: number | Date): Promise<void>
			deleteAlarm?(): Promise<void>
		}
	}
	protected config: CloudflareGatewayDurableObjectConfig | null = null
	protected gateway: GatewayPlugin | null = null
	protected bootstrap: Promise<void>
	protected connecting: Promise<void> | null = null

	constructor(
		state: {
			storage: {
				get<T>(key: string): Promise<T | undefined>
				put(key: string, value: unknown): Promise<void>
				delete(key: string): Promise<boolean | number | undefined>
				setAlarm(time: number | Date): Promise<void>
				deleteAlarm?(): Promise<void>
			}
		},
		_env: unknown
	) {
		this.state = state
		this.bootstrap = this.restore()
	}

	async fetch(request: Request) {
		await this.bootstrap
		const url = new URL(request.url)

		if (request.method === "POST" && url.pathname === connectPath) {
			const payload = (await request.json()) as unknown
			const normalized = normalizeGatewayConfig(payload)
			if (!normalized) {
				return new Response("Bad Request", { status: 400 })
			}

			const hasChanged =
				!this.config ||
				JSON.stringify(this.config) !== JSON.stringify(normalized)
			this.config = normalized
			await this.state.storage.put(gatewayConfigStorageKey, normalized)
			if (hasChanged && this.gateway) {
				this.gateway.disconnect()
				this.gateway = null
			}

			await this.ensureConnected()
			await this.scheduleReconnectAlarm()
			return Response.json({ status: "connected" })
		}

		if (request.method === "POST" && url.pathname === disconnectPath) {
			this.gateway?.disconnect()
			this.gateway = null
			this.config = null
			await this.state.storage.delete(gatewayConfigStorageKey)
			await this.state.storage.deleteAlarm?.()
			return Response.json({ status: "disconnected" })
		}

		if (request.method === "GET" && url.pathname === statusPath) {
			return Response.json({
				configured: Boolean(this.config),
				connected: Boolean(this.gateway?.isConnected)
			})
		}

		return new Response("Not Found", { status: 404 })
	}

	async alarm() {
		await this.bootstrap
		if (!this.config) {
			return
		}
		await this.ensureConnected()
		await this.scheduleReconnectAlarm()
	}

	protected async restore() {
		const stored = await this.state.storage.get<unknown>(
			gatewayConfigStorageKey
		)
		const normalized = normalizeGatewayConfig(stored)
		if (!normalized) {
			this.config = null
			return
		}
		this.config = normalized
		if (JSON.stringify(stored) !== JSON.stringify(normalized)) {
			await this.state.storage.put(gatewayConfigStorageKey, normalized)
		}
		await this.ensureConnected()
		await this.scheduleReconnectAlarm()
	}

	protected async ensureConnected() {
		if (!this.config) {
			return
		}
		if (this.connecting) {
			await this.connecting
			return
		}
		if (this.gateway?.isConnected) {
			return
		}
		if (this.gateway) {
			this.gateway.connect(true)
			return
		}

		this.connecting = (async () => {
			if (!this.config) {
				return
			}

			const gateway = new GatewayPlugin({
				intents: this.config.gateway.intents,
				autoInteractions: this.config.gateway.autoInteractions,
				reconnect: this.config.gateway.reconnect
			})

			await gateway.registerClient(
				this.createClientBridge(this.config) as unknown as Client
			)
			this.gateway = gateway
		})()

		try {
			await this.connecting
		} finally {
			this.connecting = null
		}
	}

	protected async scheduleReconnectAlarm() {
		if (!this.config) {
			return
		}
		await this.state.storage.setAlarm(Date.now() + reconnectAlarmIntervalMs)
	}

	protected createClientBridge(config: CloudflareGatewayDurableObjectConfig) {
		return {
			options: {
				token: config.token,
				clientId: config.clientId
			},
			registerListener() {},
			eventHandler: {
				handleEvent: (
					data: CloudflareGatewayForwardPayload["data"],
					type: CloudflareGatewayForwardPayload["type"]
				) => {
					void this.forwardEvent(config, type, data)
					return true
				}
			}
		}
	}

	protected async forwardEvent(
		config: CloudflareGatewayDurableObjectConfig,
		type: CloudflareGatewayForwardPayload["type"],
		data: CloudflareGatewayForwardPayload["data"]
	) {
		try {
			const response = await fetch(`${config.baseUrl}${config.forwardPath}`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					[config.secretHeader]: config.deploySecret
				},
				body: JSON.stringify({
					type,
					data
				} satisfies CloudflareGatewayForwardPayload)
			})
			if (!response.ok) {
				console.error(
					`[CloudflareGatewayDurableObject] Failed to forward event ${String(type)}: ${response.status}`
				)
			}
		} catch (error) {
			console.error(
				`[CloudflareGatewayDurableObject] Failed to forward event ${String(type)}`,
				error
			)
		}
	}
}

function normalizeGatewayConfig(
	value: unknown
): CloudflareGatewayDurableObjectConfig | null {
	if (!value || typeof value !== "object") {
		return null
	}

	const payload = value as Record<string, unknown>
	const baseUrl =
		typeof payload.baseUrl === "string"
			? payload.baseUrl.replace(/\/+$/, "")
			: ""
	const deploySecret =
		typeof payload.deploySecret === "string" ? payload.deploySecret : ""
	const token = typeof payload.token === "string" ? payload.token : ""
	const clientId = typeof payload.clientId === "string" ? payload.clientId : ""
	if (!baseUrl || !deploySecret || !token || !clientId) {
		return null
	}

	const nestedGateway = payload.gateway as
		| {
				intents?: unknown
				autoInteractions?: unknown
				reconnect?: unknown
		  }
		| undefined
	const hasNestedGateway = nestedGateway && typeof nestedGateway === "object"
	const intents =
		hasNestedGateway && typeof nestedGateway.intents === "number"
			? nestedGateway.intents
			: typeof payload.intents === "number"
				? payload.intents
				: null
	if (intents === null) {
		return null
	}

	const autoInteractions = hasNestedGateway
		? typeof nestedGateway.autoInteractions === "boolean"
			? nestedGateway.autoInteractions
			: undefined
		: typeof payload.autoInteractions === "boolean"
			? payload.autoInteractions
			: undefined
	const reconnect = hasNestedGateway
		? nestedGateway.reconnect
		: payload.reconnect

	const forwardPath =
		typeof payload.forwardPath === "string" &&
		payload.forwardPath.startsWith("/")
			? (payload.forwardPath as `/${string}`)
			: defaultForwardPath
	const secretHeader =
		typeof payload.secretHeader === "string"
			? payload.secretHeader
			: defaultSecretHeader

	return {
		baseUrl,
		deploySecret,
		token,
		clientId,
		forwardPath,
		secretHeader,
		gateway: {
			intents,
			autoInteractions,
			reconnect:
				reconnect as CloudflareGatewayDurableObjectConfig["gateway"]["reconnect"]
		}
	}
}
