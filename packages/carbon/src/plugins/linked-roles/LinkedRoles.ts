import { Plugin } from "../../abstracts/Plugin.js"
import {
	ApplicationRoleConnectionMetadataType,
	type LinkedRolesOptions
} from "./types.js"

type Tokens = {
	access_token: string
	token_type: string
	expires_in: number
	refresh_token: string
	scope: string
}

// TODO: IMO, the metadata for this should be handled similarly to the client and its commands
// That is passing an array of connection instances as the second argument to the constructor
// That is, maybe, for another pr though

/**
 * This class is the main class that is used for the linked roles feature of Carbon.
 * It handles all the additional routes and oauth.
 *
 * @example
 * ```ts
 * import { LinkedRoles } from "@buape/carbon/linked-roles"
 *
 * const allStaff = ["439223656200273932"]
 *
 * const linkedRoles = new LinkedRoles({
 *  clientId: "12345678901234567890",
 *  token: "MTA4NjEwNTYxMDUxMDE1NTg1Nw.GNt-U8.OSHy-g-5FlfESnu3Z9MEEMJLHiRthXajiXNwiE"
 * 	clientSecret: "Bb7aZcvRN-BhrhY2qrUO6QzOK4SeqonG",
 * 	baseUrl: "https://example.com",
 * 	metadata: [
 * 		{
 * 			key: "is_staff",
 * 			name: "Verified Staff",
 * 			description: "Whether the user is a verified staff member",
 * 			type: ApplicationRoleConnectionMetadataType.BooleanEqual
 * 		},
 * 	],
 * 	metadataCheckers: {
 * 		is_staff: async (userId) => {
 * 			if (allStaff.includes(userId)) return true
 * 			return false
 * 		}
 * 	}
 * })
 * ```
 */
export class LinkedRoles extends Plugin {
	options: Required<LinkedRolesOptions>

	constructor(options: LinkedRolesOptions) {
		super()

		this.options = { ...options }
		// TODO: This makes a request to Discord on every instance creation
		// This is not ideal, maybe this can have its own /deploy endpoint like the client commands deploy endpoint
		this.setMetadata(this.options.metadata)
		this.appendRoutes()
	}

	private appendRoutes() {
		this.routes.push({
			method: "GET",
			path: "/connect",
			handler: this.handleConnectRequest.bind(this)
		})
		this.routes.push({
			method: "GET",
			path: "/connect/callback",
			handler: this.handleConnectCallbackRequest.bind(this)
		})
	}

	public async handleConnectRequest() {
		return new Response(null, {
			status: 302,
			headers: {
				Location: `https://discord.com/oauth2/authorize?client_id=${this.options.clientId}&redirect_uri=${encodeURIComponent(`${this.options.baseUrl}/connect/callback`)}&response_type=code&scope=identify+role_connections.write&prompt=none`
			}
		})
	}

	public async handleConnectCallbackRequest(req: Request) {
		try {
			const url = new URL(req.url)
			const code = String(url.searchParams.get("code"))

			const tokens = await this.getOAuthTokens(code as string)
			const authData = await (
				await fetch("https://discord.com/api/v10/oauth2/@me", {
					headers: {
						Authorization: `Bearer ${tokens.access_token}`
					}
				})
			).json()
			if (!authData.user)
				return new Response("", {
					status: 307,
					headers: {
						Location: `${this.options.baseUrl}/connect`
					}
				})

			const newMetadata = await this.getMetadataFromCheckers(authData.user.id)

			await this.updateMetadata(authData.user?.id, newMetadata, tokens)

			return new Response("You can now close this tab.")
		} catch (e) {
			console.error(e)
			return new Response("Error", { status: 500 })
		}
	}

	private async getMetadataFromCheckers(userId: string) {
		const result: Record<string, unknown> = {}
		for (const metadata of this.options.metadata) {
			const checker = this.options.metadataCheckers[metadata.key]
			if (!checker)
				throw new Error(`You did not provide a checker for ${metadata.key}`)
			const value = await checker(userId)
			switch (metadata.type) {
				case ApplicationRoleConnectionMetadataType.BooleanEqual:
				case ApplicationRoleConnectionMetadataType.BooleanNotEqual:
					if (typeof value !== "boolean")
						throw new Error(`Expected boolean for ${metadata.key}`)
					break
				case ApplicationRoleConnectionMetadataType.DatetimeGreaterThanOrEqual:
				case ApplicationRoleConnectionMetadataType.DatetimeLessThanOrEqual:
					if (typeof value !== "number")
						throw new Error(`Expected number for ${metadata.key}`)
					break
				case ApplicationRoleConnectionMetadataType.IntegerEqual:
				case ApplicationRoleConnectionMetadataType.IntegerNotEqual:
				case ApplicationRoleConnectionMetadataType.IntegerGreaterThanOrEqual:
				case ApplicationRoleConnectionMetadataType.IntegerLessThanOrEqual:
					if (!(typeof value === "number" && Number.isSafeInteger(value)))
						throw new Error(`Expected integer for ${metadata.key}`)
					break
				default:
					throw new Error(`Unknown metadata type ${metadata.type}`)
			}
			result[metadata.key] = value
		}
		return result
	}

	private async getOAuthTokens(code: string) {
		const url = "https://discord.com/api/v10/oauth2/token"
		const body = new URLSearchParams({
			client_id: this.options.clientId,
			client_secret: this.options.clientSecret,
			grant_type: "authorization_code",
			code,
			redirect_uri: `${this.options.baseUrl}/connect/callback`
		})

		const response = await fetch(url, {
			body,
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		})
		if (response.ok) {
			const data = await response.json()
			return data
		}
		throw new Error(
			`Error fetching OAuth tokens: [${response.status}] ${JSON.stringify(
				await response.json()
			)}`
		)
	}

	private async updateMetadata(
		userId: string,
		metadata: Record<string, unknown>,
		tokens: Tokens
	) {
		const url = `https://discord.com/api/v10/users/@me/applications/${this.options.clientId}/role-connection`
		const response = await fetch(url, {
			method: "PUT",
			body: JSON.stringify({ metadata }),
			headers: {
				Authorization: `Bearer ${tokens.access_token}`,
				"Content-Type": "application/json"
			}
		})
		if (!response.ok) {
			throw new Error(
				`Error pushing discord metadata for ${userId}: [${
					response.status
				}] ${JSON.stringify(await response.json())}`
			)
		}
	}

	private async setMetadata(data: typeof this.options.metadata) {
		const response = await fetch(
			`https://discord.com/api/v10/applications/${this.options.clientId}/role-connections/metadata`,
			{
				method: "PUT",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bot ${this.options.token}`
				}
			}
		)
		if (!response.ok) {
			throw new Error(
				`Error pushing discord metadata: [${response.status}] ${JSON.stringify(
					await response.json()
				)}`
			)
		}
	}
}
