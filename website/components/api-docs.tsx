"use client"

import { Box, Code, FileText, Package } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
	collectItemsByKind,
	formatCommentSummary,
	generateApiUrl,
	getKindString,
	type TypeDocNode
} from "./api-constants"

interface ApiDocsProps {
	/**
	 * The path to the specific API item to display
	 * e.g., "plugins/gateway" or "adapters/node"
	 */
	path?: string
	/**
	 * Whether to show only the children/members of the specified path
	 */
	childrenOnly?: boolean
	/**
	 * Filter by kind (e.g., "Class", "Function", "Interface")
	 */
	kindFilter?: string[]
}

function findNodeByPath(
	root: TypeDocNode,
	pathSegments: string[]
): TypeDocNode | null {
	if (pathSegments.length === 0) return root

	const [first, ...rest] = pathSegments

	if (first === "plugins" || first === "adapters") {
		const section = root.children?.find(
			(child) =>
				child.name.toLowerCase().includes(first.slice(0, -1)) ||
				child.kindString === "Module"
		)

		if (!section && rest.length === 0) {
			return {
				id: -1,
				name: first,
				kind: 1,
				kindString: "Module",
				children:
					root.children?.filter((child) =>
						child.name.includes(first.slice(0, -1))
					) || []
			}
		}

		if (rest.length > 0) {
			const target = rest[0]
			const found = root.children?.find(
				(child) =>
					child.name.includes(target) || child.name.endsWith(`/${target}`)
			)
			return found || null
		}

		return section || null
	}

	const found = root.children?.find(
		(child) =>
			child.name === first ||
			child.name.endsWith(`/${first}`) ||
			child.name.includes(first)
	)

	if (!found) return null
	if (rest.length === 0) return found

	return findNodeByPath(found, rest)
}

function getIcon(kindString: string) {
	switch (kindString) {
		case "Module":
			return <Package className="h-4 w-4 text-blue-500 dark:text-blue-400" />
		case "Class":
			return <Box className="h-4 w-4 text-green-500 dark:text-green-400" />
		case "Function":
			return <Code className="h-4 w-4 text-purple-500 dark:text-purple-400" />
		case "Interface":
			return (
				<FileText className="h-4 w-4 text-orange-500 dark:text-orange-400" />
			)
		case "TypeAlias":
			return <FileText className="h-4 w-4 text-red-500 dark:text-red-400" />
		default:
			return (
				<FileText className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
			)
	}
}

export function ApiDocs({
	path,
	childrenOnly = false,
	kindFilter
}: ApiDocsProps) {
	const [docData, setDocData] = useState<TypeDocNode | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function loadApiData() {
			try {
				setLoading(true)
				setError(null)

				const response = await fetch("/api.json")
				if (!response.ok) {
					throw new Error(`Failed to load API data: ${response.status}`)
				}

				const apiData: TypeDocNode = await response.json()

				if (!path) {
					setDocData(apiData)
				} else {
					const pathSegments = path.split("/").filter(Boolean)
					const node = findNodeByPath(apiData, pathSegments)

					if (!node) {
						throw new Error(`API documentation not found for path: ${path}`)
					}

					setDocData(node)
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error")
			} finally {
				setLoading(false)
			}
		}

		loadApiData()
	}, [path])

	if (loading) {
		return (
			<div className="space-y-4">
				<div className="animate-pulse space-y-2">
					<div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
					<div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
					<div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
				<h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
					Error Loading API Documentation
				</h3>
				<p className="text-red-600 dark:text-red-400">{error}</p>
			</div>
		)
	}

	if (!docData) {
		return (
			<div className="text-center text-neutral-500 dark:text-neutral-400 py-8">
				<p>No API documentation found</p>
			</div>
		)
	}

	let items: TypeDocNode[] = []

	if (kindFilter && kindFilter.length > 0) {
		// When filtering by kind, recursively search through all nodes
		items = collectItemsByKind(docData, kindFilter)
	} else {
		// Otherwise, just show direct children
		items = docData.children || []
	}

	if (childrenOnly) {
		return <ApiItemsList items={items} />
	}

	// Just show the items without any header
	return <ApiItemsList items={items} />
}

function ApiItemsList({ items }: { items: TypeDocNode[] }) {
	const router = useRouter()

	if (items.length === 0) {
		return (
			<div className="text-neutral-500 dark:text-neutral-400 italic">
				No items found
			</div>
		)
	}

	const handleItemClick = (item: TypeDocNode) => {
		const kindString = getKindString(item)
		const url = generateApiUrl(kindString, item.name)
		router.push(url)
	}

	return (
		<div className="grid gap-3">
			{items.map((item) => {
				const kindString = getKindString(item)
				return (
					<button
						key={item.id}
						type="button"
						onClick={() => handleItemClick(item)}
						aria-label={`View ${kindString} ${item.name}`}
						className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left w-full"
					>
						<div className="flex items-center gap-3 mb-2">
							{getIcon(kindString)}
							<h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0 mb-0">
								{kindString === "Module"
									? item.name
											.split("/")
											.pop()
											?.replace(/\b\w/g, (char) => char.toUpperCase())
											.replaceAll("-", " ")
									: item.name.split("/").pop() || item.name}
							</h4>
							<span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-medium rounded">
								{kindString}
							</span>
						</div>

						{formatCommentSummary(item.comment) && (
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								{formatCommentSummary(item.comment)}
							</p>
						)}
					</button>
				)
			})}
		</div>
	)
}
