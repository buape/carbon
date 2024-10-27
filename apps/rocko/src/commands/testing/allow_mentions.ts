import { Command, CommandInteraction } from "@buape/carbon";

export default class MentionsCommand extends Command {
    name = "mention"
    description = "Allowed Mentions Test"
    defer = true

    async run(interaction: CommandInteraction) {
        await interaction.reply({content: `<@${interaction.userId}>`, allowedMentions: {parse: []}})
    }
}