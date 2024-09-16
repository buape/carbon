import { RootToggle } from "fumadocs-ui/components/layout/root-toggle"
import type { HomeLayoutProps } from "fumadocs-ui/home-layout"
import type { DocsLayoutProps } from "fumadocs-ui/layout"
import { BookIcon, Heart, LayoutTemplateIcon } from "lucide-react"
import Image from "next/image"
import { utils } from "~/app/source"
import { modes } from "~/modes"

export const baseOptions: HomeLayoutProps = {
	githubUrl: "https://github.com/buape/carbon",
	nav: {
		enableSearch: true,
		title: (
			<>
				<Image
					alt="Carbon"
					src={"https://cdn.buape.com/CarbonWordmark.png"}
					width={100}
					height={100}
					sizes="100px"
					className="hidden w-20 md:w-24 [.uwu_&]:block"
					aria-label="Carbon"
				/>

				<span className="font-medium max-md:[header_&]:hidden">Carbon</span>
			</>
		),
		transparentMode: "top"
	},
	links: [
		{
			text: "Showcase",
			url: "/carbon/even-more/powered-by-carbon",
			icon: <LayoutTemplateIcon />
		},
		{
			text: "Sponsors",
			url: "https://github.com/sponsors/buape",
			icon: <Heart />
		}
	]
}

export const docsOptions: DocsLayoutProps = {
	...baseOptions,
	tree: utils.pageTree,
	nav: {
		...baseOptions.nav,
		transparentMode: "none",
		children: undefined
	},
	sidebar: {
		banner: (
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
}
