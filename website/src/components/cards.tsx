import type { ReactNode } from "react"
import { Link } from "react-router"

const isExternal = (href?: string) =>
	!!href && (href.startsWith("http://") || href.startsWith("https://"))

export function Cards({ children }: { children: ReactNode }) {
	return <div className="card-grid">{children}</div>
}

export function Card({
	href,
	title,
	description,
	icon,
	children
}: {
	href?: string
	title: string
	description?: string
	icon?: ReactNode
	children?: ReactNode
}) {
	const content = (
		<>
			{icon ? <span className="card-icon">{icon}</span> : null}
			<div className="card-body">
				<h3 className="card-title">{title}</h3>
				{description ? <p className="card-description">{description}</p> : null}
				{children}
			</div>
		</>
	)

	if (!href) {
		return <div className="card">{content}</div>
	}

	if (href.startsWith("/")) {
		return (
			<Link className="card card-link" to={href}>
				{content}
			</Link>
		)
	}

	return (
		<a
			className="card card-link"
			href={href}
			rel={isExternal(href) ? "noreferrer" : undefined}
			target={isExternal(href) ? "_blank" : undefined}
		>
			{content}
		</a>
	)
}
