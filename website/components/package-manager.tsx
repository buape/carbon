import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"

export namespace PackageManager {
	const Managers = //
		["npm", "pnpm", "yarn", "bun"] as const satisfies [string, ...string[]]
	const ManagerInstallCommand = {
		npm: "npm install",
		pnpm: "pnpm install",
		yarn: "yarn install",
		bun: "bun install"
	}
	const ManagerAddCommand = {
		npm: "npm install",
		pnpm: "pnpm add",
		yarn: "yarn add",
		bun: "bun add"
	}
	const ManagerRunCommand = {
		npm: "npm run",
		pnpm: "pnpm run",
		yarn: "yarn run",
		bun: "bun run"
	}
	const ManagerExecuteCommand = {
		npm: "npx",
		pnpm: "pnpm dlx",
		yarn: "yarn dlx",
		bun: "bunx"
	}

	export function Install({
		managers = Managers,
		packages = []
	}: {
		managers?: string[]
		packages?: string[]
	}) {
		const map = packages.length ? ManagerAddCommand : ManagerInstallCommand

		return (
			<Tabs groupId="package-manager" persist items={managers}>
				{managers.map((m) => (
					<Tab key={m} value={m}>
						<CodeBlock allowCopy keepBackground>
							<Pre>{[map[m as never], ...packages].join(" ")}</Pre>
						</CodeBlock>
					</Tab>
				))}
			</Tabs>
		)
	}

	export function Run({
		managers = Managers,
		scripts,
		executor = false
	}: {
		managers?: string[]
		scripts: string[]
		executor?: boolean
	}) {
		const map = executor ? ManagerExecuteCommand : ManagerRunCommand

		return (
			<Tabs groupId="package-manager" persist items={managers}>
				{managers.map((m) => (
					<Tab key={m} value={m}>
						<CodeBlock allowCopy keepBackground>
							<Pre>
								{scripts.map((s) => `${map[m as never]} ${s}`).join("\n")}
							</Pre>
						</CodeBlock>
					</Tab>
				))}
			</Tabs>
		)
	}
}
