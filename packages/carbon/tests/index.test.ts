import { expect, test } from "vitest"
import { Command } from "../src"

test("Serializing commands", () => {
	class PingCommand extends Command {
		name = "test"
		description = "test"
		run(_interaction: unknown): Promise<void> {
			throw new Error("Method not implemented.")
		}
	}

	expect(new PingCommand().serialize()).toEqual({
		name: "test",
		description: "test"
	})
})
