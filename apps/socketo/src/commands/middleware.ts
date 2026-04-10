import {
	Command,
	type CommandInteraction,
	type CommandMiddleware
} from "@buape/carbon"

const localMiddleware = {
	before(context) {
		console.log(
			`[socketo/local-before] /${context.command.name} user=${context.interaction.userId ?? "unknown"}`
		)
	},
	after(context) {
		console.log(
			`[socketo/local-after] /${context.command.name} status=${context.status} duration=${context.durationMs}ms`
		)
	}
} satisfies CommandMiddleware

export default class MiddlewareCommand extends Command {
	name = "middleware"
	description = "Test command middleware hooks in socketo"
	middlewares = [localMiddleware]

	async run(interaction: CommandInteraction) {
		await interaction.reply("Socketo middleware command executed")
	}
}
