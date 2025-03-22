export type DiscordRawError = {
	code?: number
	message: string
	errors?: {
		// biome-ignore lint/suspicious/noExplicitAny: We use any here to allow for many different forms of errors that are checked in the mapper
		[key: string]: any
	}
}

export interface TransformedError {
	code: string
	location?: string
	message: string
}

interface ErrorItem {
	code: string
	message: string
}

export const errorMapper = (data?: DiscordRawError): TransformedError[] => {
	if (!data?.errors) return []
	const result: TransformedError[] = []

	// biome-ignore lint/suspicious/noExplicitAny: We use any here to allow for many different forms of errors that are checked in the mapper
	const traverse = (obj: any, path: string[]): void => {
		if (typeof obj === "object" && obj !== null) {
			if (Array.isArray(obj)) {
				for (let i = 0; i < obj.length; i++) {
					traverse(obj[i], [...path, i.toString()])
				}
			} else {
				for (const [key, value] of Object.entries(obj)) {
					if (key === "_errors") {
						for (const error of value as ErrorItem[]) {
							result.push({
								code: error.code,
								location: path.length > 0 ? path.join(".") : "errors",
								message: error.message
							})
						}
					} else {
						traverse(value, [...path, key])
					}
				}
			}
		}
	}

	traverse(data.errors, [])
	return result
}
