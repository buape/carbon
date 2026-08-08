import type { APIChatInputApplicationCommandInteraction } from "discord-api-types/v10"
import { expectTypeOf, test } from "vitest"
import type {
	ApplicationCommandId,
	BrandedAPIApplicationCommand,
	BrandedAPIInteraction,
	BrandedDiscordIds,
	GuildId,
	GuildIdLike,
	InteractionId,
	UserId,
	UserIdLike
} from "../../src/index.js"

type BrandedInteraction =
	BrandedAPIInteraction<APIChatInputApplicationCommandInteraction>

test("brands only Discord snowflakes", () => {
	expectTypeOf<BrandedInteraction["id"]>().toEqualTypeOf<InteractionId>()
	expectTypeOf<BrandedInteraction["data"]["id"]>().toEqualTypeOf<string>()
	expectTypeOf<
		BrandedDiscordIds<{ custom_id: string }>["custom_id"]
	>().toEqualTypeOf<string>()
	expectTypeOf<
		BrandedDiscordIds<{ session_id: string }>["session_id"]
	>().toEqualTypeOf<string>()
	expectTypeOf<
		BrandedDiscordIds<{ answer_id: number }>["answer_id"]
	>().toEqualTypeOf<number>()
	expectTypeOf<
		BrandedAPIApplicationCommand["id"]
	>().toEqualTypeOf<ApplicationCommandId>()
	expectTypeOf<
		BrandedAPIApplicationCommand["version"]
	>().toEqualTypeOf<string>()
})

declare const guildId: GuildId
declare const userId: UserId
declare const customId: BrandedDiscordIds<{ custom_id: string }>["custom_id"]
declare function fetchMember(guildId: GuildIdLike, userId: UserIdLike): void
declare function requireInteractionId(interactionId: InteractionId): void

fetchMember(guildId, userId)
// @ts-expect-error user IDs should not satisfy guild ID inputs
fetchMember(userId, guildId)
// @ts-expect-error custom IDs are not Discord snowflakes
requireInteractionId(customId)
