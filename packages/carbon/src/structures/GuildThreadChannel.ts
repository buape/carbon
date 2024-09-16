import {
	type APIThreadChannel,
	Routes,
	type ThreadChannelType
} from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"
import type { IfPartial } from "../utils.js"

export class GuildThreadChannel<
	Type extends ThreadChannelType,
	IsPartial extends boolean = false
> extends BaseGuildChannel<Type, IsPartial> {
	// @ts-expect-error
	declare rawData: APIThreadChannel | null

	/**
	 * Whether the thread is archived.
	 */
	get archived(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.thread_metadata?.archived as never
	}

	/**
	 * The duration until the thread is auto archived.
	 */
	get autoArchiveDuration(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.thread_metadata?.auto_archive_duration as never
	}

	/**
	 * The timestamp of when the thread was archived.
	 */
	get archiveTimestamp(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.thread_metadata?.archive_timestamp as never
	}

	/**
	 * Whether the thread is locked.
	 */
	get locked(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.thread_metadata?.locked as never
	}

	/**
	 * Whether non-moderators can add other non-moderators to a thread; only available on private threads
	 */
	get invitable(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.thread_metadata?.invitable as never
	}

	/**
	 * The timestamp of when the thread was created.
	 */
	get createTimestamp(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.thread_metadata?.create_timestamp as never
	}

	/**
	 * The number of messages in the thread.
	 */
	get messageCount(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.message_count as never
	}

	/**
	 * The number of members in the thread.
	 *
	 * @remarks
	 * This is only accurate until 50, after that, Discord stops counting.
	 */
	get memberCount(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.member_count as never
	}

	/**
	 * The ID of the owner of the thread.
	 */
	get ownerId(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.owner_id as never
	}

	/**
	 * The number of messages sent in the thread.
	 */
	get totalMessageSent(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.total_message_sent as never
	}

	/**
	 * The tags applied to the thread.
	 */
	get appliedTags(): IfPartial<IsPartial, string[]> {
		if (!this.rawData) return undefined as never
		return this.rawData.applied_tags as never
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
		Reflect.set(this.rawData?.thread_metadata ?? {}, "archived", true)
	}

	/**
	 * Unarchive the thread
	 */
	async unarchive() {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: { archive: false }
		})
		Reflect.set(this.rawData?.thread_metadata ?? {}, "archived", false)
	}

	/**
	 * Set the auto archive duration of the thread
	 */
	async setAutoArchiveDuration(duration: number) {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: { auto_archive_duration: duration }
		})
		Reflect.set(
			this.rawData?.thread_metadata ?? {},
			"auto_archive_duration",
			duration
		)
	}

	/**
	 * Lock the thread
	 */
	async lock() {
		await this.client.rest.put(Routes.channel(this.id), {
			body: { locked: true }
		})
		Reflect.set(this.rawData?.thread_metadata ?? {}, "locked", true)
	}

	/**
	 * Unlock the thread
	 */
	async unlock() {
		await this.client.rest.put(Routes.channel(this.id), {
			body: { locked: false }
		})
		Reflect.set(this.rawData?.thread_metadata ?? {}, "locked", false)
	}
}
