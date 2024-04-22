export const Omit = <T, K extends keyof T>(
	Class: new () => T,
	keys: K[]
): (new () => Omit<T, (typeof keys)[number]>) => Class

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// biome-ignore lint/complexity/noBannedTypes: <explanation>
type Constructor<T = {}> = new (..._args: any[]) => T

export const applyMixins = <T>(
	derivedClass: Constructor<T>,
	constructors: Constructor[]
): void => {
	for (const baseCtor of constructors) {
		for (const name of Object.getOwnPropertyNames(baseCtor.prototype)) {
			Object.defineProperty(
				derivedClass.prototype,
				name,
				Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
					Object.create(null)
			)
		}
	}
}

export const splitCustomId = (
	customId: string
): [string, Record<string, string>] => {
	const [id, ...args] = customId.split(":")
	if (!id) throw new Error("Invalid custom ID was provided")
	const data = Object.fromEntries(
		args.map((arg) => {
			const [key, value] = arg.split("=")
			return [key, value]
		})
	)
	return [id, data]
}
