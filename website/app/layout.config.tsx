import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs"
import type { HomeLayoutProps } from "fumadocs-ui/layouts/home"
import { Heart, LayoutTemplateIcon } from "lucide-react"
import Image from "next/image"
import { utils } from "~/app/source"

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
			url: "/even-more/powered-by-carbon",
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
	}
}
