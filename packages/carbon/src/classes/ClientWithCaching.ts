import type { BaseCommand } from "../abstracts/BaseCommand.js"
import type { BaseListener } from "../abstracts/BaseListener.js"
import type { BaseMessageInteractiveComponent } from "../abstracts/BaseMessageInteractiveComponent.js"
import type { Plugin } from "../abstracts/Plugin.js"
import {
	Cache,
	type CacheOptions,
	type CacheTypes
} from "../internals/Cache.js"
import { Client, type ClientOptions } from "./Client.js"

export type ClientWithCachingOptions = ClientOptions &
	(
		| {
				/**
				 * Options for the cache
				 */
				caching?: Partial<CacheOptions>
		  }
		| {
				/**
				 * A custom cache instance to use
				 */
				customCache: Cache
		  }
	)

/**
 * A variant of the Client that has caching built in
 */
export class ClientWithCaching extends Client {
	cache: Cache

	constructor(
		options: ClientWithCachingOptions,
		handlers: {
			commands?: BaseCommand[]
			listeners?: BaseListener[]
			components?: BaseMessageInteractiveComponent[]
		},
		plugins: Plugin[] = []
	) {
		super(options, handlers, plugins)
		this.cache =
			"customCache" in options
				? options.customCache
				: new Cache(options.caching)
	}

	override isCaching(): this is ClientWithCaching {
		return true
	}

	override async fetchUser(
		id: string,
		bypassCache = false
	): ReturnType<typeof Client.prototype.fetchUser> {
		if (!bypassCache) {
			const user = await this.cache.get("user", id)
			if (user) return user
		}
		const user = await super.fetchUser(id)
		await this.cache.set("user", id, user)
		return user
	}

	override async fetchGuild(
		id: string,
		bypassCache = false
	): ReturnType<typeof Client.prototype.fetchGuild> {
		if (!bypassCache) {
			const guild = await this.cache.get("guild", id)
			if (guild) return guild
		}
		const guild = await super.fetchGuild(id)
		await this.cache.set("guild", id, guild)
		return guild
	}

	override async fetchChannel(
		id: string,
		bypassCache = false
	): ReturnType<typeof Client.prototype.fetchChannel> {
		if (!bypassCache) {
			const channel = await this.cache.get("channel", id)
			if (channel) return channel
		}
		const channel = await super.fetchChannel(id)
		await this.cache.set("channel", id, channel)
		return channel
	}

	override async fetchRole(
		guildId: string,
		id: string,
		bypassCache = false
	): ReturnType<typeof Client.prototype.fetchRole> {
		if (!bypassCache) {
			const role = await this.cache.get(
				"role",
				this.cache.createCompositeKey([guildId, id])
			)
			if (role) return role
		}
		const role = await super.fetchRole(guildId, id)
		await this.cache.set(
			"role",
			this.cache.createCompositeKey([guildId, id]),
			role
		)
		return role
	}

	override async fetchMember(
		guildId: string,
		id: string,
		bypassCache = false
	): ReturnType<typeof Client.prototype.fetchMember> {
		if (!bypassCache) {
			const member = await this.cache.get(
				"member",
				this.cache.createCompositeKey([guildId, id])
			)
			if (member) return member
		}
		const member = await super.fetchMember(guildId, id)
		await this.cache.set(
			"member",
			this.cache.createCompositeKey([guildId, id]),
			member
		)
		return member
	}

	override async fetchMessage(
		channelId: string,
		messageId: string,
		bypassCache = false
	): ReturnType<typeof Client.prototype.fetchMessage> {
		if (!bypassCache) {
			const message = await this.cache.get(
				"message",
				this.cache.createCompositeKey([channelId, messageId])
			)
			if (message) return message
		}
		const message = await super.fetchMessage(channelId, messageId)
		await this.cache.set(
			"message",
			this.cache.createCompositeKey([channelId, messageId]),
			message
		)
		return message
	}

	/**
	 * Purge the cache with optional filters
	 * @param options Options for purging the cache
	 */
	purgeCache(
		options: {
			type?: keyof CacheTypes
			before?: number
			after?: number
		} = {}
	) {
		this.cache.purgeCache(options)
	}

	/**
	 * Clear the entire cache or a specific type
	 * @param type Optional type to clear
	 */
	clearCache(type?: keyof CacheTypes) {
		this.cache.clearCache(type)
	}
}
