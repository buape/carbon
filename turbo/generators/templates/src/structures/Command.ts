import type { Interaction } from "../classes/Interaction.js"

export abstract class Command {
	abstract name: string
	abstract description: string
	abstract defer: boolean

	abstract run(interaction: Interaction): Promise<void>
}