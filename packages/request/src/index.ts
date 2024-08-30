export * from "./RequestClient.js"
export * from "./errors/BaseError.js"
export * from "./errors/DiscordError.js"
export * from "./errors/RatelimitError.js"
export * from "./errorsMapper.js"

export type DiscordRawError = {
	code?: number
	message: string
	errors?: {
		// biome-ignore lint/suspicious/noExplicitAny: We use any here to allow for many different forms of errors that are checked in the mapper
		[key: string]: any
	}
}
