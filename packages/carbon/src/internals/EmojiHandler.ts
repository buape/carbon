import { type APIApplicationEmoji, Routes } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import { ApplicationEmoji } from "../structures/Emoji.js"
import type { EmojiIdLike } from "../types/index.js"

/**
 * This class is specifically used for application emojis that you manage from the Discord Developer Portal
 */
export class EmojiHandler extends Base {
	public async list() {
		const emojis = (await this.client.rest.get(
			Routes.applicationEmojis(this.client.clientId)
		)) as { items: APIApplicationEmoji[] }
		return emojis.items.map(
			(emoji) => new ApplicationEmoji(this.client, emoji, this.client.clientId)
		)
	}

	public async get(id: EmojiIdLike) {
		const emoji = (await this.client.rest.get(
			Routes.applicationEmoji(this.client.clientId, id)
		)) as APIApplicationEmoji
		return new ApplicationEmoji(this.client, emoji, this.client.clientId)
	}

	public async getByName(name: string) {
		const emojis = await this.list()
		return emojis.find((emoji) => emoji.name === name)
	}

	/**
	 * Upload a new emoji to the application
	 * @param name The name of the emoji
	 * @param image The image of the emoji in base64 format
	 * @returns The created ApplicationEmoji
	 */
	public async create(name: string, image: string) {
		const emoji = (await this.client.rest.post(
			Routes.applicationEmojis(this.client.clientId),
			{ body: { name, image } }
		)) as APIApplicationEmoji
		return new ApplicationEmoji(this.client, emoji, this.client.clientId)
	}

	public async delete(id: EmojiIdLike) {
		await this.client.rest.delete(
			Routes.applicationEmoji(this.client.clientId, id)
		)
	}
}
