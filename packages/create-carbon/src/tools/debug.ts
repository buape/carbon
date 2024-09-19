export const debug = (...args: unknown[]) => {
	if (process.env.DEBUG) console.log(...args)
}
