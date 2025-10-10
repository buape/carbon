import {
	ApplicationCommandOptionType,
	type AutocompleteInteraction,
	Command,
	type CommandInteraction,
	CommandWithSubcommands,
	type GuildScheduledEventCreateData
} from "@buape/carbon"

class ScheduledEventList extends Command {
	name = "list"
	description = "List scheduled events in guild"
	ephemeral = true
	defer = false

	async run(interaction: CommandInteraction): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({
				content: "This command can only be used in a guild.",
				ephemeral: false
			})
			return
		}

		const events = await interaction.guild.fetchScheduledEvents()
		if (events.length === 0) {
			await interaction.reply({
				content: "No scheduled events found.",
				ephemeral: false
			})
			return
		}
		const eventList = events
			.map(
				(event) =>
					`**${event.name}** (ID: ${event.id})\n` +
					`- Description: ${event.description || "No description"}\n` +
					`- Start: <t:${Math.floor(new Date(event.scheduledStartTime).getTime() / 1000)}:F>\n` +
					`- End: ${
						event.scheduledEndTime
							? `<t:${Math.floor(new Date(event.scheduledEndTime).getTime() / 1000)}:F>`
							: "No end time"
					}\n` +
					`- Status: ${event.status}\n` +
					`- Type: ${event.entityType}\n` +
					`- Privacy: ${event.privacyLevel}\n` +
					`- User Count: ${event.userCount || 0}\n`
			)
			.join("\n")

		await interaction.reply({
			content: `**Scheduled Events (${events.length}):**\n\n${eventList}`,
			ephemeral: false
		})
	}
}

class ScheduledEventCreate extends Command {
	name = "create"
	description = "Create a scheduled event in a guild"
	ephemeral = true
	defer = false
	options = [
		{
			name: "name",
			description: "The name of the scheduled event",
			type: ApplicationCommandOptionType.String as const,
			required: true
		},
		{
			name: "privacy_level",
			description: "The privacy level of the event",
			type: ApplicationCommandOptionType.String as const,
			required: true,
			choices: [{ name: "Guild Only", value: "2" }]
		},
		{
			name: "entity_type",
			description: "The type of the event",
			type: ApplicationCommandOptionType.String as const,
			required: true,
			choices: [
				{ name: "Stage Instance", value: "1" },
				{ name: "Voice", value: "2" },
				{ name: "External", value: "3" }
			]
		},
		{
			name: "start_time",
			description:
				"When the event starts (ISO 8601 format, e.g., 2025-10-10T20:00:00Z)",
			type: ApplicationCommandOptionType.String as const,
			required: true
		},
		{
			name: "description",
			description: "The description of the scheduled event",
			type: ApplicationCommandOptionType.String as const,
			required: false
		},
		{
			name: "end_time",
			description: "When the event ends (ISO 8601 format, optional)",
			type: ApplicationCommandOptionType.String as const,
			required: false
		},
		{
			name: "channel_id",
			description:
				"The channel ID for the event (required for Stage Instance and Voice)",
			type: ApplicationCommandOptionType.String as const,
			required: false
		},
		{
			name: "location",
			description: "The location for external events",
			type: ApplicationCommandOptionType.String as const,
			required: false
		}
	]

	async run(interaction: CommandInteraction): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({
				content: "This command can only be used in a guild.",
				ephemeral: false
			})
			return
		}

		const name = interaction.options.getString("name", true)
		const description = interaction.options.getString("description")
		const startTime = interaction.options.getString("start_time", true)
		const endTime = interaction.options.getString("end_time")
		const privacyLevel = Number.parseInt(
			interaction.options.getString("privacy_level", true),
			10
		)
		const entityType = Number.parseInt(
			interaction.options.getString("entity_type", true),
			10
		)
		const channelId = interaction.options.getString("channel_id")
		const location = interaction.options.getString("location")

		const startDate = new Date(startTime)
		if (Number.isNaN(startDate.getTime())) {
			await interaction.reply({
				content:
					"Invalid start time format. Please use ISO 8601 format (e.g., 2025-10-10T20:00:00Z).",
				ephemeral: false
			})
			return
		}

		let endDate: Date | null = null
		if (endTime) {
			endDate = new Date(endTime)
			if (Number.isNaN(endDate.getTime())) {
				await interaction.reply({
					content:
						"Invalid end time format. Please use ISO 8601 format (e.g., 2025-10-10T22:00:00Z).",
					ephemeral: false
				})
				return
			}
		}

		if ((entityType === 1 || entityType === 2) && !channelId) {
			await interaction.reply({
				content: "Channel ID is required for Stage Instance and Voice events.",
				ephemeral: false
			})
			return
		}

		if (entityType === 3 && !location) {
			await interaction.reply({
				content: "Location is required for External events.",
				ephemeral: false
			})
			return
		}

		try {
			const eventData: GuildScheduledEventCreateData = {
				name,
				description: description || null,
				scheduledStartTime: startTime,
				scheduledEndTime: endTime || null,
				privacyLevel: privacyLevel,
				entityType: entityType
			}

			if (channelId) {
				eventData.channelId = channelId
			}

			if (entityType === 3 && location) {
				eventData.entityMetadata = { location }
			}

			const event = await interaction.guild.createScheduledEvent(eventData)

			await interaction.reply({
				content:
					`Successfully created scheduled event **${event.name}**!\n` +
					`- ID: ${event.id}\n` +
					`- Start: <t:${Math.floor(new Date(event.scheduledStartTime).getTime() / 1000)}:F>\n` +
					`- End: ${
						event.scheduledEndTime
							? `<t:${Math.floor(new Date(event.scheduledEndTime).getTime() / 1000)}:F>`
							: "No end time"
					}`,
				ephemeral: false
			})
		} catch (error) {
			await interaction.reply({
				content: `Failed to create scheduled event: ${error}`,
				ephemeral: false
			})
		}
	}
}

class ScheduledEventDelete extends Command {
	name = "delete"
	description = "Delete a scheduled event in a guild"
	ephemeral = true
	defer = false
	options = [
		{
			name: "event_id",
			description: "The ID of the scheduled event to delete",
			type: ApplicationCommandOptionType.String as ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true
		}
	]

	async run(interaction: CommandInteraction): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({
				content: "This command can only be used in a guild.",
				ephemeral: false
			})
			return
		}

		const eventId = interaction.options.getString("event_id", true)

		try {
			await interaction.guild.deleteScheduledEvent(eventId)
			await interaction.reply({
				content: `Successfully deleted scheduled event with ID: ${eventId}`,
				ephemeral: false
			})
		} catch (error) {
			await interaction.reply({
				content: `Failed to delete scheduled event: ${error}`,
				ephemeral: false
			})
		}
	}

	async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
		if (!interaction.guild) return

		try {
			const events = await interaction.guild.fetchScheduledEvents()
			const choices = events.map((event) => ({
				name: `${event.name} (${event.id})`,
				value: event.id
			}))

			await interaction.respond(choices.slice(0, 25))
		} catch (_error) {
			await interaction.respond([])
		}
	}
}

class ScheduledEventEdit extends Command {
	name = "edit"
	description = "Edit a scheduled event in a guild"
	ephemeral = true
	defer = false
	options = [
		{
			name: "event_id",
			description: "The ID of the scheduled event to edit",
			type: ApplicationCommandOptionType.String as const,
			required: true,
			autocomplete: true
		},
		{
			name: "name",
			description: "The new name of the scheduled event",
			type: ApplicationCommandOptionType.String as const,
			required: false
		},
		{
			name: "description",
			description: "The new description of the scheduled event",
			type: ApplicationCommandOptionType.String as const,
			required: false
		},
		{
			name: "start_time",
			description: "The new start time (ISO 8601 format)",
			type: ApplicationCommandOptionType.String as const,
			required: false
		},
		{
			name: "end_time",
			description: "The new end time (ISO 8601 format)",
			type: ApplicationCommandOptionType.String as const,
			required: false
		},
		{
			name: "privacy_level",
			description: "The new privacy level of the event",
			type: ApplicationCommandOptionType.String as const,
			required: false,
			choices: [{ name: "Guild Only", value: "2" }]
		},
		{
			name: "entity_type",
			description: "The new type of the event",
			type: ApplicationCommandOptionType.String as const,
			required: false,
			choices: [
				{ name: "Stage Instance", value: "1" },
				{ name: "Voice", value: "2" },
				{ name: "External", value: "3" }
			]
		},
		{
			name: "channel_id",
			description: "The new channel ID for the event (use 'none' to remove)",
			type: ApplicationCommandOptionType.String as const,
			required: false
		},
		{
			name: "location",
			description:
				"The new location for external events (use 'none' to remove)",
			type: ApplicationCommandOptionType.String as const,
			required: false
		}
	]

	async run(interaction: CommandInteraction): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({
				content: "This command can only be used in a guild.",
				ephemeral: false
			})
			return
		}

		const eventId = interaction.options.getString("event_id", true)
		const name = interaction.options.getString("name")
		const description = interaction.options.getString("description")
		const startTime = interaction.options.getString("start_time")
		const endTime = interaction.options.getString("end_time")
		const privacyLevel = interaction.options.getString("privacy_level")
		const entityType = interaction.options.getString("entity_type")
		const channelId = interaction.options.getString("channel_id")
		const location = interaction.options.getString("location")

		if (
			!name &&
			!description &&
			!startTime &&
			!endTime &&
			!privacyLevel &&
			!entityType &&
			!channelId &&
			!location
		) {
			await interaction.reply({
				content: "You must provide at least one field to edit.",
				ephemeral: false
			})
			return
		}

		try {
			const currentEvent = await interaction.guild.fetchScheduledEvent(eventId)
			if (!currentEvent) {
				await interaction.reply({
					content: "Scheduled event not found.",
					ephemeral: false
				})
				return
			}

			const updateData: GuildScheduledEventCreateData = {
				name: currentEvent.name,
				scheduledStartTime: currentEvent.scheduledStartTime,
				privacyLevel: currentEvent.privacyLevel,
				entityType: currentEvent.entityType
			}

			if (name) updateData.name = name
			if (description !== null) updateData.description = description

			if (startTime) {
				const startDate = new Date(startTime)
				if (Number.isNaN(startDate.getTime())) {
					await interaction.reply({
						content:
							"Invalid start time format. Please use ISO 8601 format (e.g., 2025-10-10T20:00:00Z).",
						ephemeral: false
					})
					return
				}
				updateData.scheduledStartTime = startTime
			}

			if (endTime !== null && endTime !== undefined) {
				if (endTime === "none") {
					updateData.scheduledEndTime = null
				} else {
					const endDate = new Date(endTime)
					if (Number.isNaN(endDate.getTime())) {
						await interaction.reply({
							content:
								"Invalid end time format. Please use ISO 8601 format (e.g., 2025-10-10T22:00:00Z) or 'none' to remove.",
							ephemeral: false
						})
						return
					}
					updateData.scheduledEndTime = endTime
				}
			}

			if (privacyLevel)
				updateData.privacyLevel = Number.parseInt(privacyLevel, 10)
			if (entityType) updateData.entityType = Number.parseInt(entityType, 10)

			if (channelId !== null) {
				if (channelId === "none") {
					updateData.channelId = null
				} else {
					updateData.channelId = channelId
				}
			}

			if (location !== null) {
				if (location === "none") {
					updateData.entityMetadata = null
				} else {
					updateData.entityMetadata = { location }
				}
			}

			const updatedEvent = await interaction.guild.editScheduledEvent(
				eventId,
				updateData
			)

			await interaction.reply({
				content:
					`Successfully updated scheduled event **${updatedEvent.name}**!\n` +
					`- ID: ${updatedEvent.id}\n` +
					`- Start: <t:${Math.floor(new Date(updatedEvent.scheduledStartTime).getTime() / 1000)}:F>\n` +
					`- End: ${
						updatedEvent.scheduledEndTime
							? `<t:${Math.floor(new Date(updatedEvent.scheduledEndTime).getTime() / 1000)}:F>`
							: "No end time"
					}\n` +
					`- Status: ${updatedEvent.status}\n` +
					`- Type: ${updatedEvent.entityType}\n` +
					`- Privacy: ${updatedEvent.privacyLevel}`,
				ephemeral: false
			})
		} catch (error) {
			if (!(error instanceof Error)) {
				console.error("Unknown error editing scheduled event:", error)
				await interaction.reply({
					content:
						"An unknown error occurred while editing the scheduled event.",
					ephemeral: false
				})
				return
			}
			await interaction.reply({
				content: `Failed to edit scheduled event: ${error.message}`,
				ephemeral: false
			})
			console.error("Error editing scheduled event:", error)
		}
	}

	async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
		if (!interaction.guild) return

		try {
			const events = await interaction.guild.fetchScheduledEvents()
			const choices = events.map((event) => ({
				name: `${event.name} (${event.id})`,
				value: event.id
			}))

			await interaction.respond(choices.slice(0, 25))
		} catch (_error) {
			await interaction.respond([])
		}
	}
}

export default class ScheduledEventCommand extends CommandWithSubcommands {
	name = "scheduled-events"
	description = "Manage scheduled events in the guild"
	ephemeral = true

	subcommands = [
		new ScheduledEventList(),
		new ScheduledEventCreate(),
		new ScheduledEventEdit(),
		new ScheduledEventDelete()
	]
}
