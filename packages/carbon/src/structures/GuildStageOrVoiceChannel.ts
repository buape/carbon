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
	bitrate?: number | null
	userLimit?: number | null
	rtcRegion?: string | null
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
