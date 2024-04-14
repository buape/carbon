// Credits to Ian Mitchell for this one
// https://discord.com/channels/1110732570766889021/1134159783151272095/1224754425676038224

import pierre from "pierre";

export const label = "Vitest";
export const options = {
	failOnAnnotations: true,
};

export async function Job() {
	const { stdmerged } = await pierre.run("pnpm test -- --reporter json", {
		label: "Run Vitest",
		allowAnyCode: true,
	});

	const lines = stdmerged.split("\n");
	// Get last line (the last last element is a \n)
	const results = JSON.parse(lines[lines.length - 2]);

	if (results.success) {
		return;
	}

	for (const result of results.testResults) {
		if (result.status === "passed") {
			continue;
		}

		for (const assertion of result.assertionResults) {
			pierre.annotate({
				icon: pierre.Icons.CiFailed,
				color: "red",
				filename: result.name,
				line: assertion.location.line,
				label: "Test Failure",
				description: assertion.failureMessages.join("\n"),
			});
		}
	}

	throw new Error("Vitest run unsuccessful.");
}