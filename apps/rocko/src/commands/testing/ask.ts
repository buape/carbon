import {
	type Client,
	Command,
	type CommandInteraction,
	type ListenerEventData,
	MessageCreateListener
} from "@buape/carbon"

// Create a class to handle the message response
class MessageResponseHandler extends MessageCreateListener {
	private responsePromise: Promise<string> | null = null
	private resolvePromise: ((value: string) => void) | null = null
	private timeout: NodeJS.Timeout | null = null
	private targetChannelId: string | null = null

	constructor() {
		super()
		this.responsePromise = new Promise((resolve) => {
			this.resolvePromise = resolve
		})
	}

	async handle(data: ListenerEventData[this["type"]], client: Client) {
		console.log("Message received:", {
			channelId: data.message.channelId,
			targetChannelId: this.targetChannelId,
			authorId: data.author.id,
			clientId: client.options.clientId,
			content: data.content
		})

		// Only handle messages in the target channel and not from the bot
		if (
			this.targetChannelId &&
			data.message.channelId === this.targetChannelId &&
			data.author.id !== client.options.clientId
		) {
			// Clear the timeout since we got a response
			if (this.timeout) {
				clearTimeout(this.timeout)
				this.timeout = null
			}

			// Resolve the promise with the message content
			if (this.resolvePromise) {
				this.resolvePromise(data.content)
				this.resolvePromise = null
			}
		}
	}

	// Method to start waiting for a response
	waitForResponse(channelId: string, timeoutMs = 30000): Promise<string> {
		console.log("Waiting for response in channel:", channelId)
		this.targetChannelId = channelId

		// Create a new promise for this response
		this.responsePromise = new Promise((resolve) => {
			this.resolvePromise = resolve

			// Set up timeout
			this.timeout = setTimeout(() => {
				if (this.resolvePromise) {
					this.resolvePromise("No response received")
					this.resolvePromise = null
				}
			}, timeoutMs)
		})

		return this.responsePromise
	}
}

export default class AskCommand extends Command {
	name = "ask"
	description = "Ask a question and wait for a response"

	async run(interaction: CommandInteraction) {
		// Create a new handler instance
		const handler = new MessageResponseHandler()

		// Add the handler to the client's listeners
		interaction.client.registerListener(handler)
		console.log(
			"Added listener, total listeners:",
			interaction.client.listeners.length
		)

		try {
			// Wait for the response first
			const responsePromise = handler.waitForResponse(
				interaction.channel?.id ?? ""
			)

			// Then send the initial message
			await interaction.reply("What's your favorite color?")

			// Wait for the response
			const response = await responsePromise

			// Send the response
			await interaction.followUp(`You said your favorite color is: ${response}`)
		} finally {
			// Remove the handler from listeners
			const index = interaction.client.listeners.indexOf(handler)
			if (index > -1) {
				interaction.client.listeners.splice(index, 1)
				console.log(
					"Removed listener, total listeners:",
					interaction.client.listeners.length
				)
			}
		}
	}
}
