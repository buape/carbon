import {
	type APIMessageTopLevelComponent,
	MessageFlags,
	type RESTPostAPIChannelMessageJSONBody
} from "discord-api-types/v10"
import type { MessagePayload } from "../types/index.js"

export const serializePayload = (
	payload: MessagePayload,
	defaultEphemeral = false
): RESTPostAPIChannelMessageJSONBody => {
	if (typeof payload === "string") {
		return { content: payload, flags: defaultEphemeral ? 64 : undefined }
	}
	if (payload.components?.some((component) => component.isV2)) {
		payload.flags = payload.flags
			? payload.flags | MessageFlags.IsComponentsV2
			: MessageFlags.IsComponentsV2
	}

	if (
		payload.flags &&
		(payload.flags & MessageFlags.IsComponentsV2) ===
			MessageFlags.IsComponentsV2
	) {
		if (payload.content) {
			throw new Error(
				"You cannot send a message with both content and v2 components. Use the TextDisplay component as a replacement for the content property in the message."
			)
		}
		if (payload.embeds) {
			throw new Error(
				"You cannot send a message with both embeds and v2 components. Use the Container component as a replacement for the embeds in the message."
			)
		}
	}

	const data = {
		...payload,
		allowed_mentions: payload.allowedMentions,
		embeds: payload.embeds?.map((embed) => embed.serialize()),
		components: payload.components?.map((row) =>
			row.serialize()
		) as APIMessageTopLevelComponent[]
	}
	if (defaultEphemeral) {
		data.flags = payload.flags ? payload.flags | 64 : 64
	}
	return data
}
