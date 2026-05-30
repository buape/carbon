import type {
	ListenerEventRawData,
	ListenerEventType
} from "../types/listeners.js"
import { MemoryCacheStore } from "./MemoryCacheStore.js"
import {
	type CacheManagerOptions,
	type CachePayloadMap,
	type CacheStore,
	type CacheType,
	type CacheTypeOptions,
	cacheTypes
} from "./types.js"

const defaultTypeOptions = {
	maxSize: 10_000,
	ttl: 0
} satisfies Required<CacheTypeOptions>

export class CacheNamespace<T> {
	readonly enabled: boolean
	private readonly options: Required<CacheTypeOptions>
	private readonly store?: CacheStore<T>

	constructor(
		store: CacheStore<T> | undefined,
		options: Required<CacheTypeOptions>,
		enabled: boolean
	) {
		this.store = store
		this.options = options
		this.enabled = enabled
	}

	async get(key: string): Promise<T | undefined> {
		if (!this.enabled || !this.store) return undefined
		try {
			return (await this.store.get(key)) ?? undefined
		} catch (_) {
			return undefined
		}
	}

	async set(key: string, value: T): Promise<void> {
		if (!this.enabled || !this.store) return
		try {
			await this.store.set(key, value, { ttl: this.options.ttl })
		} catch (_) {}
	}

	async delete(key: string): Promise<void> {
		if (!this.enabled || !this.store) return
		try {
			await this.store.delete(key)
		} catch (_) {}
	}

	async has(key: string): Promise<boolean> {
		if (!this.enabled || !this.store) return false
		try {
			if (this.store.has) return await this.store.has(key)
			return (await this.store.get(key)) != null
		} catch (_) {
			return false
		}
	}

	async clear(): Promise<void> {
		if (!this.enabled || !this.store?.clear) return
		try {
			await this.store.clear()
		} catch (_) {}
	}
}

export class CacheManager {
	readonly enabled: boolean
	readonly users!: CacheNamespace<CachePayloadMap["users"]>
	readonly guilds!: CacheNamespace<CachePayloadMap["guilds"]>
	readonly channels!: CacheNamespace<CachePayloadMap["channels"]>
	readonly roles!: CacheNamespace<CachePayloadMap["roles"]>
	readonly members!: CacheNamespace<CachePayloadMap["members"]>
	readonly messages!: CacheNamespace<CachePayloadMap["messages"]>
	readonly emojis!: CacheNamespace<CachePayloadMap["emojis"]>
	readonly scheduledEvents!: CacheNamespace<CachePayloadMap["scheduledEvents"]>
	private readonly emojiIdsByGuild = new Map<string, Set<string>>()

	constructor(options: CacheManagerOptions = {}) {
		this.enabled = options.enabled ?? true

		for (const type of cacheTypes) {
			const typeOptions = this.resolveOptions(type, options)
			const enabled = this.enabled && options.types?.[type] !== false
			const store = enabled
				? this.resolveStore(type, typeOptions, options)
				: undefined
			Reflect.set(this, type, new CacheNamespace(store, typeOptions, enabled))
		}
	}

	static disabled() {
		return new CacheManager({ enabled: false })
	}

	async setEmoji(
		guildId: string,
		emoji: CachePayloadMap["emojis"]
	): Promise<void> {
		if (!emoji.id) return
		this.trackEmoji(guildId, emoji.id)
		await this.emojis.set(`${guildId}:${emoji.id}`, emoji)
	}

	async deleteEmoji(guildId: string, emojiId: string): Promise<void> {
		const emojiIds = this.emojiIdsByGuild.get(guildId)
		emojiIds?.delete(emojiId)
		if (emojiIds?.size === 0) this.emojiIdsByGuild.delete(guildId)
		await this.emojis.delete(`${guildId}:${emojiId}`)
	}

	handleGatewayEvent<T extends ListenerEventType>(
		type: T,
		data: ListenerEventRawData[T]
	): void {
		if (!this.enabled) return
		void this.applyGatewayEvent(type, data as Record<string, unknown>)
	}

	private async applyGatewayEvent(
		type: ListenerEventType,
		data: Record<string, unknown>
	) {
		switch (type) {
			case "CHANNEL_CREATE":
			case "CHANNEL_UPDATE":
			case "THREAD_CREATE":
			case "THREAD_UPDATE":
				await this.setById(this.channels, data)
				break
			case "CHANNEL_DELETE":
			case "THREAD_DELETE":
				await this.deleteById(this.channels, data)
				break
			case "GUILD_CREATE":
			case "GUILD_AVAILABLE":
			case "GUILD_UPDATE":
				await this.setById(this.guilds, data)
				break
			case "GUILD_DELETE":
			case "GUILD_UNAVAILABLE":
				await this.deleteById(this.guilds, data)
				break
			case "GUILD_MEMBER_ADD":
			case "GUILD_MEMBER_UPDATE":
				await this.setMember(data)
				break
			case "GUILD_MEMBER_REMOVE":
				await this.deleteMember(data)
				break
			case "GUILD_MEMBERS_CHUNK":
				await this.setMemberChunk(data)
				break
			case "GUILD_ROLE_CREATE":
			case "GUILD_ROLE_UPDATE":
				await this.setRole(data)
				break
			case "GUILD_ROLE_DELETE":
				await this.deleteRole(data)
				break
			case "GUILD_EMOJIS_UPDATE":
				await this.setEmojiList(data)
				break
			case "GUILD_SCHEDULED_EVENT_CREATE":
			case "GUILD_SCHEDULED_EVENT_UPDATE":
				await this.setScheduledEvent(data)
				break
			case "GUILD_SCHEDULED_EVENT_DELETE":
				await this.deleteScheduledEvent(data)
				break
			case "MESSAGE_CREATE":
				await this.setMessage(data)
				break
			case "MESSAGE_UPDATE":
				await this.updateMessage(data)
				break
			case "MESSAGE_DELETE":
				await this.deleteMessage(data)
				break
			case "MESSAGE_DELETE_BULK":
				await this.deleteMessageBulk(data)
				break
			case "USER_UPDATE":
				await this.setById(this.users, data)
				break
		}
	}

	private async setById<T>(
		namespace: CacheNamespace<T>,
		data: Record<string, unknown>
	) {
		if (typeof data.id === "string") await namespace.set(data.id, data as T)
	}

	private async deleteById<T>(
		namespace: CacheNamespace<T>,
		data: Record<string, unknown>
	) {
		if (typeof data.id === "string") await namespace.delete(data.id)
	}

	private async setMember(data: Record<string, unknown>) {
		const user = data.user as CachePayloadMap["users"] | undefined
		if (!user || typeof data.guild_id !== "string") return
		await this.users.set(user.id, user)
		await this.members.set(
			`${data.guild_id}:${user.id}`,
			data as unknown as CachePayloadMap["members"]
		)
	}

	private async deleteMember(data: Record<string, unknown>) {
		const user = data.user as CachePayloadMap["users"] | undefined
		if (!user || typeof data.guild_id !== "string") return
		await this.users.set(user.id, user)
		await this.members.delete(`${data.guild_id}:${user.id}`)
	}

	private async setMemberChunk(data: Record<string, unknown>) {
		const members = data.members as CachePayloadMap["members"][] | undefined
		if (!members || typeof data.guild_id !== "string") return
		await Promise.all(
			members.map(async (member) => {
				await this.users.set(member.user.id, member.user)
				await this.members.set(`${data.guild_id}:${member.user.id}`, member)
			})
		)
	}

	private async setRole(data: Record<string, unknown>) {
		const role = data.role as CachePayloadMap["roles"] | undefined
		if (!role || typeof data.guild_id !== "string") return
		await this.roles.set(`${data.guild_id}:${role.id}`, role)
	}

	private async deleteRole(data: Record<string, unknown>) {
		if (typeof data.guild_id !== "string" || typeof data.role_id !== "string")
			return
		await this.roles.delete(`${data.guild_id}:${data.role_id}`)
	}

	private async setEmojiList(data: Record<string, unknown>) {
		const emojis = data.emojis as CachePayloadMap["emojis"][] | undefined
		const guildId = data.guild_id
		if (!emojis || typeof guildId !== "string") return

		const nextIds = new Set(
			emojis.flatMap((emoji) => (emoji.id ? [emoji.id] : []))
		)
		const staleDeletes = [...(this.emojiIdsByGuild.get(guildId) ?? [])]
			.filter((emojiId) => !nextIds.has(emojiId))
			.map((emojiId) => this.emojis.delete(`${guildId}:${emojiId}`))

		this.emojiIdsByGuild.set(guildId, nextIds)
		await Promise.all([
			...staleDeletes,
			...emojis.map((emoji) =>
				emoji.id ? this.emojis.set(`${guildId}:${emoji.id}`, emoji) : undefined
			)
		])
	}

	private trackEmoji(guildId: string, emojiId: string) {
		const emojiIds = this.emojiIdsByGuild.get(guildId) ?? new Set<string>()
		emojiIds.add(emojiId)
		this.emojiIdsByGuild.set(guildId, emojiIds)
	}

	private async setScheduledEvent(data: Record<string, unknown>) {
		if (typeof data.guild_id !== "string" || typeof data.id !== "string") return
		await this.scheduledEvents.set(
			`${data.guild_id}:${data.id}`,
			data as unknown as CachePayloadMap["scheduledEvents"]
		)
	}

	private async deleteScheduledEvent(data: Record<string, unknown>) {
		if (typeof data.guild_id !== "string" || typeof data.id !== "string") return
		await this.scheduledEvents.delete(`${data.guild_id}:${data.id}`)
	}

	private async setMessage(data: Record<string, unknown>) {
		if (typeof data.channel_id !== "string" || typeof data.id !== "string")
			return
		await this.messages.set(
			`${data.channel_id}:${data.id}`,
			data as unknown as CachePayloadMap["messages"]
		)
		const author = data.author as CachePayloadMap["users"] | undefined
		if (author) await this.users.set(author.id, author)
	}

	private async updateMessage(data: Record<string, unknown>) {
		if (typeof data.channel_id !== "string" || typeof data.id !== "string")
			return
		const key = `${data.channel_id}:${data.id}`
		const existing = await this.messages.get(key)
		if (!existing) return
		await this.messages.set(key, {
			...existing,
			...data
		})
		const author = data.author as CachePayloadMap["users"] | undefined
		if (author) await this.users.set(author.id, author)
	}

	private async deleteMessage(data: Record<string, unknown>) {
		if (typeof data.channel_id !== "string" || typeof data.id !== "string")
			return
		await this.messages.delete(`${data.channel_id}:${data.id}`)
	}

	private async deleteMessageBulk(data: Record<string, unknown>) {
		const ids = data.ids as string[] | undefined
		if (!ids || typeof data.channel_id !== "string") return
		await Promise.all(
			ids.map((id) => this.messages.delete(`${data.channel_id}:${id}`))
		)
	}

	private resolveOptions(type: CacheType, options: CacheManagerOptions) {
		const typeOptions = options.types?.[type]
		return {
			...defaultTypeOptions,
			...options.default,
			...(typeOptions === false ? {} : typeOptions)
		}
	}

	private resolveStore<T>(
		type: CacheType,
		typeOptions: Required<CacheTypeOptions>,
		options: CacheManagerOptions
	) {
		const configuredStore = options.stores?.[type]
		if (configuredStore) return configuredStore as CacheStore<T>
		if (options.store) return options.store<T>(type, typeOptions)
		return new MemoryCacheStore<T>(typeOptions)
	}
}
