import type { ClientOptions } from "../../classes/Client.js"
import type {
	ListenerEventRawData,
	ListenerEventType
} from "../../types/listeners.js"
import type { GatewayPluginOptions } from "../gateway/types.js"

export type CloudflareGatewayForwardPayload = {
	type: ListenerEventType
	data: ListenerEventRawData[ListenerEventType]
}

export type CloudflareGatewayDurableObjectConfig = Omit<
	Pick<ClientOptions, "baseUrl" | "deploySecret" | "token" | "clientId">,
	"deploySecret"
> & {
	deploySecret: string
	forwardPath: `/${string}`
	secretHeader: string
	gateway: {
		intents: number
		autoInteractions?: boolean
		reconnect?: GatewayPluginOptions["reconnect"]
	}
}

export interface CloudflareGatewayPluginOptions {
	/**
	 * Gateway intents passed to the internal GatewayPlugin running in the Durable Object.
	 */
	intents: number
	/**
	 * Gateway reconnect strategy passed through to GatewayPlugin.
	 */
	reconnect?: GatewayPluginOptions["reconnect"]
	/**
	 * Whether autoInteractions should be enabled in the Durable Object GatewayPlugin.
	 * @default false
	 */
	autoInteractions?: boolean
	/**
	 * Route on your Worker that receives forwarded events from the Durable Object.
	 * @default "/__carbon/gateway-events"
	 */
	forwardPath?: `/${string}`
	/**
	 * Header used to authenticate forwarded events.
	 * @default "x-carbon-gateway-secret"
	 */
	secretHeader?: string
	/**
	 * Durable Object binding name in Wrangler.
	 * @default "CARBON_GATEWAY"
	 */
	durableObjectBinding?: string
	/**
	 * Durable Object instance name.
	 * @default "default"
	 */
	durableObjectName?: string
	/**
	 * Connect endpoint implemented by the Durable Object.
	 * @default "/connect"
	 */
	connectPath?: `/${string}`
	/**
	 * Minimum time between automatic connect calls.
	 * @default 10000
	 */
	connectDebounceMs?: number
}
