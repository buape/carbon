"use client"

import { ArrowLeft, Box, Code, FileText, Package } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import {
	type TypeDocNode,
	findItemByName,
	formatCommentSummary,
	formatSummary,
	getKindString
} from "./api-constants"

interface ApiItemDetailProps {
	itemName: string
	itemType: string
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

export function ApiItemDetail({ itemName, itemType }: ApiItemDetailProps) {
	const [item, setItem] = useState<TypeDocNode | null>(null)
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

				const data: TypeDocNode = await response.json()

				const foundItem = findItemByName(data, itemName, itemType)
				if (!foundItem) {
					throw new Error(`API item not found: ${itemType} ${itemName}`)
				}

				setItem(foundItem)
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error")
			} finally {
				setLoading(false)
			}
		}

		loadApiData()
	}, [itemName, itemType])

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
					<div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
					<div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
				</div>
			</div>
		)
	}

	if (error || !item) {
		return (
			<div className="space-y-6">
				<Link
					href="/api"
					className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to API Documentation
				</Link>
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
					<h1 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">
						API Item Not Found
					</h1>
					<p className="text-red-600 dark:text-red-400">
						{error || `Could not find ${itemType} "${itemName}"`}
					</p>
				</div>
			</div>
		)
	}

	const kindString = getKindString(item)
	const displayName = item.name.split("/").pop() || item.name

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
				<Link
					href="/api"
					className="hover:text-neutral-900 dark:hover:text-neutral-100"
				>
					API Documentation
				</Link>
				<span>/</span>
				<Link
					href={`/api/${itemType.toLowerCase()}`}
					className="hover:text-neutral-900 dark:hover:text-neutral-100"
				>
					{itemType}
				</Link>
				<span>/</span>
				<span className="text-neutral-900 dark:text-neutral-100">
					{displayName}
				</span>
			</div>

			{/* Header */}
			<div className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
				<div className="flex items-center gap-4 mb-4">
					{getIcon(kindString)}
					<div>
						<h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
							{displayName}
						</h1>
						<div className="flex items-center gap-2 mt-2">
							<span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-sm font-medium rounded">
								{kindString}
							</span>
							{item.flags?.isAbstract && (
								<span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium rounded">
									Abstract
								</span>
							)}
							{item.flags?.isStatic && (
								<span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded">
									Static
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Description */}
				{formatCommentSummary(item.comment) && (
					<p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
						{formatCommentSummary(item.comment)}
					</p>
				)}

				{/* Source information */}
				{item.sources && item.sources.length > 0 && (
					<div className="text-sm text-neutral-500 dark:text-neutral-400">
						<strong>Source:</strong> {item.sources[0].fileName}:
						{item.sources[0].line}
					</div>
				)}
			</div>

			{/* Content sections */}
			<div className="space-y-8">
				{/* Signatures (for functions/methods) */}
				{item.signatures && item.signatures.length > 0 && (
					<section>
						<h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
							Signature
						</h2>
						{item.signatures.map((signature) => (
							<div
								key={`signature-${signature.name}`}
								className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 mb-4"
							>
								<code className="text-sm font-mono text-neutral-800 dark:text-neutral-200">
									{signature.name}
								</code>
								{formatCommentSummary(signature.comment) && (
									<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
										{formatCommentSummary(signature.comment)}
									</p>
								)}

								{/* Parameters */}
								{signature.parameters && signature.parameters.length > 0 && (
									<div className="mt-4">
										<h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-0 mb-0">
											Parameters:
										</h4>
										<ul className="space-y-2">
											{signature.parameters.map((param, paramIndex) => (
												<li
													key={`param-${paramIndex}-${param.name}`}
													className="text-sm"
												>
													<span className="font-mono text-neutral-800 dark:text-neutral-200">
														{param.name}
													</span>
													{formatCommentSummary(param.comment) && (
														<span className="text-neutral-600 dark:text-neutral-400 ml-2">
															- {formatCommentSummary(param.comment)}
														</span>
													)}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						))}
					</section>
				)}

				{/* Children/Members */}
				{item.children && item.children.length > 0 && (
					<section>
						<h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
							{kindString === "Class"
								? "Members"
								: kindString === "Module"
									? "Exports"
									: "Children"}
						</h2>
						<div className="grid gap-3">
							{item.children.map((child) => {
								const childKindString = getKindString(child)
								const childName = child.name.split("/").pop() || child.name

								return (
									<div
										key={child.id}
										className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800/50"
									>
										<div className="flex items-center gap-3 mb-2">
											{getIcon(childKindString)}
											<h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0 mb-0">
												{childName}
											</h4>
											<span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-medium rounded">
												{childKindString}
											</span>
											{child.flags?.isOptional && (
												<span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded">
													Optional
												</span>
											)}
											{child.flags?.isReadonly && (
												<span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded">
													Readonly
												</span>
											)}
										</div>

										{formatCommentSummary(child.comment) && (
											<p className="text-sm text-neutral-600 dark:text-neutral-400">
												{formatCommentSummary(child.comment)}
											</p>
										)}
									</div>
								)
							})}
						</div>
					</section>
				)}
			</div>
		</div>
	)
}
