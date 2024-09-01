import type { APIThreadChannel, ThreadChannelType } from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"

export class GuildThreadChannel<
	Type extends ThreadChannelType
> extends BaseGuildChannel<Type> {
	archived?: boolean
	autoArchiveDuration?: number
	archiveTimestamp?: string
	locked?: boolean
	invitable?: boolean
	createTimestamp?: string
	messageCount?: number
	memberCount?: number
	ownerId?: string
	totalMessageSent?: number
	appliedTags?: string[]

	protected setSpecificData(data: APIThreadChannel) {
		this.archived = data.thread_metadata?.archived
		this.autoArchiveDuration = data.thread_metadata?.auto_archive_duration
		this.archiveTimestamp = data.thread_metadata?.archive_timestamp
		this.locked = data.thread_metadata?.locked
		this.invitable = data.thread_metadata?.invitable
		this.createTimestamp = data.thread_metadata?.create_timestamp
		this.messageCount = data.message_count
		this.memberCount = data.member_count
		this.ownerId = data.owner_id
		this.totalMessageSent = data.total_message_sent
		this.appliedTags = data.applied_tags
	}
}
