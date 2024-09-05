import { RootToggle } from "fumadocs-ui/components/layout/root-toggle"
import { modes } from "~/modes"

export function Toggle() {
	return (
		<RootToggle
			options={modes.map((mode) => ({
				url: `/${mode.param}`,
				icon: (
					<mode.icon
						className="size-9 shrink-0 rounded-md bg-gradient-to-t from-fd-background/80 p-1.5"
						style={{
							backgroundColor: `hsl(var(--${mode.param}-color)/.3)`,
							color: `hsl(var(--${mode.param}-color))`
						}}
					/>
				),
				title: mode.name,
				description: mode.description
			}))}
		/>
	)
}
