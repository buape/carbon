/**
 * Logger used by Carbon internals.
 * Methods receive the same arguments Carbon would pass to the matching console method.
 */
export type Logger = {
	/** Log debug-level diagnostic messages. */
	debug: (...data: unknown[]) => void
	/** Log informational messages. */
	info: (...data: unknown[]) => void
	/** Log warnings that do not stop execution. */
	warn: (...data: unknown[]) => void
	/** Log errors caught by Carbon internals. */
	error: (...data: unknown[]) => void
}

/**
 * Partial logger override. Missing methods fall back to Carbon's default console logger.
 */
export type LoggerOptions = Partial<Logger>

/**
 * Carbon's default logger. It writes to console and prefixes messages with `[Carbon]`.
 */
export const defaultLogger: Logger = {
	debug: (...data) => console.debug("[Carbon]", ...data),
	info: (...data) => console.info("[Carbon]", ...data),
	warn: (...data) => console.warn("[Carbon]", ...data),
	error: (...data) => console.error("[Carbon]", ...data)
}

/**
 * Resolve a partial logger into a complete logger.
 */
export const resolveLogger = (logger?: LoggerOptions): Logger => ({
	...defaultLogger,
	...logger
})
