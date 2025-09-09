import { DocsLayout } from "fumadocs-ui/layouts/docs"
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle
} from "fumadocs-ui/page"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { apiLinks, docsOptions } from "~/app/layout.config"
import { API_TYPES } from "~/components/api-constants"
import { ApiDocs } from "~/components/api-docs"
import { ApiItemDetail } from "~/components/api-item-detail"
import { apiPageTree } from "~/components/api-tree"

type Props = {
	params: Promise<{
		slug: string[]
	}>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params

	if (slug.length === 1) {
		// Listing page
		const type = slug[0] as keyof typeof API_TYPES
		const config = API_TYPES[type]
		if (!config) return { title: "API Documentation" }

		return {
			title: config.title,
			description: config.description
		}
	}

	if (slug.length === 2) {
		// Detail page
		const [type, itemName] = slug
		const config = API_TYPES[type as keyof typeof API_TYPES]
		if (!config) return { title: "API Documentation" }

		const displayName = itemName.charAt(0).toUpperCase() + itemName.slice(1)
		return {
			title: `${displayName} ${config.singular}`,
			description: `API documentation for the ${displayName} ${config.singular.toLowerCase()} in Carbon framework`
		}
	}

	return { title: "API Documentation" }
}

export default async function CarbonApiPage({ params }: Props) {
	const { slug } = await params

	if (slug.length === 0 || slug.length > 2) {
		notFound()
	}

	const type = slug[0] as keyof typeof API_TYPES
	const config = API_TYPES[type]

	if (!config) {
		notFound()
	}

	// Detail page
	if (slug.length === 2) {
		const itemName = slug[1]

		return (
			<DocsLayout {...docsOptions} tree={apiPageTree} links={apiLinks}>
				<DocsPage toc={[]}>
					<DocsBody>
						<ApiItemDetail itemName={itemName} itemType={config.singular} />
					</DocsBody>
				</DocsPage>
			</DocsLayout>
		)
	}

	// Listing page
	return (
		<DocsLayout {...docsOptions} tree={apiPageTree} links={apiLinks}>
			<DocsPage toc={[]}>
				<div className="mb-6">
					<Link
						href="/api"
						className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to API Documentation
					</Link>
				</div>

				<DocsTitle>{config.title}</DocsTitle>
				<DocsDescription>{config.description}</DocsDescription>
				<DocsBody>
					<div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
						<p>
							{type === "classes" &&
								"Carbon is built upon many sets of classes, that you will extend in your own code, including commands, components, and the Carbon client itself."}
							{type === "functions" &&
								"Utility functions and helper methods available in the Carbon framework."}
							{type === "interfaces" &&
								"TypeScript interfaces that define the shape of objects and contracts in Carbon."}
							{type === "types" &&
								"Custom type aliases and type definitions used throughout the Carbon framework."}
							{type === "adapters" &&
								"Carbon adapters provide compatibility with different runtime environments and platforms."}
							{type === "plugins" &&
								"Official and community plugins that extend Carbon's functionality."}
						</p>
					</div>

					<div className="not-prose">
						{config.filter ? (
							<ApiDocs kindFilter={config.filter} />
						) : (
							<ApiDocs path={type} />
						)}
					</div>
				</DocsBody>
			</DocsPage>
		</DocsLayout>
	)
}
