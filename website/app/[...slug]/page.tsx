import {
	DocsPage,
	DocsBody,
	DocsTitle,
	DocsDescription,
	DocsCategory
} from "fumadocs-ui/page"
import { notFound } from "next/navigation"
import { utils } from "~/app/source"
import { useMDXComponents } from "~/mdx-components"
import type { ReactElement } from "react"
import { DocsLayout } from "fumadocs-ui/layout"
import { Toggle } from "./toggle"
import { baseOptions, docsOptions } from "../layout.config"

interface Param {
	slug: string[]
}

export default function Page({
	params
}: {
	params: Param
}): ReactElement {
	const page = utils.getPage(params.slug)

	if (!page) notFound()

	const path = `website/content/${page.file.path}`

	return (
		<DocsLayout {...docsOptions}>
			<DocsPage
				toc={page.data.toc.filter((x) => x.depth <= 3)}
				lastUpdate={page.data.lastModified}
				full={page.data.full}
				editOnGithub={{
					repo: "carbon",
					owner: "buape",
					sha: "main",
					path
				}}
			>
				<DocsTitle>{page.data.title}</DocsTitle>
				<DocsDescription>{page.data.description}</DocsDescription>
				<DocsBody>
					<page.data.body components={useMDXComponents()} />
					{page.data.index ? (
						<DocsCategory page={page} pages={utils.getPages()} />
					) : null}
				</DocsBody>
			</DocsPage>
		</DocsLayout>
	)
}

export function generateStaticParams(): Param[] {
	return utils.getPages().map((page) => ({
		slug: page.slugs
	}))
}
