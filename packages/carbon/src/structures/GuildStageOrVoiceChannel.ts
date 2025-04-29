import {
	type APIGuildStageVoiceChannel,
	type APIGuildVoiceChannel,
	type ChannelType,
	VideoQualityMode
} from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"
import type { IfPartial } from "../types/index.js"

export abstract class GuildStageOrVoiceChannel<
	Type extends ChannelType.GuildStageVoice | ChannelType.GuildVoice,
	IsPartial extends boolean = false
> extends BaseGuildChannel<Type, IsPartial> {
	// @ts-expect-error
	declare rawData: APIGuildStageVoiceChannel | APIGuildVoiceChannel | null

	/**
	 * The bitrate of the channel.
	 */
	get bitrate(): IfPartial<IsPartial, number | undefined> {
		if (!this.rawData) return undefined as never
		return this.rawData.bitrate
	}

	/**
	 * The user limit of the channel.
	 */
	get userLimit(): IfPartial<IsPartial, number | undefined> {
		if (!this.rawData) return undefined as never
		return this.rawData.user_limit
	}

	/**
	 * The RTC region of the channel.
	 * This is automatic when set to `null`.
	 */
	get rtcRegion(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.rtc_region ?? null
	}

	/**
	 * The video quality mode of the channel.
	 * 1 when not present.
	 */
	get videoQualityMode(): IfPartial<IsPartial, VideoQualityMode> {
		if (!this.rawData) return undefined as never
		return this.rawData.video_quality_mode ?? VideoQualityMode.Auto
	}
}

export class GuildStageChannel<
	IsPartial extends boolean = false
> extends GuildStageOrVoiceChannel<ChannelType.GuildStageVoice, IsPartial> {
	declare rawData: APIGuildStageVoiceChannel | null
}
export class GuildVoiceChannel<
	IsPartial extends boolean = false
> extends GuildStageOrVoiceChannel<ChannelType.GuildVoice, IsPartial> {
	declare rawData: APIGuildVoiceChannel | null
}
