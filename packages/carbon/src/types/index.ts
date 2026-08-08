import type {
	APIActionRowComponent,
	APIAllowedMentions,
	APIApplicationCommand,
	APIApplicationCommandInteractionMetadata,
	APIAttachment,
	APIAuthorizingIntegrationOwnersMap,
	APIComponentInLabel,
	APIComponentInModalActionRow,
	APIInteraction,
	APILabelComponent,
	APIMessage,
	APIMessageComponentInteractionMetadata,
	APIMessageInteractionMetadata,
	APIMessageReference,
	APIModalComponent,
	APIModalInteractionResponseCallbackData,
	APIModalSubmitInteractionMetadata,
	APIStickerItem,
	APITextDisplayComponent,
	APIUser,
	APIWebhook,
	ApplicationCommandOptionType,
	ChannelType,
	Permissions
} from "discord-api-types/v10"
import type { BaseComponentInteraction } from "../abstracts/BaseComponentInteraction.js"
import type { BaseMessageInteractiveComponent } from "../abstracts/BaseMessageInteractiveComponent.js"
import type { Container } from "../classes/components/Container.js"
import type { File } from "../classes/components/File.js"
import type { MediaGallery } from "../classes/components/MediaGallery.js"
import type { Row } from "../classes/components/Row.js"
import type { Section } from "../classes/components/Section.js"
import type { Separator } from "../classes/components/Separator.js"
import type { TextDisplay } from "../classes/components/TextDisplay.js"
import type { Embed } from "../classes/Embed.js"
import type { CommandInteraction } from "../internals/CommandInteraction.js"

export type ComponentParserResult = {
	key: string
	data: Record<string, string | number | boolean>
}

export type ComponentData<
	T extends
		keyof ComponentParserResult["data"] = keyof ComponentParserResult["data"]
> = {
	[K in T]: ComponentParserResult["data"][K]
}

export type AllowedMentions = APIAllowedMentions

type BrandedId<Brand extends string> = string & { readonly __brand: Brand }
type BrandedIdLike<Brand extends string> = string & {
	readonly __brand?: Brand
}
type BrandStringValue<Value, Brand extends string> = Value extends string
	? Brand
	: Value
type BrandDiscordIdField<
	Key extends string,
	Value,
	Id extends string
> = Key extends "id"
	? BrandStringValue<Value, Id>
	: Key extends "guild_id"
		? BrandStringValue<Value, GuildId>
		: Key extends "bot_id"
			? BrandStringValue<Value, UserId>
			: Key extends "integration_id"
				? BrandStringValue<Value, IntegrationId>
				: Key extends "sku_id" | "subscription_listing_id"
					? BrandStringValue<Value, SkuId>
					: Key extends
								| "channel_id"
								| "parent_id"
								| "afk_channel_id"
								| "widget_channel_id"
								| "system_channel_id"
								| "rules_channel_id"
								| "public_updates_channel_id"
								| "safety_alerts_channel_id"
						? BrandStringValue<Value, ChannelId>
						: Key extends "user_id" | "owner_id" | "creator_id"
							? BrandStringValue<Value, UserId>
							: Key extends "role_id"
								? BrandStringValue<Value, RoleId>
								: Key extends "message_id" | "last_message_id"
									? BrandStringValue<Value, MessageId>
									: Key extends "emoji_id"
										? BrandStringValue<Value, EmojiId>
										: Key extends "webhook_id"
											? BrandStringValue<Value, WebhookId>
											: Key extends "application_id"
												? BrandStringValue<Value, ApplicationId>
												: Key extends
															| "original_response_message_id"
															| "target_message_id"
															| "interacted_message_id"
													? BrandStringValue<Value, MessageId>
													: Key extends "interaction_id"
														? BrandStringValue<Value, InteractionId>
														: Key extends "attachment_id"
															? BrandStringValue<Value, AttachmentId>
															: Key extends "roles"
																? Value extends readonly string[]
																	? RoleId[]
																	: BrandedDiscordIds<Value, RoleId>
																: Key extends
																			| "user"
																			| "author"
																			| "creator"
																			| "target_user"
																	? BrandedDiscordIds<Value, UserId>
																	: Key extends "guild"
																		? BrandedDiscordIds<Value, GuildId>
																		: Key extends "channel"
																			? BrandedDiscordIds<Value, ChannelId>
																			: Key extends
																						| "message"
																						| "referenced_message"
																				? BrandedDiscordIds<Value, MessageId>
																				: Key extends "attachments"
																					? BrandedDiscordIds<
																							Value,
																							AttachmentId
																						>
																					: Key extends
																								| "sticker_items"
																								| "stickers"
																						? BrandedDiscordIds<
																								Value,
																								StickerId
																							>
																						: Key extends "emoji" | "emojis"
																							? BrandedDiscordIds<
																									Value,
																									EmojiId
																								>
																							: Key extends "available_tags"
																								? BrandedDiscordIds<
																										Value,
																										ForumTagId
																									>
																								: Key extends "applied_tags"
																									? Value extends readonly string[]
																										? ForumTagId[]
																										: BrandedDiscordIds<
																												Value,
																												ForumTagId
																											>
																									: Key extends "permission_overwrites"
																										? BrandedDiscordIds<
																												Value,
																												RoleId | UserId
																											>
																										: BrandedDiscordIds<
																												Value,
																												Id
																											>

export type BrandedDiscordIds<T, Id extends string = string> = T extends (
	...args: never[]
) => unknown
	? T
	: T extends readonly (infer Item)[]
		? BrandedDiscordIds<Item, Id>[]
		: T extends object
			? { [Key in keyof T]: BrandDiscordIdField<Key & string, T[Key], Id> }
			: T

export type GuildId = BrandedId<"GuildId">
export type GuildIdLike = BrandedIdLike<"GuildId">
export type UserId = BrandedId<"UserId">
export type UserIdLike = BrandedIdLike<"UserId">
export type ChannelId = BrandedId<"ChannelId">
export type ChannelIdLike = BrandedIdLike<"ChannelId">
export type RoleId = BrandedId<"RoleId">
export type RoleIdLike = BrandedIdLike<"RoleId">
export type MessageId = BrandedId<"MessageId">
export type MessageIdLike = BrandedIdLike<"MessageId">
export type EmojiId = BrandedId<"EmojiId">
export type EmojiIdLike = BrandedIdLike<"EmojiId">
export type WebhookId = BrandedId<"WebhookId">
export type WebhookIdLike = BrandedIdLike<"WebhookId">
export type ApplicationId = BrandedId<"ApplicationId">
export type ApplicationIdLike = BrandedIdLike<"ApplicationId">
export type InteractionId = BrandedId<"InteractionId">
export type InteractionIdLike = BrandedIdLike<"InteractionId">
export type AttachmentId = BrandedId<"AttachmentId">
export type AttachmentIdLike = BrandedIdLike<"AttachmentId">
export type ApplicationCommandId = BrandedId<"ApplicationCommandId">
export type ApplicationCommandIdLike = BrandedIdLike<"ApplicationCommandId">
export type IntegrationId = BrandedId<"IntegrationId">
export type IntegrationIdLike = BrandedIdLike<"IntegrationId">
export type SkuId = BrandedId<"SkuId">
export type SkuIdLike = BrandedIdLike<"SkuId">
export type ForumTagId = BrandedId<"ForumTagId">
export type ForumTagIdLike = BrandedIdLike<"ForumTagId">

export type BrandedAPIInteraction<T extends APIInteraction = APIInteraction> =
	Omit<T, "id"> & { id: InteractionId }
export type BrandedAPIUser = Omit<APIUser, "id"> & { id: UserId }
export type BrandedAPIAttachment = Omit<
	BrandedDiscordIds<APIAttachment, AttachmentId>,
	"id" | "application"
> & {
	id: AttachmentId
	application?: BrandedDiscordIds<
		NonNullable<APIAttachment["application"]>,
		ApplicationId
	> | null
}
export type BrandedAPIStickerItem = Omit<APIStickerItem, "id"> & {
	id: StickerId
}
export type BrandedAPIMessageReference = Omit<
	APIMessageReference,
	"message_id" | "channel_id" | "guild_id"
> & {
	message_id?: MessageId
	channel_id: ChannelId
	guild_id?: GuildId
}
export type BrandedAPIAuthorizingIntegrationOwnersMap = Omit<
	APIAuthorizingIntegrationOwnersMap,
	keyof APIAuthorizingIntegrationOwnersMap
> & {
	[key in keyof APIAuthorizingIntegrationOwnersMap]?: GuildId | UserId
}

type BrandedAPIBaseInteractionMetadata<
	T extends APIMessageInteractionMetadata
> = Omit<
	T,
	| "id"
	| "user"
	| "authorizing_integration_owners"
	| "original_response_message_id"
> & {
	id: InteractionId
	user: BrandedAPIUser
	authorizing_integration_owners: BrandedAPIAuthorizingIntegrationOwnersMap
	original_response_message_id?: MessageId
}

export type BrandedAPIApplicationCommandInteractionMetadata = Omit<
	BrandedAPIBaseInteractionMetadata<APIApplicationCommandInteractionMetadata>,
	"target_user" | "target_message_id"
> & {
	target_user?: BrandedAPIUser
	target_message_id?: MessageId
}
export type BrandedAPIMessageComponentInteractionMetadata = Omit<
	BrandedAPIBaseInteractionMetadata<APIMessageComponentInteractionMetadata>,
	"interacted_message_id"
> & {
	interacted_message_id: MessageId
}
export type BrandedAPIModalSubmitInteractionMetadata = Omit<
	BrandedAPIBaseInteractionMetadata<APIModalSubmitInteractionMetadata>,
	"triggering_interaction_metadata"
> & {
	triggering_interaction_metadata:
		| BrandedAPIApplicationCommandInteractionMetadata
		| BrandedAPIMessageComponentInteractionMetadata
}
export type BrandedAPIMessageInteractionMetadata =
	| BrandedAPIApplicationCommandInteractionMetadata
	| BrandedAPIMessageComponentInteractionMetadata
	| BrandedAPIModalSubmitInteractionMetadata

export type BrandedAPIMessage = Omit<
	APIMessage,
	| "id"
	| "channel_id"
	| "application_id"
	| "attachments"
	| "sticker_items"
	| "message_reference"
	| "interaction_metadata"
	| "author"
	| "mentions"
	| "referenced_message"
> & {
	id: MessageId
	channel_id: ChannelId
	application_id?: ApplicationId
	attachments: BrandedAPIAttachment[]
	sticker_items?: BrandedAPIStickerItem[]
	message_reference?: BrandedAPIMessageReference
	interaction_metadata?: BrandedAPIMessageInteractionMetadata
	author: BrandedAPIUser
	mentions: BrandedAPIUser[]
	referenced_message?: BrandedAPIMessage | null
}

export type BrandedAPIWebhook = Omit<
	APIWebhook,
	"id" | "guild_id" | "channel_id" | "application_id" | "user"
> & {
	id: WebhookId
	guild_id?: GuildId | null
	channel_id: ChannelId | null
	application_id: ApplicationId | null
	user?: BrandedAPIUser
}

export type BrandedAPIApplicationCommand = Omit<
	BrandedDiscordIds<APIApplicationCommand, ApplicationCommandId>,
	"id" | "application_id" | "guild_id"
> & {
	id: ApplicationCommandId
	application_id: ApplicationId
	guild_id?: GuildId
}

export type GuildScheduledEventId = BrandedId<"GuildScheduledEventId">
export type GuildScheduledEventIdLike = BrandedIdLike<"GuildScheduledEventId">

/**
 * A function that takes a command interaction and returns a boolean value
 */
export type ConditionalCommandOption = (
	interaction: CommandInteraction
) => boolean

/**
 * A function that takes a component interaction and returns a boolean value
 */
export type ConditionalComponentOption = (
	interaction: BaseComponentInteraction
) => boolean

export type APILabelComponent2 = Omit<APILabelComponent, "component"> & {
	component:
		| APIComponentInLabel
		| import("discord-api-types/v10").APICheckboxActionComponent
		| import("discord-api-types/v10").APICheckboxGroupActionComponent
		| import("discord-api-types/v10").APIRadioGroupActionComponent
	// god i hate inline imports but this is the best way to do this for now and be reliable
}

export type APIModalInteractionResponseCallbackComponent2 =
	| APIActionRowComponent<APIComponentInModalActionRow>
	| APILabelComponent2
	| APITextDisplayComponent

export type APIModalInteractionResponseCallbackData2 = Omit<
	APIModalInteractionResponseCallbackData,
	"components"
> & {
	components: APIModalInteractionResponseCallbackComponent2[]
}

export type TopLevelComponents =
	| Row<BaseMessageInteractiveComponent>
	| Container
	| File
	| MediaGallery
	| Section
	| Separator
	| TextDisplay

export type PollSendPayload = {
	question: {
		/**
		 * The text of the question, up to 300 characters
		 */
		text?: string
	}
	answers: {
		/**
		 * The text of the answer, up to 55 characters
		 */
		text?: string
		/**
		 * The emoji of the answer.
		 * When creating a poll answer with an emoji,
		 * you only need to send either the id (custom emoji) or name (default emoji) as the only field.
		 */
		emoji?: { name: string; id: EmojiIdLike }
	}[]
	/**
	 * The time in seconds before the poll expires.
	 */
	expiry: number
	/**
	 * Whether the poll allows multiple answers
	 */
	allowMultiselect: boolean
	/**
	 * The layout type of the poll.
	 * Currently only 1 is supported, and will be set by default.
	 * @default 1
	 */
	layoutType?: 1
}

export type MessagePayloadObject = {
	/**
	 * The content of the message
	 */
	content?: string
	/**
	 * The embeds of the message
	 */
	embeds?: Embed[]
	/**
	 * The components to send in the message
	 */
	components?: TopLevelComponents[]
	/**
	 * The settings for which mentions are allowed in the message
	 */
	allowedMentions?: AllowedMentions
	/**
	 * The flags for the message
	 */
	flags?: number
	/**
	 * Whether the message should be TTS
	 */
	tts?: boolean
	/**
	 * The files to send in the message
	 */
	files?: MessagePayloadFile[]
	/**
	 * The poll to send in the message
	 */
	poll?: PollSendPayload
	/**
	 * Whether the message should be ephemeral (shorthand for MessageFlags.Ephemeral)
	 */
	ephemeral?: boolean
	/**
	 * The stickers to send in the message
	 */
	stickers?:
		| [StickerIdLike, StickerIdLike, StickerIdLike]
		| [StickerIdLike, StickerIdLike]
		| [StickerIdLike]
}

/**
 * The data that is sent to Discord when sending a message.
 * If you pass just a string, it will be treated as the content of the message.
 */
export type MessagePayload = string | MessagePayloadObject

/**
 * The data for a file to send in an interaction
 */
export type MessagePayloadFile = {
	/**
	 * The name of the file that will be given to Discord
	 */
	name: string
	/**
	 * The data of the file in a Blob
	 */
	data: Blob
	/**
	 * The alt text of the file, shown for accessibility
	 */
	description?: string
	/**
	 * The duration of the audio file in seconds (required for voice messages)
	 */
	duration_secs?: number
	/**
	 * Base64-encoded waveform sample data (required for voice messages)
	 */
	waveform?: string
}

export type StickerId = BrandedId<"StickerId">
export type StickerIdLike = BrandedIdLike<"StickerId">

export type VoiceState = {
	guildId?: GuildId
	channelId: ChannelId | null
	userId: UserId
	sessionId: string
	deaf: boolean
	mute: boolean
	selfDeaf: boolean
	selfMute: boolean
	selfStream: boolean
	selfVideo: boolean
	suppress: boolean
	requestToSpeakTimestamp: string | null
}

export type ResolvedFile = BrandedAPIAttachment

/**
 * image includes '.png', '.gif', '.jpg', '.jpeg', '.jfif', '.webp', '.avif'
 * video includes '.mp4', '.mov', '.qt', '.webm'
 * audio includes '.mp3', '.m4a', '.wav', '.ogg', '.opus', '.flac'
 */
export type FileTypeFilter = "image" | "video" | "audio" | `.${string}`
// internally at Discord, that regex is ^(image|video|audio|\.[\w\-\.]+)$

export type BaseMessageInteractiveComponentConstructor = new (
	// biome-ignore lint/suspicious/noExplicitAny: This is a constructor
	...args: any[]
) => BaseMessageInteractiveComponent

export type ArrayOrSingle<T> = T | T[]
export type IfPartial<T, U, V = U | undefined> = T extends true ? V : U

export * from "./channels.js"
export * from "./commandMiddleware.js"
export * from "./listeners.js"

declare module "discord-api-types/v10" {
	export type APIModalComponent2 =
		| APIModalComponent
		| APILabelComponent2
		| APICheckboxActionComponent
		| APICheckboxGroupActionComponent
		| APIRadioGroupActionComponent

	export interface APIInteractionDataResolvedChannelBase<
		T extends ChannelType
	> {
		/**
		 * Bitwise set of permissions the app's bot user has in this resolved channel.
		 *
		 * Only present when the application's bot user is in the guild.
		 */
		app_permissions?: Permissions
	}

	export interface APIFileUploadComponent {
		file_types?: FileTypeFilter[]
	}

	export interface APIApplicationCommandOptionBase<
		Type extends ApplicationCommandOptionType
	> {
		file_types?: Type extends ApplicationCommandOptionType.Attachment
			? FileTypeFilter[]
			: never
	}

	export interface APIRadioGroupActionComponent {
		type: 21 //ComponentType.RadioGroup
		id?: number
		custom_id: string
		options: APIRadioGroupOption[] // 2-10
		required?: boolean
	}

	export interface APIRadioGroupOption {
		value: string
		label: string
		description?: string
		default?: boolean
	}

	export interface APICheckboxGroupActionComponent {
		type: 22 //ComponentType.CheckboxGroup
		id?: number
		custom_id: string
		options: APICheckboxGroupOption[] // 1-10
		min_values?: number // 0-10, defaults to 1
		max_values?: number // 1-10, defaults to len(options)
		required?: boolean
	}

	export interface APICheckboxGroupOption {
		value: string
		label: string
		description?: string
		default?: boolean
	}

	export interface APICheckboxActionComponent {
		type: 23 //	ComponentType.Checkbox
		id?: number
		custom_id: string
		default?: boolean
	}
}
