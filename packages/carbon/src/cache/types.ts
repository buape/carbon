import type {
	APIChannel,
	APIEmoji,
	APIGuild,
	APIGuildMember,
	APIGuildScheduledEvent,
	APIMessage,
	APIRole,
	APIUser
} from "discord-api-types/v10"

export const cacheTypes = [
	"users",
	"guilds",
	"channels",
	"roles",
	"members",
	"messages",
	"emojis",
	"scheduledEvents"
] as const

export type CacheType = (typeof cacheTypes)[number]

export type MaybePromise<T> = T | Promise<T>

export type CachePayloadMap = {
	users: APIUser
	guilds: APIGuild
	channels: APIChannel
	roles: APIRole
	members: APIGuildMember
	messages: APIMessage
	emojis: APIEmoji
	scheduledEvents: APIGuildScheduledEvent
}

export type CacheStore<T> = {
	get(key: string): MaybePromise<T | undefined | null>
	set(key: string, value: T, options?: CacheEntryOptions): MaybePromise<unknown>
	delete(key: string): MaybePromise<unknown>
	has?(key: string): MaybePromise<boolean>
	clear?(): MaybePromise<unknown>
}

export type CacheEntryOptions = {
	ttl?: number
}

export type CacheTypeOptions = {
	maxSize?: number
	ttl?: number
}

export type CacheStoreFactory = <T>(
	type: CacheType,
	options: Required<CacheTypeOptions>
) => CacheStore<T>

export type CacheManagerOptions = {
	enabled?: boolean
	default?: CacheTypeOptions
	types?: Partial<Record<CacheType, CacheTypeOptions | false>>
	store?: CacheStoreFactory
	stores?: Partial<{
		[TType in CacheType]: CacheStore<CachePayloadMap[TType]>
	}>
}
