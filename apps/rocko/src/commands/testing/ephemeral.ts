import {
	ApplicationCommandOptionType,
	Command,
	type CommandInteraction,
	CommandWithSubcommands
} from "@buape/carbon"

class EphemeralNoDefer extends Command {
	name = "no-defer"
	description = "Ephemeral test"
	ephemeral = true
	defer = false

	async run(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({ content: "Ephemeral no defer" })
	}
}

class EphemeralDefer extends Command {
	name = "defer"
	description = "Ephemeral test"
	ephemeral = true
	defer = true

	async run(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({ content: "Ephemeral defer" })
	}
}

class ConditionalEphemeral extends Command {
	name = "conditional"
	description =
		"Conditional ephemeral test - ephemeral only if user is mentioned"

	options = [
		{
			type: ApplicationCommandOptionType.User as const,
			name: "user",
			description: "User to send message to (makes command ephemeral)",
			required: false
		}
	]

	ephemeral = (interaction: CommandInteraction) => {
		const user = interaction.options.getUser("user")
		return user !== null
	}

	defer = (interaction: CommandInteraction) => {
		const user = interaction.options.getUser("user")
		return user !== null
	}

	async run(interaction: CommandInteraction): Promise<void> {
		const user = interaction.options.getUser("user")

		if (user) {
			await interaction.reply({
				content: `Hello <@${user.id}>! This message was sent ephemerally because you were mentioned.`,
				allowedMentions: { users: [user.id] }
			})
		} else {
			await interaction.reply({
				content: "Hello everyone! This is a public message."
			})
		}
	}
}

export default class EphemeralCommand extends CommandWithSubcommands {
	name = "ephemeral"
	description = "Ephemeral test"
	ephemeral = true

	subcommands = [
		new EphemeralNoDefer(),
		new EphemeralDefer(),
		new ConditionalEphemeral()
	]
}
