import type {
	APIApplicationCommandInteractionDataOption,
	APIInteraction,
	APIInteractionDataResolved,
	APIMessage,
	CarbonTestEvent,
	ComponentType,
	MessagePayload,
	RESTPostAPIInteractionCallbackJSONBody
} from "@buape/carbon"

export type IdInput = string | { id: string }

export type TestCarbonOptions = {
	throwHandlerErrors?: boolean
	strict?: boolean
}

export type DiscordCall = {
	method: string
	path: string
	url: string
	query: URLSearchParams
	body: unknown
	headers: Headers
}

export type RouteMatcher = string | RegExp | ((call: DiscordCall) => boolean)

export type RouteReply = {
	status: number
	body?: unknown
	headers?: Record<string, string>
}

export type TestUser = {
	id: string
	username?: string
	discriminator?: string
	global_name?: string | null
	avatar?: string | null
	bot?: boolean
}

export type TestGuild = {
	id: string
	name?: string
	icon?: string | null
}

export type TestChannel = {
	id: string
	type?: number
	guild_id?: string
	name?: string
}

export type TestRole = {
	id: string
	name?: string
	color?: number
	position?: number
	permissions?: string
	managed?: boolean
	mentionable?: boolean
}

export type TestMember = {
	user: TestUser
	roles?: string[]
	nick?: string | null
	joined_at?: string
}

export type CommandInteractionOptions = {
	id?: string
	token?: string
	guild?: IdInput | null
	channel?: IdInput | null
	user?: IdInput | TestUser
	member?: Partial<TestMember>
	options?:
		| Record<string, string | number | boolean>
		| APIApplicationCommandInteractionDataOption[]
	resolved?: APIInteractionDataResolved
}

export type AutocompleteInteractionOptions = CommandInteractionOptions & {
	focused?: string
}

export type ComponentInteractionOptions = {
	customId?: string
	componentType?: ComponentType
	values?: string[]
	user?: IdInput | TestUser
	guild?: IdInput | null
	channel?: IdInput | null
	message?: APIMessage
}

export type ModalSubmitOptions = {
	customId?: string
	fields?: Record<string, string | string[] | boolean>
	user?: IdInput | TestUser
	guild?: IdInput | null
	channel?: IdInput | null
	message?: APIMessage
	resolved?: APIInteractionDataResolved
}

export type CarbonResponseKind = Extract<
	CarbonTestEvent,
	{ type: "interaction:response" }
>["kind"]

export type RecordedResponse = {
	kind: CarbonResponseKind
	interactionId: string
	body: RESTPostAPIInteractionCallbackJSONBody | MessagePayload | unknown
}

export type InteractionRunResult = {
	interaction: APIInteraction
	responses: RecordedResponse[]
	calls: DiscordCall[]
	reply?: RecordedResponse
	deferred: boolean
	message?: APIMessage
	followups: APIMessage[]
	click: (
		customId?: string,
		options?: ComponentInteractionOptions
	) => Promise<InteractionRunResult>
	submitModal: (
		customId?: string,
		fields?: Record<string, string | string[] | boolean>,
		options?: ModalSubmitOptions
	) => Promise<InteractionRunResult>
}

export type CarbonAssertion = {
	pass: boolean
	message: string
}
