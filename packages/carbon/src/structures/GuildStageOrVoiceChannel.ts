import type {
	APIGuildStageVoiceChannel,
	APIGuildVoiceChannel,
	ChannelType,
	VideoQualityMode
} from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"

export abstract class GuildStageOrVoiceChannel<
	Type extends ChannelType.GuildStageVoice | ChannelType.GuildVoice
> extends BaseGuildChannel<Type> {
	/**
	 * The bitrate of the channel.
	 */
	bitrate?: number | null
	/**
	 * The user limit of the channel.
	 */
	userLimit?: number | null
	/**
	 * The RTC region of the channel.
	 * This is automatic when set to `null`.
	 */
	rtcRegion?: string | null
	/**
	 * The video quality mode of the channel.
	 * 1 when not present.
	 */
	videoQualityMode?: VideoQualityMode | null

	protected setSpecificData(
		data: APIGuildStageVoiceChannel | APIGuildVoiceChannel
	) {
		this.bitrate = data.bitrate
		this.userLimit = data.user_limit
		this.rtcRegion = data.rtc_region
		this.videoQualityMode = data.video_quality_mode
	}
}

export class GuildStageChannel extends BaseGuildChannel<ChannelType.GuildStageVoice> {
	protected setSpecificData() {}
}
export class GuildVoiceChannel extends BaseGuildChannel<ChannelType.GuildVoice> {
	protected setSpecificData() {}
}
