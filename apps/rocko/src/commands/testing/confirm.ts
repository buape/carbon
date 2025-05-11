import {
	Button,
	type ButtonInteraction,
	ButtonStyle,
	Command,
	type CommandInteraction,
	Row
} from "@buape/carbon"

export default class ConfirmCommand extends Command {
	name = "confirm"
	description = "Confirm a message"
	async run(interaction: CommandInteraction) {
		const done = await interaction.replyAndWaitForComponent({
			content: "Confirm the message",
			components: [
				new Row([
					new (class extends Button {
						label = "Confirm"
						style = ButtonStyle.Success
						customId = "x-confirm"
						async run(interaction: ButtonInteraction) {
							return interaction.acknowledge()
						}
					})(),
					new (class extends Button {
						label = "Cancel"
						style = ButtonStyle.Danger
						customId = "x-cancel"
						async run(interaction: ButtonInteraction) {
							return interaction.acknowledge()
						}
					})()
				])
			]
		})
		if (done.success) {
			await interaction.message?.disableAllButtons()
			interaction.followUp({
				content: `Confirmed: ${done.customId}`
			})
		} else {
			await interaction.message?.disableAllButtons()
			interaction.followUp({
				content: done.reason
			})
		}
	}
}
