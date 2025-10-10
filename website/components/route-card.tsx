import type { ReactNode } from "react"

interface RouteCardProps {
	path: string
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
	purpose: string
	protected?: boolean
	canBeDisabled?: boolean | string
	plugin?: string
	description?: string
	children?: ReactNode
	codeExample?: string
}

const methodColors = {
	GET: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
	POST: "bg-green-500/10 text-green-600 border border-green-500/20",
	PUT: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
	PATCH: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
	DELETE: "bg-red-500/10 text-red-600 border border-red-500/20"
} as const

export function RouteCard({
	path,
	method,
	purpose,
	protected: isProtected,
	canBeDisabled,
	plugin,
	description,
	children
}: RouteCardProps) {
	const disableInfo =
		typeof canBeDisabled === "string"
			? canBeDisabled
			: canBeDisabled
				? "Yes"
				: "No"

	return (
		<div className="border rounded-lg p-6 mb-6 bg-neutral-50 dark:bg-neutral-950">
			<div className="flex items-center gap-3 mb-4 flex-wrap">
				<span
					className={`font-mono font-bold px-2 rounded text-sm ${methodColors[method]}`}
				>
					{method}
				</span>
				<code className="text-lg font-semibold bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded">
					{path}
				</code>
				{plugin && (
					<span className="text-xs bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded border">
						{plugin}
					</span>
				)}
			</div>

			<div className="space-y-3 mb-4">
				<div>
					<strong className="text-sm text-neutral-600 dark:text-neutral-400">
						Purpose:
					</strong>
					<span className="ml-2">{purpose}</span>
				</div>

				<div className="flex flex-row gap-4 text-sm">
					<div className="grow">
						<strong className="text-neutral-600 dark:text-neutral-400">
							Protected:
						</strong>
						<span className="ml-2">
							{isProtected ? (
								<span className="text-xs bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded border border-red-500/20">
									Yes (requires deploySecret)
								</span>
							) : (
								<span className="text-xs bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded border">
									No
								</span>
							)}
						</span>
					</div>

					<div className="grow">
						<strong className="text-neutral-600 dark:text-neutral-400">
							Can be disabled:
						</strong>
						<span className="ml-2">
							{canBeDisabled ? (
								<span className="text-xs bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded border">
									{disableInfo}
								</span>
							) : (
								<span className="text-xs bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded border">
									No
								</span>
							)}
						</span>
					</div>
				</div>
			</div>

			{description && (
				<p className="text-neutral-600 dark:text-neutral-400 mb-4">
					{description}
				</p>
			)}

			{children && <div className="mb-4">{children}</div>}
		</div>
	)
}
