import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"

const DEFAULT_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const

const INSTALL_COMMAND = {
	npm: "npm install",
	pnpm: "pnpm install",
	yarn: "yarn install",
	bun: "bun install"
}

const ADD_COMMAND = {
	npm: "npm install",
	pnpm: "pnpm add",
	yarn: "yarn add",
	bun: "bun add"
}

const RUN_COMMAND = {
	npm: "npm run",
	pnpm: "pnpm run",
	yarn: "yarn run",
	bun: "bun run"
}

const EXEC_COMMAND = {
	npm: "npx",
	pnpm: "pnpm dlx",
	yarn: "yarn dlx",
	bun: "bunx"
}

const useStoredManager = (managers: string[]) => {
	const fallback = managers[0] ?? "npm"
	const [value, setValue] = useState(fallback)

	useEffect(() => {
		const stored = window.localStorage.getItem("carbon-docs-package-manager")
		if (stored && managers.includes(stored)) {
			setValue(stored)
		}
	}, [managers])

	useEffect(() => {
		window.localStorage.setItem("carbon-docs-package-manager", value)
	}, [value])

	return [value, setValue] as const
}

const Tabs = ({
	items,
	active,
	setActive
}: {
	items: string[]
	active: string
	setActive: (value: string) => void
}) => (
	<div className="tabs">
		<div className="tabs-list">
			{items.map((item) => (
				<button
					key={item}
					type="button"
					className={`tabs-trigger${active === item ? " is-active" : ""}`}
					onClick={() => setActive(item)}
				>
					{item}
				</button>
			))}
		</div>
	</div>
)

const TabPanel = ({ children }: { children: ReactNode }) => (
	<div className="tabs-panel">
		<pre>
			<code>{children}</code>
		</pre>
	</div>
)

export namespace PackageManager {
	export function Install({
		managers = DEFAULT_MANAGERS,
		packages = []
	}: {
		managers?: string[]
		packages?: string[]
	}) {
		const [active, setActive] = useStoredManager(managers)
		const commandMap = packages.length ? ADD_COMMAND : INSTALL_COMMAND
		const command = useMemo(() => {
			const prefix =
				commandMap[active as keyof typeof commandMap] ?? "npm install"
			return `${prefix} ${packages.join(" ")}`.trim()
		}, [active, packages, commandMap])

		return (
			<div className="package-manager">
				<Tabs items={managers} active={active} setActive={setActive} />
				<TabPanel>{command}</TabPanel>
			</div>
		)
	}

	export function Run({
		managers = DEFAULT_MANAGERS,
		scripts,
		executor = false
	}: {
		managers?: string[]
		scripts: string[]
		executor?: boolean
	}) {
		const [active, setActive] = useStoredManager(managers)
		const commandMap = executor ? EXEC_COMMAND : RUN_COMMAND
		const command = useMemo(() => {
			const prefix = commandMap[active as keyof typeof commandMap] ?? "npm run"
			return scripts.map((script) => `${prefix} ${script}`).join("\n")
		}, [active, scripts, commandMap])

		return (
			<div className="package-manager">
				<Tabs items={managers} active={active} setActive={setActive} />
				<TabPanel>{command}</TabPanel>
			</div>
		)
	}
}
