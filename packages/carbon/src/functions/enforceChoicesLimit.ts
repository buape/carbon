// Utility to enforce the 25-item limit on choices in options (recursively)
import type { APIApplicationCommandBasicOption } from "discord-api-types/v10"

export function enforceChoicesLimit(
	options?: APIApplicationCommandBasicOption[]
): APIApplicationCommandBasicOption[] | undefined {
	if (!options) return options
	return options.map((option) => {
		const newOption: APIApplicationCommandBasicOption & {
			options?: APIApplicationCommandBasicOption[]
			choices?: { name: string; value: string | number }[]
		} = { ...option }
		if (Array.isArray(newOption.choices) && newOption.choices.length > 25) {
			console.warn(
				`[Carbon] Command option '${newOption.name}' has ${newOption.choices.length} choices. Only the first 25 will be sent.`
			)
			newOption.choices = newOption.choices.slice(0, 25)
		}
		// Recursively handle sub-options for subcommands/groups
		if (Array.isArray(newOption.options)) {
			newOption.options = enforceChoicesLimit(newOption.options)
		}
		return newOption
	})
}
