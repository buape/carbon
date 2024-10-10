const isTruthy = (value: string | undefined) =>
	value === "true" || value === "1" || value === "yes" || value === "y"

/**
 * Logs the provided arguments to the console if the DEBUG environment variable is set.
 * @param args The arguments to log to the console.
 */
export const debug = (...args: unknown[]) => {
	if (isTruthy(process.env.DEBUG) || process.env.NODE_ENV === "development")
		console.log(...args)
}
