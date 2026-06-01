import {
	type APIChannel,
	type APIMessage,
	type APIUser,
	ChannelType,
	MessageType,
	type RESTPostAPIInteractionCallbackJSONBody,
	Routes
} from "@buape/carbon"
import { createSnowflakeGenerator, generateSnowflake } from "./snowflake.js"
import type {
	DiscordCall,
	RouteMatcher,
	RouteReply,
	TestChannel,
	TestGuild,
	TestMember,
	TestRole,
	TestUser
} from "./types.js"

const json = (body: unknown, status = 200, headers?: Record<string, string>) =>
	new Response(body === undefined ? null : JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json", ...headers }
	})

const now = () => new Date().toISOString()
const testApplicationId = generateSnowflake({ increment: 1 })
const testBotId = generateSnowflake({ increment: 2 })
const testOwnerId = generateSnowflake({ increment: 3 })
const testGuildId = generateSnowflake({ increment: 4 })
const testInteractionChannelId = generateSnowflake({ increment: 5 })
export class FakeDiscordRoute {
	private nextReply: RouteReply | undefined
	constructor(
		readonly method: string,
		readonly matcher: RouteMatcher
	) {}

	reply(status: number, body?: unknown, headers?: Record<string, string>) {
		this.nextReply = { status, body, headers }
		return this
	}

	rateLimit(retryAfter = 1) {
		return this.reply(
			429,
			{
				message: "You are being rate limited.",
				retry_after: retryAfter,
				global: false
			},
			{ "Retry-After": String(retryAfter) }
		)
	}

	matches(call: DiscordCall) {
		if (call.method !== this.method) return false
		if (typeof this.matcher === "string") return call.path === this.matcher
		if (this.matcher instanceof RegExp) return this.matcher.test(call.path)
		return this.matcher(call)
	}

	consume() {
		return this.nextReply
	}
}

export class FakeDiscord {
	readonly calls: DiscordCall[] = []
	readonly users = new Map<string, APIUser>()
	readonly guilds = new Map<string, unknown>()
	readonly channels = new Map<string, APIChannel>()
	readonly roles = new Map<string, unknown>()
	readonly members = new Map<string, unknown>()
	readonly messages = new Map<string, APIMessage>()
	readonly interactionMessages = new Map<string, APIMessage>()
	private readonly routes: FakeDiscordRoute[] = []
	private generateId = createSnowflakeGenerator({ processId: 1 })

	constructor(readonly strict = true) {
		this.users.set(
			testBotId,
			this.makeUser({ id: testBotId, username: "Carbon" })
		)
	}

	reset() {
		this.calls.length = 0
		this.routes.length = 0
		this.messages.clear()
		this.interactionMessages.clear()
		this.generateId = createSnowflakeGenerator({ processId: 1 })
	}

	route(method: string, matcher: RouteMatcher) {
		const route = new FakeDiscordRoute(method.toUpperCase(), matcher)
		this.routes.push(route)
		return route
	}

	expect(method: string, matcher: RouteMatcher) {
		return this.route(method, matcher)
	}

	seed(data: {
		users?: TestUser[]
		guilds?: TestGuild[]
		channels?: TestChannel[]
		roles?: (TestRole & { guild_id?: string })[]
		members?: (TestMember & { guild_id: string })[]
		messages?: APIMessage[]
	}) {
		for (const user of data.users ?? []) this.addUser(user)
		for (const guild of data.guilds ?? []) this.addGuild(guild)
		for (const channel of data.channels ?? []) this.addChannel(channel)
		for (const role of data.roles ?? [])
			this.addRole(role.guild_id ?? testGuildId, role)
		for (const member of data.members ?? [])
			this.addMember(member.guild_id, member)
		for (const message of data.messages ?? []) this.addMessage(message)
	}

	addUser(user: TestUser) {
		const apiUser = this.makeUser(user)
		this.users.set(apiUser.id, apiUser)
		return apiUser
	}

	addGuild(guild: TestGuild) {
		const data = {
			id: guild.id,
			name: guild.name ?? `Guild ${guild.id}`,
			icon: guild.icon ?? null,
			features: [],
			owner_id: testOwnerId,
			afk_timeout: 300,
			verification_level: 0,
			default_message_notifications: 0,
			explicit_content_filter: 0,
			roles: [],
			emojis: [],
			mfa_level: 0,
			premium_tier: 0,
			premium_subscription_count: 0,
			preferred_locale: "en-US",
			nsfw_level: 0,
			stickers: []
		}
		this.guilds.set(guild.id, data)
		return data
	}

	addChannel(channel: TestChannel) {
		const data = {
			id: channel.id,
			type: channel.type ?? ChannelType.GuildText,
			guild_id: channel.guild_id,
			name: channel.name ?? `channel-${channel.id}`
		} as APIChannel
		this.channels.set(channel.id, data)
		return data
	}

	addRole(guildId: string, role: TestRole) {
		const data = {
			id: role.id,
			name: role.name ?? `role-${role.id}`,
			color: role.color ?? 0,
			hoist: false,
			position: role.position ?? 0,
			permissions: role.permissions ?? "0",
			managed: role.managed ?? false,
			mentionable: role.mentionable ?? false
		}
		this.roles.set(`${guildId}:${role.id}`, data)
		return data
	}

	addMember(guildId: string, member: TestMember) {
		const user = this.addUser(member.user)
		const data = {
			user,
			roles: member.roles ?? [],
			nick: member.nick ?? null,
			joined_at: member.joined_at ?? now(),
			deaf: false,
			mute: false
		}
		this.members.set(`${guildId}:${user.id}`, data)
		return data
	}

	addMessage(message: APIMessage) {
		this.messages.set(`${message.channel_id}:${message.id}`, message)
		return message
	}

	latestMessage() {
		return [...this.messages.values()].at(-1)
	}

	fetch = async (input: string | URL | Request, init?: RequestInit) => {
		const request = input instanceof Request ? input : new Request(input, init)
		const url = new URL(request.url)
		const path = this.normalizePath(url.pathname)
		const call: DiscordCall = {
			method: request.method.toUpperCase(),
			path,
			url: request.url,
			query: url.searchParams,
			body: await this.parseBody(request),
			headers: request.headers
		}
		this.calls.push(call)

		const route = this.routes.find((candidate) => candidate.matches(call))
		const reply = route?.consume()
		if (reply) return json(reply.body, reply.status, reply.headers)

		const handled = this.handleStateful(call)
		if (handled) return handled
		if (!this.strict) return json(null, 204)
		return json(
			{ message: `Unhandled Discord request: ${call.method} ${path}`, code: 0 },
			500
		)
	}

	private handleStateful(call: DiscordCall): Response | undefined {
		const { method, path, body } = call
		if (method === "GET" && path.startsWith("/users/")) {
			return this.found(this.users.get(path.split("/")[2] ?? ""))
		}
		if (method === "POST" && path === "/users/@me/channels") {
			const recipientId = this.asRecord(body).recipient_id as string | undefined
			const channel = this.addChannel({
				id: this.id(),
				type: ChannelType.DM,
				name: recipientId ? `dm-${recipientId}` : "dm"
			})
			return json(channel)
		}
		if (
			method === "GET" &&
			path.startsWith("/guilds/") &&
			!path.includes("/members")
		) {
			return this.found(this.guilds.get(path.split("/")[2] ?? ""))
		}
		if (
			method === "GET" &&
			path.startsWith("/channels/") &&
			!path.includes("/messages")
		) {
			return this.found(this.channels.get(path.split("/")[2] ?? ""))
		}
		if (
			method === "PATCH" &&
			path.startsWith("/channels/") &&
			!path.includes("/messages")
		) {
			const id = path.split("/")[2] ?? ""
			const channel = {
				...(this.channels.get(id) as object),
				...this.asRecord(body)
			} as unknown as APIChannel
			this.channels.set(id, channel)
			return json(channel)
		}
		const roleMatch = path.match(/^\/guilds\/([^/]+)\/roles(?:\/([^/]+))?$/)
		if (roleMatch && method === "GET") {
			if (roleMatch[2])
				return this.found(this.roles.get(`${roleMatch[1]}:${roleMatch[2]}`))
			return json(
				[...this.roles.entries()]
					.filter(([key]) => key.startsWith(`${roleMatch[1]}:`))
					.map(([, role]) => role)
			)
		}
		if (roleMatch && (method === "POST" || method === "PATCH")) {
			const role = { id: roleMatch[2] ?? this.id(), ...this.asRecord(body) }
			this.roles.set(`${roleMatch[1]}:${role.id}`, role)
			return json(role)
		}
		if (roleMatch && method === "DELETE") return json(null, 204)
		const memberMatch = path.match(/^\/guilds\/([^/]+)\/members\/([^/]+)$/)
		if (memberMatch && method === "GET")
			return this.found(this.members.get(`${memberMatch[1]}:${memberMatch[2]}`))
		const messageMatch = path.match(
			/^\/channels\/([^/]+)\/messages(?:\/([^/]+))?$/
		)
		if (messageMatch)
			return this.handleMessage(call, messageMatch[1] ?? "", messageMatch[2])
		const callbackMatch = path.match(
			/^\/interactions\/([^/]+)\/([^/]+)\/callback$/
		)
		if (callbackMatch && method === "POST")
			return this.handleInteractionCallback(
				call,
				callbackMatch[1] ?? "",
				callbackMatch[2] ?? ""
			)
		const webhookMessageMatch = path.match(
			/^\/webhooks\/([^/]+)\/([^/]+)\/messages\/@original$/
		)
		if (webhookMessageMatch && method === "PATCH") {
			const message = this.makeMessage(
				testInteractionChannelId,
				body,
				webhookMessageMatch[2]
			)
			this.interactionMessages.set(webhookMessageMatch[2] ?? "", message)
			return json(message)
		}
		const webhookMatch = path.match(/^\/webhooks\/([^/]+)\/([^/]+)$/)
		if (webhookMatch && method === "POST")
			return json(
				this.makeMessage(testInteractionChannelId, body, webhookMatch[2])
			)
		if (path.match(/^\/applications\/[^/]+(?:\/guilds\/[^/]+)?\/commands$/)) {
			if (method === "GET") return json([])
			if (method === "PUT" || method === "POST")
				return json(
					(Array.isArray(body) ? body : [body]).map((command) => ({
						id: this.id(),
						application_id: testApplicationId,
						...(command as object)
					}))
				)
		}
		if (
			path.match(/^\/applications\/[^/]+\/commands\/[^/]+$/) &&
			["PATCH", "DELETE"].includes(method)
		) {
			return method === "DELETE"
				? json(null, 204)
				: json({ id: path.split("/").at(-1), ...this.asRecord(body) })
		}
		return undefined
	}

	private handleMessage(
		call: DiscordCall,
		channelId: string,
		messageId?: string
	) {
		if (call.method === "GET" && messageId)
			return this.found(this.messages.get(`${channelId}:${messageId}`))
		if (call.method === "POST")
			return json(this.makeMessage(channelId, call.body))
		if (call.method === "PATCH" && messageId)
			return json(this.makeMessage(channelId, call.body, undefined, messageId))
		if (call.method === "DELETE") return json(null, 204)
		return undefined
	}

	private handleInteractionCallback(
		call: DiscordCall,
		interactionId: string,
		token: string
	) {
		const body = call.body as RESTPostAPIInteractionCallbackJSONBody
		if (body.type === 4 || body.type === 7) {
			const message = this.makeMessage(
				testInteractionChannelId,
				"data" in body ? body.data : undefined,
				token
			)
			this.interactionMessages.set(token, message)
			if (call.query.get("with_response") === "true")
				return json({ type: body.type, resource: { message } })
		}
		return json({ id: interactionId, type: body.type ?? 0 })
	}

	private makeUser(user: TestUser): APIUser {
		return {
			id: user.id,
			username: user.username ?? `user-${user.id}`,
			discriminator: user.discriminator ?? "0000",
			global_name: user.global_name ?? null,
			avatar: user.avatar ?? null,
			bot: user.bot
		}
	}

	private makeMessage(
		channelId: string,
		payload: unknown,
		token?: string,
		id = this.id()
	): APIMessage {
		const data = this.asRecord(payload)
		const message = {
			id,
			channel_id: channelId,
			author:
				this.users.get(testBotId) ??
				this.makeUser({ id: testBotId, username: "Carbon" }),
			content: typeof data.content === "string" ? data.content : "",
			timestamp: now(),
			edited_timestamp: null,
			tts: Boolean(data.tts),
			mention_everyone: false,
			mentions: [],
			mention_roles: [],
			attachments: [],
			embeds: Array.isArray(data.embeds) ? data.embeds : [],
			pinned: false,
			type: MessageType.Default,
			flags: data.flags,
			components: data.components
		} as APIMessage
		this.messages.set(`${channelId}:${message.id}`, message)
		if (token) this.interactionMessages.set(token, message)
		return message
	}

	private found(value: unknown) {
		return value
			? json(value)
			: json({ message: "Unknown resource", code: 10000 }, 404)
	}

	private async parseBody(request: Request) {
		const text = await request.text().catch(() => "")
		if (!text) return undefined
		try {
			return JSON.parse(text)
		} catch {
			return text
		}
	}

	private normalizePath(path: string) {
		return path.replace(/^\/api(?:\/v\d+)?/, "") || "/"
	}

	private asRecord(value: unknown) {
		return value && typeof value === "object"
			? (value as Record<string, unknown>)
			: {}
	}

	private id() {
		return this.generateId()
	}
}

export const createFakeDiscord = (strict = true) => new FakeDiscord(strict)
export { Routes }
