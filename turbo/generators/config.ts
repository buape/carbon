import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	// create a generator
	plop.setGenerator("package", {
		description: "Creates a new package in the workspace",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "What is the name of the package?",
			},
		],
		actions: [
			// Top Level Files
			{
				type: "add",
				path: "packages/{{name}}/package.json",
				templateFile: "templates/package.json.hbs",
			},
			{
				type: "add",
				path: "packages/{{name}}/tsconfig.json",
				templateFile: "templates/tsconfig.json.hbs",
			},
			{
				type: "add",
				path: "packages/{{name}}/README.md",
				templateFile: "templates/README.md.hbs",
			},

			// Library Files
			{
				type: "add",
				path: "packages/{{name}}/src/index.ts",
				templateFile: "templates/src/index.ts.hbs",
			},

			// Test Files
			{
				type: "add",
				path: "packages/{{name}}/test/index.test.ts",
				templateFile: "templates/test/index.test.ts.hbs",
			},
		],
	});
}