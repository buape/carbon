import { DocsLayout } from "fumadocs-ui/layout"
import { getImageMeta } from "fumadocs-ui/og"
import {
	DocsBody,
	DocsCategory,
	DocsDescription,
	DocsPage,
	DocsTitle
} from "fumadocs-ui/page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactElement } from "react"
import { utils } from "~/app/source"
import { useMDXComponents } from "~/mdx-components"
import { docsOptions } from "../layout.config"
import { createMetadata } from "../og/[...slug]/metadata"

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

export function generateMetadata({ params }: { params: Param }): Metadata {
	const page = utils.getPage(params.slug)

	if (!page) notFound()

	const description =
		page.data.description ??
		"A modern and powerful framework for building HTTP Discord bots"

	const image = getImageMeta("og", page.slugs)

	return createMetadata({
		title: page.data.title,
		description,
		openGraph: {
			url: `/${page.slugs.join("/")}`,
			images: image
		},
		twitter: {
			images: image
		}
	})
}
