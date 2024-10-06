import type { APIEmbed } from "discord-api-types/v10"

/**
 * Represents an embed in a message.
 */
export class Embed {
	/**
	 * The title of the embed
	 */
	title?: string

	/**
	 * The description of the embed
	 */
	description?: string

	/**
	 * The URL of the embed
	 */
	url?: string

	/**
	 * The timestamp of the embed
	 */
	timestamp?: string

	/**
	 * The color of the embed
	 */
	color?: number

	/**
	 * The footer of the embed
	 */
	footer?: {
		text: string
		icon_url?: string
	}

	/**
	 * The image URL of the embed
	 */
	image?: string

	/**
	 * The thumbnail URL of the embed
	 */
	thumbnail?: string

	author?: {
		name: string
		url?: string
		icon_url?: string
	}

	fields?: {
		name: string
		value: string
		inline?: boolean
	}[]

	/**
	 * Create an embed from an API embed
	 */
	constructor(embed?: APIEmbed) {
		if (embed) {
			this.title = embed.title
			this.description = embed.description
			this.url = embed.url
			this.timestamp = embed.timestamp
			this.color = embed.color
			this.footer = embed.footer
			this.image = embed.image?.url
			this.thumbnail = embed.thumbnail?.url
			this.author = embed.author
			this.fields = embed.fields
		}
	}

	/**
	 * Serialize the embed to an API embed
	 * @internal
	 */
	serialize(): APIEmbed {
		return {
			title: this.title,
			description: this.description,
			url: this.url,
			timestamp: this.timestamp,
			color: this.color,
			footer: this.footer,
			image: this.image ? { url: this.image } : undefined,
			thumbnail: this.thumbnail ? { url: this.thumbnail } : undefined,
			author: this.author,
			fields: this.fields
		}
	}
}
