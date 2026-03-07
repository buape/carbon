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
}

const methodClass = {
	GET: "route-card__method route-card__method--get",
	POST: "route-card__method route-card__method--post",
	PUT: "route-card__method route-card__method--put",
	PATCH: "route-card__method route-card__method--patch",
	DELETE: "route-card__method route-card__method--delete"
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
		<div className="route-card">
			<div className="route-card__header">
				<span className={methodClass[method]}>{method}</span>
				<code className="route-card__path">{path}</code>
				{plugin ? <span className="route-card__plugin">{plugin}</span> : null}
			</div>
			<div className="route-card__details">
				<div>
					<strong>Purpose:</strong>
					<span>{purpose}</span>
				</div>
				<div className="route-card__meta">
					<div>
						<strong>Protected:</strong>
						<span className={isProtected ? "pill pill--danger" : "pill"}>
							{isProtected ? "Yes (deploySecret)" : "No"}
						</span>
					</div>
					<div>
						<strong>Can be disabled:</strong>
						<span className="pill">{disableInfo}</span>
					</div>
				</div>
			</div>
			{description ? (
				<p className="route-card__description">{description}</p>
			) : null}
			{children ? <div className="route-card__body">{children}</div> : null}
		</div>
	)
}
