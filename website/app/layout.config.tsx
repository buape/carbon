import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs"
import type { HomeLayoutProps } from "fumadocs-ui/layouts/home"
import { ArrowLeft, Book, Heart, LayoutTemplateIcon } from "lucide-react"
import Image from "next/image"
import { source } from "~/app/source"

export const baseLinks = [
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

export const mainLinks = [
	{
		text: "API Reference",
		url: "/api",
		icon: <Book />
	},
	...baseLinks
]

export const apiLinks = [
	{
		text: "Back to Docs",
		url: "/",
		icon: <ArrowLeft />
	},
	...baseLinks
]

export const baseOptions: HomeLayoutProps = {
	githubUrl: "https://github.com/buape/carbon",
	nav: {
		title: (
			<>
				<Image
					alt="Carbon"
					src={"https://cdn.buape.com/carbon/wordmark.png"}
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
	links: mainLinks
}

export const docsOptions: DocsLayoutProps = {
	...baseOptions,
	tree: source.pageTree,
	nav: {
		...baseOptions.nav,
		transparentMode: "none",
		children: undefined
	}
}
