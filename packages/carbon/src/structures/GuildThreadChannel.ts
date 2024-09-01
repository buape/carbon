import {
	Routes,
	type APIThreadChannel,
	type ThreadChannelType
} from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"

export class GuildThreadChannel<
	Type extends ThreadChannelType
> extends BaseGuildChannel<Type> {
	/**
	 * Whether the thread is archived.
	 */
	archived?: boolean
	/**
	 * The duration until the thread is auto archived.
	 */
	autoArchiveDuration?: number
	/**
	 * The timestamp of when the thread was archived.
	 */
	archiveTimestamp?: string
	/**
	 * Whether the thread is locked.
	 */
	locked?: boolean
	/**
	 * Whether non-moderators can add other non-moderators to a thread; only available on private threads
	 */
	invitable?: boolean
	/**
	 * The timestamp of when the thread was created.
	 */
	createTimestamp?: string
	/**
	 * The number of messages in the thread.
	 */
	messageCount?: number
	/**
	 * The number of members in the thread.
	 *
	 * @remarks
	 * This is only accurate until 50, after that, Discord stops counting.
	 */
	memberCount?: number
	/**
	 * The ID of the owner of the thread.
	 */
	ownerId?: string
	/**
	 * The number of messages sent in the thread.
	 */
	totalMessageSent?: number
	/**
	 * The tags applied to the thread.
	 */
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

	/**
	 * Join the thread
	 */
	async join() {
		await this.addMember("@me")
	}

	/**
	 * Add a member to the thread
	 */
	async addMember(userId: string) {
		await this.client.rest.put(Routes.threadMembers(this.id, userId))
	}

	/**
	 * Leave the thread
	 */
	async leave() {
		await this.removeMember("@me")
	}

	/**
	 * Get the pinned messages in the thread
	 */
	async removeMember(userId: string) {
		await this.client.rest.delete(Routes.threadMembers(this.id, userId))
	}

	/**
	 * Archive the thread
	 */
	async archive() {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: { archive: true }
		})
		this.archived = true
	}

	/**
	 * Unarchive the thread
	 */
	async unarchive() {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: { archive: false }
		})
		this.archived = false
	}

	/**
	 * Set the auto archive duration of the thread
	 */
	async setAutoArchiveDuration(duration: number) {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: { auto_archive_duration: duration }
		})
		this.autoArchiveDuration = duration
	}

	/**
	 * Lock the thread
	 */
	async lock() {
		await this.client.rest.put(Routes.channel(this.id), {
			body: { locked: true }
		})
		this.locked = true
	}

	/**
	 * Unlock the thread
	 */
	async unlock() {
		await this.client.rest.put(Routes.channel(this.id), {
			body: { locked: false }
		})
		this.locked = false
	}
}
