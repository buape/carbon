import type {
	APIGuildStageVoiceChannel,
	APIGuildVoiceChannel,
	ChannelType,
	VideoQualityMode
} from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"
import type { IfPartial } from "../utils.js"

export abstract class GuildStageOrVoiceChannel<
	Type extends ChannelType.GuildStageVoice | ChannelType.GuildVoice,
	IsPartial extends boolean = false
> extends BaseGuildChannel<Type, IsPartial> {
	// @ts-expect-error
	declare rawData: APIGuildStageVoiceChannel | APIGuildVoiceChannel | null

	/**
	 * The bitrate of the channel.
	 */
	get bitrate(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.bitrate as never
	}

	/**
	 * The user limit of the channel.
	 */
	get userLimit(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.user_limit as never
	}

	/**
	 * The RTC region of the channel.
	 * This is automatic when set to `null`.
	 */
	get rtcRegion(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.rtc_region as never
	}

	/**
	 * The video quality mode of the channel.
	 * 1 when not present.
	 */
	get videoQualityMode(): IfPartial<IsPartial, VideoQualityMode> {
		if (!this.rawData) return undefined as never
		return this.rawData.video_quality_mode as never
	}
}

export class GuildStageChannel extends BaseGuildChannel<ChannelType.GuildStageVoice> {
	protected setSpecificData() {}
}
export class GuildVoiceChannel extends BaseGuildChannel<ChannelType.GuildVoice> {
	protected setSpecificData() {}
}
