import { expect, test } from "vitest"
import { Command, type Interaction } from "../src"

test("Serializing commands", () => {
	class PingCommand extends Command {
		name = "test"
		description = "test"
		run(_interaction: Interaction): Promise<void> {
			throw new Error("Method not implemented.")
		}
	}

	expect(new PingCommand().serialize()).toEqual({
		name: "test",
		description: "test"
	})
})
