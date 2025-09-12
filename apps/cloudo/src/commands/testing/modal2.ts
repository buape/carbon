import {
	ChannelSelectMenu,
	Command,
	type CommandInteraction,
	Label,
	MentionableSelectMenu,
	Modal,
	type ModalInteraction,
	RoleSelectMenu,
	TextDisplay,
	UserSelectMenu
} from "@buape/carbon"

export default class ModalCommand extends Command {
	name = "modal2"
	description = "Modal test with more components"

	async run(interaction: CommandInteraction) {
		const modal = new TestModal()
		await interaction.showModal(modal)
	}
}

class TestModal extends Modal {
	title = "Test Modal 2"
	customId = "test-modal"

	components = [
		new InfoTextDisplay(),
		new ChannelSelectionLabel(),
		new UserSelectionLabel(),
		new RoleSelectionLabel(),
		new MentionableSelectionLabel()
	]

	async run(interaction: ModalInteraction) {
		const channel = await interaction.fields.getChannelSelect("channel", true)
		const user = interaction.fields.getUserSelect("user", true)
		const role = interaction.fields.getRoleSelect("role", true)
		const mentionable = interaction.fields.getMentionableSelect(
			"mentionable",
			true
		)

		await interaction.reply(
			`You selected:\n- Channel: <#${channel[0]}>\n- User: <@${user[0]}>\n- Role: <@&${role[0]}>\n- Mentionable: ${mentionable.roles.map((role) => `<@&${role.id}>`).join(", ")} ${mentionable.users.map((user) => `<@${user.id}>`).join(", ")}`
		)
	}
}

class InfoTextDisplay extends TextDisplay {
	constructor() {
		super(
			"Please select from the options below to test the different select menu components."
		)
	}
}

class ChannelSelectionLabel extends Label {
	label = "Select a Channel"
	description = "Choose any channel from this server"

	constructor() {
		super(
			new (class extends ChannelSelectMenu {
				customId = "channel"
				required = true
				placeholder = "Choose a channel..."
			})()
		)
	}
}

class UserSelectionLabel extends Label {
	label = "Select a User"
	description = "Choose any user from this server"

	constructor() {
		super(
			new (class extends UserSelectMenu {
				customId = "user"
				required = true
				placeholder = "Choose a user..."
			})()
		)
	}
}

class RoleSelectionLabel extends Label {
	label = "Select a Role"
	description = "Choose any role from this server"

	constructor() {
		super(
			new (class extends RoleSelectMenu {
				customId = "role"
				required = true
				placeholder = "Choose a role..."
			})()
		)
	}
}

class MentionableSelectionLabel extends Label {
	label = "Select Mentionables"
	description = "Choose users and/or roles that can be mentioned"

	constructor() {
		super(
			new (class extends MentionableSelectMenu {
				customId = "mentionable"
				required = true
				maxValues = 3
				minValues = 1
				placeholder = "Choose mentionables..."
			})()
		)
	}
}
