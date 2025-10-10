import {
	ApplicationCommandOptionType,
	Command,
	type CommandInteraction,
	type CommandOptions
} from "@buape/carbon"

export default class PollCommand extends Command {
	name = "poll"
	description = "Sends a poll to the current channel."

	options: CommandOptions = [
		{
			name: "question",
			type: ApplicationCommandOptionType.String,
			description: "The question for the poll.",
			required: true
		},
		{
			name: "answers",
			type: ApplicationCommandOptionType.String,
			description:
				"Comma-separated list of answers (e.g., Yes,No,Maybe). Max 10 answers, 55 chars each.",
			required: true
		},
		{
			name: "duration",
			type: ApplicationCommandOptionType.Integer,
			description: "Duration of the poll in hours (1-720).",
			required: true,
			min_value: 1,
			max_value: 720
		},
		{
			name: "multiselect",
			type: ApplicationCommandOptionType.Boolean,
			description: "Allow users to select multiple answers? (default: false)",
			required: false
		}
	]

	async run(interaction: CommandInteraction) {
		const questionText = interaction.options.getString("question", true)
		const answersString = interaction.options.getString("answers", true)
		const durationHours = interaction.options.getInteger("duration", true)
		const allowMultiselect =
			interaction.options.getBoolean("multiselect") ?? false

		const answerTexts = answersString
			.split(",")
			.map((a) => a.trim())
			.filter((a) => a.length > 0)

		if (answerTexts.length < 2 || answerTexts.length > 10) {
			return interaction.reply({
				content: "Polls must have between 2 and 10 answers."
			})
		}

		for (const text of answerTexts) {
			if (text.length > 55) {
				return interaction.reply({
					content: `Answers must be 55 characters or less. '${text}' is too long.`
				})
			}
		}

		await interaction.reply({
			poll: {
				question: {
					text: questionText
				},
				answers: answerTexts.map((text) => ({ text })),
				expiry: Date.now() + durationHours * 60 * 60 * 1000,
				allowMultiselect
			}
		})
	}
}
