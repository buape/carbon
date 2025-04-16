import { createPrivateKey, sign } from "node:crypto"
import {
	type APIWebhookEvent,
	ApplicationWebhookType
} from "discord-api-types/v10"
import { concatUint8Arrays, valueToUint8Array } from "../../utils.js"
import { GatewayPlugin } from "../gateway/GatewayPlugin.js"
import type { GatewayPayload, GatewayPluginOptions } from "../gateway/types.js"
import type { ListenerEventType } from "../../types/index.js"

export interface GatewayForwarderPluginOptions extends GatewayPluginOptions {
	/**
	 * The URL to forward webhook events to.
	 * Typically this is your base URL in the client, and then `/events`
	 */
	webhookUrl: string
	/**
	 * The ed25519 private key in PEM format, used to sign forwarded events.
	 * This should include the BEGIN/END markers. When loading from an environment
	 * variable, the newlines can be escaped (\\n).
	 *
	 * For instructions on generating keys and setting up the forwarder,
	 * see the documentation at: https://carbon.buape.com/plugins/gateway-forwarder
	 */
	privateKey: string
}

export class GatewayForwarderPlugin extends GatewayPlugin {
	readonly id = "gateway-forwarder"

	protected config: GatewayForwarderPluginOptions
	private privateKey: ReturnType<typeof createPrivateKey>

	constructor(options: GatewayForwarderPluginOptions) {
		if (!options.privateKey) {
			throw new Error("privateKey is required for GatewayForwarderPlugin")
		}

		super(options)

		try {
			const keyString = options.privateKey.replace(/\\n/g, "\n")
			this.privateKey = createPrivateKey({
				key: keyString,
				format: "pem"
			})
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error)
			throw new Error(`Failed to parse private key: ${message}`)
		}
		this.config = options
	}

	protected override setupWebSocket(): void {
		super.setupWebSocket()

		if (!this.ws) return

		this.ws.on("message", async (data: Buffer) => {
			try {
				const payload = JSON.parse(data.toString()) as GatewayPayload

				if (payload.t && payload.d) {
					if (
						!this.config.eventFilter ||
						!this.config.eventFilter(payload.t as ListenerEventType)
					)
						return

					// In the below code, the events are not truly webhook events,
					// but we use the webhook event type so that the payloads are structured correctly to work as if they were webhook events
					const timestamp = Date.now()
					const webhookEvent: APIWebhookEvent = {
						version: 1,
						application_id: this.client?.options.clientId || "unknown",
						type: ApplicationWebhookType.Event,
						event: {
							type: payload.t,
							timestamp: new Date().toISOString(),
							data: payload.d
						} as APIWebhookEvent["event"]
					}

					const body = JSON.stringify(webhookEvent)

					const timestampData = valueToUint8Array(timestamp.toString())
					const bodyData = valueToUint8Array(body)
					const message = concatUint8Arrays(timestampData, bodyData)

					const signature = sign(null, message, this.privateKey)

					const signatureHex = signature.toString("hex")

					await fetch(this.config.webhookUrl, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-Signature-Ed25519": signatureHex,
							"X-Signature-Timestamp": timestamp.toString()
						},
						body
					})
				}
			} catch (error) {
				console.error("Error forwarding webhook event:", error)
			}
		})
	}
}
