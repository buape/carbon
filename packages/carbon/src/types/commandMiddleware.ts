import type { Client } from "../classes/Client.js"
import type { Command } from "../classes/Command.js"
import type { CommandInteraction } from "../internals/CommandInteraction.js"

/**
 * Final execution status for a command invocation, passed to middleware `after` hooks.
 */
export type CommandExecutionStatus =
	/** Command `run()` completed successfully. */
	| "success"
	/** A middleware `before` hook returned `false`, so execution was blocked. */
	| "middleware-blocked"
	/** `preCheck()` returned something other than `true`, so execution was skipped. */
	| "precheck-failed"
	/** An error was thrown while executing command lifecycle logic. */
	| "error"

/**
 * Shared context provided to command middleware hooks.
 */
export type CommandMiddlewareBaseContext = {
	/** Carbon client handling the command. */
	client: Client
	/** Resolved command instance being executed (including subcommands). */
	command: Command
	/** Parsed command interaction wrapper for the current invocation. */
	interaction: CommandInteraction
	/** Unix timestamp (milliseconds) captured at command lifecycle start. */
	startedAt: number
}

/**
 * Context for middleware `before` hooks.
 */
export type CommandMiddlewareBeforeContext = CommandMiddlewareBaseContext & {
	/** Middleware phase marker. */
	phase: "before"
	/** Lifecycle status while running pre-execution middleware. */
	status: "running"
}

/**
 * Context for middleware `after` hooks.
 */
export type CommandMiddlewareAfterContext = CommandMiddlewareBaseContext & {
	/** Middleware phase marker. */
	phase: "after"
	/** Final command execution status. */
	status: CommandExecutionStatus
	/** Unix timestamp (milliseconds) captured at command lifecycle end. */
	endedAt: number
	/** Total command lifecycle duration in milliseconds. */
	durationMs: number
	/** Captured error when status is `error`. */
	error?: unknown
}

export type CommandMiddleware = {
	/**
	 * Runs before command execution (`defer`, `preCheck`, and `run`).
	 * Return `false` to block command execution.
	 */
	before?(
		context: Readonly<CommandMiddlewareBeforeContext>
	): boolean | undefined | Promise<boolean | undefined>
	/**
	 * Runs after command execution completes
	 */
	after?(
		context: Readonly<CommandMiddlewareAfterContext>
	): Promise<void> | undefined
}
