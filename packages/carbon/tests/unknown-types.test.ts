import {
	type APIChannel,
	type APIMessageComponentInteraction,
	ChannelType,
	ComponentType
} from "discord-api-types/v10"
import { describe, expect, test, vi } from "vitest"
import { CacheManager } from "../src/cache/CacheManager.js"
import { Client } from "../src/classes/Client.js"
import {
	ChannelCreateListener,
	ChannelDeleteListener,
	ChannelUpdateListener
} from "../src/classes/Listener.js"
import { channelFactory } from "../src/functions/channelFactory.js"
import { ComponentHandler } from "../src/internals/ComponentHandler.js"
import { LinkedRoles } from "../src/plugins/linked-roles/LinkedRoles.js"
import { ApplicationRoleConnectionMetadataType } from "../src/plugins/linked-roles/types.js"
import { Guild } from "../src/structures/Guild.js"
import { GuildTextChannel } from "../src/structures/GuildTextChannel.js"

vi.mock("../src/plugins/paginator/index.js", () => ({}))

const unknownChannel = {
	id: "unknown",
	type: 999,
	guild_id: "guild"
} as unknown as APIChannel
const knownChannel = {
	id: "known",
	type: ChannelType.GuildText,
	guild_id: "guild",
	name: "general"
} as APIChannel

function createClient() {
	return {
		cache: CacheManager.disabled(),
		rest: { get: vi.fn() },
		logger: { error: vi.fn(), warn: vi.fn() }
	} as unknown as Client
}

describe("unknown Discord types", () => {
	test("channel factories return undefined for unknown full and partial channels", () => {
		const client = createClient()
		expect(channelFactory(client, unknownChannel)).toBeUndefined()
		expect(channelFactory(client, unknownChannel, true)).toBeUndefined()
		expect(channelFactory(client, knownChannel)).toBeInstanceOf(
			GuildTextChannel
		)
		expect(channelFactory(client, knownChannel, true)?.partial).toBe(true)
	})

	test("all supported channel types still produce full and partial channels", () => {
		const client = createClient()
		for (const type of [
			ChannelType.DM,
			ChannelType.GroupDM,
			ChannelType.GuildText,
			ChannelType.GuildVoice,
			ChannelType.GuildCategory,
			ChannelType.GuildAnnouncement,
			ChannelType.AnnouncementThread,
			ChannelType.PublicThread,
			ChannelType.PrivateThread,
			ChannelType.GuildStageVoice,
			ChannelType.GuildForum,
			ChannelType.GuildMedia
		]) {
			const data = { ...knownChannel, type } as APIChannel
			expect(channelFactory(client, data)?.type).toBe(type)
			expect(channelFactory(client, data, true)?.type).toBe(type)
		}
	})

	test("guild channel lists skip unknown entries without losing supported channels", async () => {
		const client = createClient()
		vi.mocked(client.rest.get).mockResolvedValue([unknownChannel, knownChannel])
		const guild = new Guild<true>(client, "guild")
		const channels = await guild.fetchChannels()
		expect(channels.map((channel) => channel.id)).toEqual(["known"])
		vi.mocked(client.rest.get).mockResolvedValue([unknownChannel])
		expect(await guild.fetchChannels()).toEqual([])
	})

	test("single-channel fetches tolerate unknown types from REST and cache", async () => {
		const client = createClient()
		vi.mocked(client.rest.get).mockResolvedValue(unknownChannel)
		expect(
			await Client.prototype.fetchChannel.call(client, "unknown")
		).toBeUndefined()
		vi.spyOn(client.cache.channels, "get").mockResolvedValue(unknownChannel)
		vi.mocked(client.rest.get).mockClear()
		expect(
			await Client.prototype.fetchChannel.call(client, "unknown")
		).toBeUndefined()
		expect(client.rest.get).not.toHaveBeenCalled()
	})

	test("channel gateway listeners retain raw unknown data without throwing", () => {
		const client = createClient()
		for (const Listener of [
			ChannelCreateListener,
			ChannelDeleteListener,
			ChannelUpdateListener
		]) {
			const parsed = Listener.prototype.parseRawData.call(
				{} as never,
				unknownChannel as never,
				client
			)
			expect(parsed.channel).toBeUndefined()
			expect(parsed.rawChannel).toBe(unknownChannel)
		}
	})

	test("unknown component types are ignored while unregistered known components still report errors", async () => {
		const client = createClient()
		const handler = new ComponentHandler(client)
		const data = {
			data: { component_type: 999, custom_id: "unknown" },
			message: { id: "message", channel_id: "channel" }
		} as unknown as APIMessageComponentInteraction
		await handler.handleInteraction(data)
		expect(client.logger.error).not.toHaveBeenCalled()
		await expect(
			handler.handleInteraction({
				...data,
				data: {
					component_type: ComponentType.Button,
					custom_id: "unregistered"
				}
			} as APIMessageComponentInteraction)
		).rejects.toThrow("Unknown component")
	})

	test("unknown linked-role metadata is skipped before running checkers", async () => {
		const checker = vi.fn(async () => true)
		const plugin = new LinkedRoles({
			metadata: [
				{
					key: "future",
					name: "Future",
					description: "Future",
					type: 999 as ApplicationRoleConnectionMetadataType
				},
				{
					key: "known",
					name: "Known",
					description: "Known",
					type: ApplicationRoleConnectionMetadataType.BooleanEqual
				}
			],
			metadataCheckers: { known: checker }
		})
		expect(await plugin["getMetadataFromCheckers"]("user")).toEqual({
			known: true
		})
		expect(checker).toHaveBeenCalledOnce()
	})
})
