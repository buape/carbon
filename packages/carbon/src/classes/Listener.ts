import {
	type APIChannel,
	type APIGuildMember,
	ChannelType,
	type ThreadChannelType
} from "discord-api-types/v10"
import { BaseListener } from "../abstracts/BaseListener.js"
import { channelFactory } from "../functions/channelFactory.js"
import { Guild } from "../structures/Guild.js"
import { GuildMember } from "../structures/GuildMember.js"
import { GuildThreadChannel } from "../structures/GuildThreadChannel.js"
import { Message } from "../structures/Message.js"
import { Role } from "../structures/Role.js"
import { ThreadMember } from "../structures/ThreadMember.js"
import { User } from "../structures/User.js"
import {
	ListenerEvent,
	type ListenerEventData,
	type ListenerEventRawData
} from "../types/index.js"
import type { Client } from "./Client.js"

export abstract class GuildAvailableListener extends BaseListener<
	typeof ListenerEvent.GuildAvailable
> {
	readonly type = ListenerEvent.GuildAvailable
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild(client, data)
		return {
			guild,
			...data
		}
	}
}

export abstract class GuildUnavailableListener extends BaseListener<
	typeof ListenerEvent.GuildUnavailable
> {
	readonly type = ListenerEvent.GuildUnavailable
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.id)
		return {
			guild,
			...data
		}
	}
}

export abstract class ApplicationAuthorizedListener extends BaseListener<
	typeof ListenerEvent.ApplicationAuthorized
> {
	readonly type = ListenerEvent.ApplicationAuthorized
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild ? new Guild(client, data.guild) : undefined
		const user = new User(client, data.user)
		const { guild: _, user: __, ...restData } = data
		return {
			guild,
			user,
			rawGuild: data.guild,
			rawUser: data.user,
			...restData
		}
	}
}

export abstract class EntitlementCreateListener extends BaseListener<
	typeof ListenerEvent.EntitlementCreate
> {
	readonly type = ListenerEvent.EntitlementCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const user = data.user_id ? new User<true>(client, data.user_id) : undefined
		return {
			guild,
			user,
			...data
		}
	}
}

export abstract class QuestUserEnrollmentListener extends BaseListener<
	typeof ListenerEvent.QuestUserEnrollment
> {
	readonly type = ListenerEvent.QuestUserEnrollment
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]]
	): ListenerEventData[this["type"]] {
		return data
	}
}

export abstract class ApplicationCommandPermissionsUpdateListener extends BaseListener<
	typeof ListenerEvent.ApplicationCommandPermissionsUpdate
> {
	readonly type = ListenerEvent.ApplicationCommandPermissionsUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class AutoModerationActionExecutionListener extends BaseListener<
	typeof ListenerEvent.AutoModerationActionExecution
> {
	readonly type = ListenerEvent.AutoModerationActionExecution
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const user = new User<true>(client, data.user_id)
		const message = data.message_id
			? new Message<true>(client, {
					id: data.message_id,
					channelId: data.channel_id
				})
			: undefined
		return {
			guild,
			user,
			message,
			...data
		}
	}
}

export abstract class AutoModerationRuleCreateListener extends BaseListener<
	typeof ListenerEvent.AutoModerationRuleCreate
> {
	readonly type = ListenerEvent.AutoModerationRuleCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const creator = new User<true>(client, data.creator_id)
		return { guild, creator, ...data }
	}
}

export abstract class AutoModerationRuleDeleteListener extends BaseListener<
	typeof ListenerEvent.AutoModerationRuleDelete
> {
	readonly type = ListenerEvent.AutoModerationRuleDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const creator = new User<true>(client, data.creator_id)
		return { guild, creator, ...data }
	}
}

export abstract class AutoModerationRuleUpdateListener extends BaseListener<
	typeof ListenerEvent.AutoModerationRuleUpdate
> {
	readonly type = ListenerEvent.AutoModerationRuleUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const creator = new User<true>(client, data.creator_id)
		return { guild, creator, ...data }
	}
}

export abstract class ChannelCreateListener extends BaseListener<
	typeof ListenerEvent.ChannelCreate
> {
	readonly type = ListenerEvent.ChannelCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const rawChannel = data
		// biome-ignore lint/style/noNonNullAssertion: channelFactory will always return a channel
		const channel = channelFactory(client, rawChannel)!
		return {
			channel,
			rawChannel,
			...data
		}
	}
}

export abstract class ChannelDeleteListener extends BaseListener<
	typeof ListenerEvent.ChannelDelete
> {
	readonly type = ListenerEvent.ChannelDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const rawChannel = data
		// biome-ignore lint/style/noNonNullAssertion: channelFactory will always return a channel
		const channel = channelFactory(client, rawChannel)!
		return {
			channel,
			rawChannel,
			...data
		}
	}
}

export abstract class ChannelPinsUpdateListener extends BaseListener<
	typeof ListenerEvent.ChannelPinsUpdate
> {
	readonly type = ListenerEvent.ChannelPinsUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const channel = channelFactory(client, {
			id: data.channel_id,
			type: ChannelType.GuildText
		} as APIChannel)
		return {
			guild,
			channel,
			...data
		}
	}
}

export abstract class ChannelUpdateListener extends BaseListener<
	typeof ListenerEvent.ChannelUpdate
> {
	readonly type = ListenerEvent.ChannelUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const rawChannel = data
		// biome-ignore lint/style/noNonNullAssertion: channelFactory will always return a channel
		const channel = channelFactory(client, rawChannel)!
		return {
			rawChannel,
			channel,
			...data
		}
	}
}

export abstract class EntitlementDeleteListener extends BaseListener<
	typeof ListenerEvent.EntitlementDelete
> {
	readonly type = ListenerEvent.EntitlementDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const user = data.user_id ? new User<true>(client, data.user_id) : undefined
		return {
			guild,
			user,
			...data
		}
	}
}

export abstract class EntitlementUpdateListener extends BaseListener<
	typeof ListenerEvent.EntitlementUpdate
> {
	readonly type = ListenerEvent.EntitlementUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const user = data.user_id ? new User<true>(client, data.user_id) : undefined
		return {
			guild,
			user,
			...data
		}
	}
}

export abstract class GuildAuditLogEntryCreateListener extends BaseListener<
	typeof ListenerEvent.GuildAuditLogEntryCreate
> {
	readonly type = ListenerEvent.GuildAuditLogEntryCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const user = new User<true>(client, data.user_id || "")
		const target = data.target_id
			? new User<true>(client, data.target_id)
			: undefined
		return {
			guild,
			user,
			target,
			...data
		}
	}
}

export abstract class GuildBanAddListener extends BaseListener<
	typeof ListenerEvent.GuildBanAdd
> {
	readonly type = ListenerEvent.GuildBanAdd
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const user = new User(client, data.user)
		return {
			...data,
			guild,
			rawUser: data.user,
			user
		}
	}
}

export abstract class GuildBanRemoveListener extends BaseListener<
	typeof ListenerEvent.GuildBanRemove
> {
	readonly type = ListenerEvent.GuildBanRemove
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const user = new User(client, data.user)
		return {
			...data,
			user,
			guild,
			rawUser: data.user
		}
	}
}

export abstract class GuildCreateListener extends BaseListener<
	typeof ListenerEvent.GuildCreate
> {
	readonly type = ListenerEvent.GuildCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild(client, data)
		return {
			guild,
			...data
		}
	}
}

export abstract class GuildDeleteListener extends BaseListener<
	typeof ListenerEvent.GuildDelete
> {
	readonly type = ListenerEvent.GuildDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.id)
		return {
			guild,
			...data
		}
	}
}

export abstract class GuildEmojisUpdateListener extends BaseListener<
	typeof ListenerEvent.GuildEmojisUpdate
> {
	readonly type = ListenerEvent.GuildEmojisUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class GuildIntegrationsUpdateListener extends BaseListener<
	typeof ListenerEvent.GuildIntegrationsUpdate
> {
	readonly type = ListenerEvent.GuildIntegrationsUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class GuildMemberAddListener extends BaseListener<
	typeof ListenerEvent.GuildMemberAdd
> {
	readonly type = ListenerEvent.GuildMemberAdd
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const member = new GuildMember<false, true>(client, data, guild)
		return {
			guild,
			member,
			...data
		}
	}
}

export abstract class GuildMemberRemoveListener extends BaseListener<
	typeof ListenerEvent.GuildMemberRemove
> {
	readonly type = ListenerEvent.GuildMemberRemove
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const user = new User(client, data.user)
		return {
			...data,
			guild,
			user,
			rawUser: data.user
		}
	}
}

export abstract class GuildMemberUpdateListener extends BaseListener<
	typeof ListenerEvent.GuildMemberUpdate
> {
	readonly type = ListenerEvent.GuildMemberUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const memberData = {
			...data,
			joined_at: data.joined_at ?? new Date().toISOString(),
			deaf: false,
			mute: false,
			flags: data.flags ?? 0,
			user: {
				...data.user,
				global_name: data.user.global_name ?? null
			}
		}
		const member = new GuildMember<false, true>(client, memberData, guild)
		return {
			guild,
			member,
			rawMember: data,
			...data
		}
	}
}

export abstract class GuildMembersChunkListener extends BaseListener<
	typeof ListenerEvent.GuildMembersChunk
> {
	readonly type = ListenerEvent.GuildMembersChunk
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const guildMembers = data.members.map((member: APIGuildMember) => {
			return new GuildMember<false, true>(client, member, guild)
		})
		return {
			...data,
			guild,
			rawMembers: data.members,
			members: guildMembers
		}
	}
}

export abstract class GuildRoleCreateListener extends BaseListener<
	typeof ListenerEvent.GuildRoleCreate
> {
	readonly type = ListenerEvent.GuildRoleCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const role = new Role(client, data.role, data.guild_id)
		return {
			...data,
			guild,
			rawRole: data.role,
			role
		}
	}
}

export abstract class GuildRoleDeleteListener extends BaseListener<
	typeof ListenerEvent.GuildRoleDelete
> {
	readonly type = ListenerEvent.GuildRoleDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const role = new Role<true>(client, data.role_id, data.guild_id)
		return {
			...data,
			guild,
			role
		}
	}
}

export abstract class GuildRoleUpdateListener extends BaseListener<
	typeof ListenerEvent.GuildRoleUpdate
> {
	readonly type = ListenerEvent.GuildRoleUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const role = new Role(client, data.role, data.guild_id)
		return {
			...data,
			guild,
			rawRole: data.role,
			role
		}
	}
}

export abstract class GuildScheduledEventCreateListener extends BaseListener<
	typeof ListenerEvent.GuildScheduledEventCreate
> {
	readonly type = ListenerEvent.GuildScheduledEventCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const creator = data.creator ? new User(client, data.creator) : undefined
		return {
			...data,
			guild,
			rawCreator: data.creator,
			creator
		}
	}
}

export abstract class GuildScheduledEventDeleteListener extends BaseListener<
	typeof ListenerEvent.GuildScheduledEventDelete
> {
	readonly type = ListenerEvent.GuildScheduledEventDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		} as ListenerEventData[this["type"]]
	}
}

export abstract class GuildScheduledEventUpdateListener extends BaseListener<
	typeof ListenerEvent.GuildScheduledEventUpdate
> {
	readonly type = ListenerEvent.GuildScheduledEventUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		} as ListenerEventData[this["type"]]
	}
}

export abstract class GuildScheduledEventUserAddListener extends BaseListener<
	typeof ListenerEvent.GuildScheduledEventUserAdd
> {
	readonly type = ListenerEvent.GuildScheduledEventUserAdd
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id as string)
		const user = new User<true>(client, data.user_id as string)
		return {
			guild,
			user,
			...data
		}
	}
}

export abstract class GuildScheduledEventUserRemoveListener extends BaseListener<
	typeof ListenerEvent.GuildScheduledEventUserRemove
> {
	readonly type = ListenerEvent.GuildScheduledEventUserRemove
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id as string)
		const user = new User<true>(client, data.user_id as string)
		return {
			guild,
			user,
			...data
		}
	}
}

export abstract class GuildSoundboardSoundCreateListener extends BaseListener<
	typeof ListenerEvent.GuildSoundboardSoundCreate
> {
	readonly type = ListenerEvent.GuildSoundboardSoundCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		return {
			...data,
			guild
		}
	}
}

export abstract class GuildSoundboardSoundDeleteListener extends BaseListener<
	typeof ListenerEvent.GuildSoundboardSoundDelete
> {
	readonly type = ListenerEvent.GuildSoundboardSoundDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class GuildSoundboardSoundUpdateListener extends BaseListener<
	typeof ListenerEvent.GuildSoundboardSoundUpdate
> {
	readonly type = ListenerEvent.GuildSoundboardSoundUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		return {
			guild,
			...data
		}
	}
}

export abstract class GuildSoundboardSoundsUpdateListener extends BaseListener<
	typeof ListenerEvent.GuildSoundboardSoundsUpdate
> {
	readonly type = ListenerEvent.GuildSoundboardSoundsUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class GuildStickersUpdateListener extends BaseListener<
	typeof ListenerEvent.GuildStickersUpdate
> {
	readonly type = ListenerEvent.GuildStickersUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class GuildUpdateListener extends BaseListener<
	typeof ListenerEvent.GuildUpdate
> {
	readonly type = ListenerEvent.GuildUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild(client, data)
		return {
			guild,
			...data
		}
	}
}

export abstract class IntegrationCreateListener extends BaseListener<
	typeof ListenerEvent.IntegrationCreate
> {
	readonly type = ListenerEvent.IntegrationCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const user = data.user ? new User(client, data.user) : undefined
		return {
			guild,
			user,
			rawUser: data.user,
			...data
		}
	}
}

export abstract class IntegrationDeleteListener extends BaseListener<
	typeof ListenerEvent.IntegrationDelete
> {
	readonly type = ListenerEvent.IntegrationDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const application = data.application_id
			? new User<true>(client, data.application_id)
			: undefined
		return {
			guild,
			application,
			...data
		}
	}
}

export abstract class IntegrationUpdateListener extends BaseListener<
	typeof ListenerEvent.IntegrationUpdate
> {
	readonly type = ListenerEvent.IntegrationUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class InteractionCreateListener extends BaseListener<
	typeof ListenerEvent.InteractionCreate
> {
	readonly type = ListenerEvent.InteractionCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const user = data.user ? new User(client, data.user) : undefined
		return {
			guild,
			user,
			rawUser: data.user,
			...data
		}
	}
}

export abstract class InviteCreateListener extends BaseListener<
	typeof ListenerEvent.InviteCreate
> {
	readonly type = ListenerEvent.InviteCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const inviter = data.inviter ? new User(client, data.inviter) : undefined
		const targetUser = data.target_user
			? new User(client, data.target_user)
			: undefined
		return {
			guild,
			inviter,
			targetUser,
			rawInviter: data.inviter,
			rawTargetUser: data.target_user,
			...data
		}
	}
}

export abstract class InviteDeleteListener extends BaseListener<
	typeof ListenerEvent.InviteDelete
> {
	readonly type = ListenerEvent.InviteDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const channel = guild ? guild.fetchChannel(data.channel_id) : undefined
		return {
			guild,
			channel,
			rawChannel: data.channel_id,
			...data
		}
	}
}

export abstract class MessageCreateListener extends BaseListener<
	typeof ListenerEvent.MessageCreate
> {
	readonly type = ListenerEvent.MessageCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const member =
			guild && data.member
				? new GuildMember<false, true>(
						client,
						{
							...data.member,
							user: data.author
						},
						guild
					)
				: undefined
		const author = new User(client, data.author)
		const message = new Message(client, data)
		return {
			...data,
			guild,
			member,
			author,
			message,
			rawMessage: data,
			rawMember: data.member,
			rawAuthor: data.author
		}
	}
}

export abstract class MessageDeleteListener extends BaseListener<
	typeof ListenerEvent.MessageDelete
> {
	readonly type = ListenerEvent.MessageDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const message = new Message<true>(client, {
			id: data.id,
			channelId: data.channel_id
		})
		return {
			guild,
			message,
			...data
		}
	}
}

export abstract class MessageDeleteBulkListener extends BaseListener<
	typeof ListenerEvent.MessageDeleteBulk
> {
	readonly type = ListenerEvent.MessageDeleteBulk
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const messages = data.ids.map(
			(id) =>
				new Message<true>(client, {
					id,
					channelId: data.channel_id
				})
		)
		return {
			guild,
			messages,
			...data
		}
	}
}

export abstract class MessageReactionAddListener extends BaseListener<
	typeof ListenerEvent.MessageReactionAdd
> {
	readonly type = ListenerEvent.MessageReactionAdd
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const member =
			guild && data.member
				? new GuildMember<false, true>(client, data.member, guild)
				: undefined
		const user = new User<true>(client, data.user_id)
		const message = new Message<true>(client, {
			id: data.message_id,
			channelId: data.channel_id
		})
		const { user_id, ...restData } = data
		return {
			...restData,
			guild,
			member,
			rawMember: data.member,
			user,
			message
		} as ListenerEventData[this["type"]]
	}
}

export abstract class MessageReactionRemoveListener extends BaseListener<
	typeof ListenerEvent.MessageReactionRemove
> {
	readonly type = ListenerEvent.MessageReactionRemove
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const user = new User<true>(client, data.user_id)
		const message = new Message<true>(client, {
			id: data.message_id,
			channelId: data.channel_id
		})
		const { user_id, ...restData } = data
		return {
			...restData,
			guild,
			user,
			message
		} as ListenerEventData[this["type"]]
	}
}

export abstract class MessageReactionRemoveAllListener extends BaseListener<
	typeof ListenerEvent.MessageReactionRemoveAll
> {
	readonly type = ListenerEvent.MessageReactionRemoveAll
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const message = new Message<true>(client, {
			id: data.message_id,
			channelId: data.channel_id
		})
		return {
			guild,
			message,
			...data
		}
	}
}

export abstract class MessageReactionRemoveEmojiListener extends BaseListener<
	typeof ListenerEvent.MessageReactionRemoveEmoji
> {
	readonly type = ListenerEvent.MessageReactionRemoveEmoji
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const message = new Message<true>(client, {
			id: data.message_id,
			channelId: data.channel_id
		})
		return {
			guild,
			message,
			...data
		}
	}
}

export abstract class MessageUpdateListener extends BaseListener<
	typeof ListenerEvent.MessageUpdate
> {
	readonly type = ListenerEvent.MessageUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const message = new Message(client, data)
		return {
			guild,
			message,
			...data
		}
	}
}

export abstract class PresenceUpdateListener extends BaseListener<
	typeof ListenerEvent.PresenceUpdate
> {
	readonly type = ListenerEvent.PresenceUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const user = new User<true>(client, data.user.id)
		return {
			...data,
			guild,
			user
		}
	}
}

export abstract class ReadyListener extends BaseListener<
	typeof ListenerEvent.Ready
> {
	readonly type = ListenerEvent.Ready
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const user = new User(client, data.user)
		return {
			...data,
			rawUser: data.user,
			user
		}
	}
}

export abstract class ResumedListener extends BaseListener<
	typeof ListenerEvent.Resumed
> {
	readonly type = ListenerEvent.Resumed
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]]
	): ListenerEventData[this["type"]] {
		return data
	}
}

export abstract class StageInstanceCreateListener extends BaseListener<
	typeof ListenerEvent.StageInstanceCreate
> {
	readonly type = ListenerEvent.StageInstanceCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class StageInstanceDeleteListener extends BaseListener<
	typeof ListenerEvent.StageInstanceDelete
> {
	readonly type = ListenerEvent.StageInstanceDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class StageInstanceUpdateListener extends BaseListener<
	typeof ListenerEvent.StageInstanceUpdate
> {
	readonly type = ListenerEvent.StageInstanceUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class SubscriptionCreateListener extends BaseListener<
	typeof ListenerEvent.SubscriptionCreate
> {
	readonly type = ListenerEvent.SubscriptionCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const user = data.user_id ? new User<true>(client, data.user_id) : undefined
		return {
			...data,
			user
		}
	}
}

export abstract class SubscriptionDeleteListener extends BaseListener<
	typeof ListenerEvent.SubscriptionDelete
> {
	readonly type = ListenerEvent.SubscriptionDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const user = data.user_id ? new User<true>(client, data.user_id) : undefined
		return {
			...data,
			user
		}
	}
}

export abstract class SubscriptionUpdateListener extends BaseListener<
	typeof ListenerEvent.SubscriptionUpdate
> {
	readonly type = ListenerEvent.SubscriptionUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const user = data.user_id ? new User<true>(client, data.user_id) : undefined
		return {
			...data,
			user
		}
	}
}

export abstract class ThreadCreateListener extends BaseListener<
	typeof ListenerEvent.ThreadCreate
> {
	readonly type = ListenerEvent.ThreadCreate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const thread = new GuildThreadChannel(client, data)
		return {
			guild,
			thread,
			...data
		}
	}
}

export abstract class ThreadDeleteListener extends BaseListener<
	typeof ListenerEvent.ThreadDelete
> {
	readonly type = ListenerEvent.ThreadDelete
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class ThreadListSyncListener extends BaseListener<
	typeof ListenerEvent.ThreadListSync
> {
	readonly type = ListenerEvent.ThreadListSync
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const threads = data.threads.map(
			(thread) => new GuildThreadChannel(client, thread)
		)
		const members = data.members.map((member) => {
			return new ThreadMember(client, member, data.guild_id)
		})
		return {
			...data,
			guild,
			threads,
			members,
			rawMembers: data.members,
			rawThreads: data.threads
		}
	}
}

export abstract class ThreadMemberUpdateListener extends BaseListener<
	typeof ListenerEvent.ThreadMemberUpdate
> {
	readonly type = ListenerEvent.ThreadMemberUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		if (!data.id)
			throw new Error(
				"Thread ID not provided in payload when docs specified it would be"
			)
		const thread = new GuildThreadChannel<ThreadChannelType, true>(
			client,
			data.id
		)
		const member = data.member
			? new ThreadMember(client, data, data.guild_id)
			: undefined
		return {
			...data,
			guild,
			thread,
			member
		}
	}
}

export abstract class ThreadMembersUpdateListener extends BaseListener<
	typeof ListenerEvent.ThreadMembersUpdate
> {
	readonly type = ListenerEvent.ThreadMembersUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		if (!data.id)
			throw new Error(
				"Thread ID not provided in payload when docs specified it would be"
			)
		const thread = new GuildThreadChannel<ThreadChannelType, true>(
			client,
			data.id
		)
		const addedMembers = data.added_members?.map(
			(member) => new ThreadMember(client, member, data.guild_id)
		)
		const removedMembers = data.removed_member_ids?.map(
			(id) => new User<true>(client, id)
		)
		return {
			guild,
			thread,
			addedMembers,
			removedMembers,
			...data
		}
	}
}

export abstract class ThreadUpdateListener extends BaseListener<
	typeof ListenerEvent.ThreadUpdate
> {
	readonly type = ListenerEvent.ThreadUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		if (!data.id)
			throw new Error(
				"Thread ID not provided in payload when docs specified it would be"
			)
		const thread = new GuildThreadChannel<ThreadChannelType, true>(
			client,
			data.id
		)
		return {
			guild,
			thread,
			...data
		}
	}
}

export abstract class TypingStartListener extends BaseListener<
	typeof ListenerEvent.TypingStart
> {
	readonly type = ListenerEvent.TypingStart
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const member =
			guild && data.member
				? new GuildMember<false, true>(client, data.member, guild)
				: undefined
		const user = new User<true>(client, data.user_id)
		return {
			guild,
			member,
			user,
			rawMember: data.member,
			...data
		}
	}
}

export abstract class UserUpdateListener extends BaseListener<
	typeof ListenerEvent.UserUpdate
> {
	readonly type = ListenerEvent.UserUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const user = new User(client, data)
		return {
			user,
			...data
		}
	}
}

export abstract class VoiceServerUpdateListener extends BaseListener<
	typeof ListenerEvent.VoiceServerUpdate
> {
	readonly type = ListenerEvent.VoiceServerUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			guild,
			...data
		}
	}
}

export abstract class VoiceStateUpdateListener extends BaseListener<
	typeof ListenerEvent.VoiceStateUpdate
> {
	readonly type = ListenerEvent.VoiceStateUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild =
			"guild_id" in data && typeof data.guild_id === "string"
				? new Guild<true>(client, data.guild_id)
				: undefined
		const member =
			guild && data.member
				? new GuildMember<false, true>(client, data.member, guild)
				: undefined
		return {
			...data,
			rawMember: data.member,
			guild,
			member
		}
	}
}

export abstract class WebhooksUpdateListener extends BaseListener<
	typeof ListenerEvent.WebhooksUpdate
> {
	readonly type = ListenerEvent.WebhooksUpdate
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		return {
			...data,
			guild
		}
	}
}

export abstract class MessagePollVoteAddListener extends BaseListener<
	typeof ListenerEvent.MessagePollVoteAdd
> {
	readonly type = ListenerEvent.MessagePollVoteAdd
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const user = new User<true>(client, data.user_id)
		const message = new Message<true>(client, {
			id: data.message_id,
			channelId: data.channel_id
		})
		return {
			guild,
			user,
			message,
			...data
		}
	}
}

export abstract class MessagePollVoteRemoveListener extends BaseListener<
	typeof ListenerEvent.MessagePollVoteRemove
> {
	readonly type = ListenerEvent.MessagePollVoteRemove
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = data.guild_id
			? new Guild<true>(client, data.guild_id)
			: undefined
		const user = new User<true>(client, data.user_id)
		const message = new Message<true>(client, {
			id: data.message_id,
			channelId: data.channel_id
		})
		return {
			guild,
			user,
			message,
			...data
		}
	}
}

export abstract class VoiceChannelEffectSendListener extends BaseListener<
	typeof ListenerEvent.VoiceChannelEffectSend
> {
	readonly type = ListenerEvent.VoiceChannelEffectSend
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]] {
		const guild = new Guild<true>(client, data.guild_id)
		const user = new User<true>(client, data.user_id)
		return {
			guild,
			user,
			...data
		}
	}
}
