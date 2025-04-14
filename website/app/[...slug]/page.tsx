import { DocsLayout } from "fumadocs-ui/layouts/docs"
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle
} from "fumadocs-ui/page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { utils } from "~/app/source"
import { useMDXComponents } from "~/components/mdx-components"
import { docsOptions } from "../layout.config"
import { metadataImage } from "../og/[...slug]/metadata"
import { Card, Cards } from "fumadocs-ui/components/card"
import { getPageTreePeers } from "fumadocs-core/server"

type Props = {
	params: Promise<{
		slug: string[]
	}>
}

export default async function Page({ params }: Props) {
	const page = utils.getPage((await params).slug)

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
					{/* @ts-expect-error 2322 Typing doesn't like the namespace but it does work */}
					<page.data.body components={useMDXComponents()} />
					{page.data.index ? (
						<Cards>
							{getPageTreePeers(utils.pageTree, `/${page.slugs.join("/")}`).map(
								(peer) => (
									<Card key={peer.url} title={peer.name} href={peer.url}>
										{peer.description}
									</Card>
								)
							)}
						</Cards>
					) : null}
				</DocsBody>
			</DocsPage>
		</DocsLayout>
	)
}

export function generateStaticParams() {
	return utils.getPages().map((page) => ({
		slug: page.slugs
	}))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const page = utils.getPage((await params).slug)

	if (!page) notFound()

	const description =
		page.data.description ??
		"A modern and powerful framework for building HTTP Discord bots"

	return metadataImage.withImage(page.slugs, {
		title: page.data.title,
		description
	})
}
