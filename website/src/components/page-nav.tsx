import { Link } from "react-router"
import type { Page } from "@/content/docs-data"

export function PageNav({
	prev,
	next
}: {
	prev: Page | null
	next: Page | null
}) {
	if (!prev && !next) return null

	return (
		<div className="page-nav">
			{prev ? (
				<Link to={`/${prev.slug}`} className="page-nav__card">
					<span className="page-nav__label">Previous</span>
					<span className="page-nav__title">{prev.title}</span>
					{prev.description ? (
						<span className="page-nav__description">{prev.description}</span>
					) : null}
				</Link>
			) : (
				<span />
			)}
			{next ? (
				<Link to={`/${next.slug}`} className="page-nav__card">
					<span className="page-nav__label">Next</span>
					<span className="page-nav__title">{next.title}</span>
					{next.description ? (
						<span className="page-nav__description">{next.description}</span>
					) : null}
				</Link>
			) : (
				<span />
			)}
		</div>
	)
}
