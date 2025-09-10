import { DocsLayout } from "fumadocs-ui/layouts/docs"
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle
} from "fumadocs-ui/page"
import { Box, Code, FileText, Package } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { apiLinks, baseOptions } from "~/app/layout.config"
import { apiPageTree } from "~/components/api-tree"

export const metadata: Metadata = {
	title: "API Documentation",
	description: "Complete API reference for Carbon framework"
}

const apiSections = [
	{
		title: "Classes",
		description: "Core Carbon classes and components",
		href: "/api/classes",
		icon: <Box className="h-4 w-4" />
	},
	{
		title: "Functions",
		description: "Utility functions and helpers",
		href: "/api/functions",
		icon: <Code className="h-4 w-4" />
	},
	{
		title: "Interfaces",
		description: "TypeScript interfaces and type definitions",
		href: "/api/interfaces",
		icon: <FileText className="h-4 w-4" />
	},
	{
		title: "Type Aliases",
		description: "Custom type definitions and aliases",
		href: "/api/types",
		icon: <FileText className="h-4 w-4" />
	},
	{
		title: "Adapters",
		description: "Platform and runtime adapters",
		href: "/api/adapters",
		icon: <Package className="h-4 w-4" />
	},
	{
		title: "Plugins",
		description: "Carbon plugins and extensions",
		href: "/api/plugins",
		icon: <Package className="h-4 w-4" />
	}
]

export default function ApiPage() {
	return (
		<DocsLayout
			{...baseOptions}
			tree={apiPageTree}
			links={apiLinks}
			nav={{
				...baseOptions.nav,
				transparentMode: "none"
			}}
		>
			<DocsPage toc={[]}>
				<DocsTitle>API Documentation</DocsTitle>
				<DocsDescription>
					Complete API reference for the Carbon framework
				</DocsDescription>
				<DocsBody>
					<div className="prose prose-neutral dark:prose-invert max-w-none">
						<p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
							Browse the complete API documentation for Carbon, including
							classes, functions, interfaces, and more. Click on any section
							below to explore the available APIs.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
							{apiSections.map((section) => (
								<Link
									key={section.href}
									href={section.href}
									className="group block p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200"
								>
									<div className="flex items-start gap-4">
										<div className="flex-shrink-0">{section.icon}</div>
										<div className="flex-1">
											<div className="flex items-center justify-between mb-2">
												<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
													{section.title}
												</h3>
											</div>
											<p className="text-sm text-neutral-600 dark:text-neutral-400">
												{section.description}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</DocsBody>
			</DocsPage>
		</DocsLayout>
	)
}
