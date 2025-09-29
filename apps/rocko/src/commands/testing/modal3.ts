import {
	Command,
	type CommandInteraction,
	FileUpload,
	Label,
	Modal,
	type ModalInteraction
} from "@buape/carbon"

export default class ModalCommand extends Command {
	name = "modal3"
	description = "Modal test with file upload"

	async run(interaction: CommandInteraction) {
		const modal = new TestModal()
		await interaction.showModal(modal)
	}
}

class TestModal extends Modal {
	title = "Test Modal 3"
	customId = "test-modal"

	components = [new FileUploadLabel(), new FileUploadMultipleLabel()]

	async run(interaction: ModalInteraction) {
		const singleFile = interaction.fields.getFileUpload("file", true)
		const multipleFiles = interaction.fields.getFileUpload("files", true)

		await interaction.reply(
			`You selected:\n- Single File: ${singleFile[0].url}\n- Multiple Files: ${multipleFiles.map((file) => file.url).join(", ")}	`
		)
	}
}

class FileUploadLabel extends Label {
	label = "Upload a File"
	description = "Upload a file to the server"

	constructor() {
		super(
			new (class extends FileUpload {
				customId = "file"
				required = true
			})()
		)
	}
}

class FileUploadMultipleLabel extends Label {
	label = "Upload Multiple Files"
	description = "Upload multiple files to the server"

	constructor() {
		super(
			new (class extends FileUpload {
				customId = "files"
				required = true
				maxValues = 3
			})()
		)
	}
}
