import { useEffect, useMemo } from "react"
import { Link, useLocation } from "react-router"
import { docsData } from "@/content/docs-data"
import { Card, Cards } from "./cards"
import { DocLayout } from "./doc-layout"
import { PageNav } from "./page-nav"

const DEFAULT_DESCRIPTION =
	"Carbon is a fully-featured framework for building HTTP Discord bots."

const formatDate = (value?: string) => {
	if (!value) return null
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return null
	return date.toLocaleDateString(undefined, {
		month: "numeric",
		day: "numeric",
		year: "numeric"
	})
}

export function DocPage() {
	const location = useLocation()
	const slug = useMemo(() => {
		const trimmed = location.pathname.replace(/^\/+/, "").replace(/\/$/, "")
		return trimmed
	}, [location.pathname])

	const page = docsData.getPage(slug)

	useEffect(() => {
		if (!page) return
		const description = page.description ?? DEFAULT_DESCRIPTION
		document.title = `${page.title} | Carbon`
		let meta = document.querySelector("meta[name='description']")
		if (!meta) {
			meta = document.createElement("meta")
			meta.setAttribute("name", "description")
			document.head.appendChild(meta)
		}
		meta.setAttribute("content", description)
	}, [page])

	if (!page) {
		return (
			<DocLayout toc={[]}>
				<div className="doc-content">
					<h1>Not Found</h1>
					<p>We couldn’t find that page.</p>
					<Link to={`/${docsData.defaultSlug}`} className="doc-link">
						Go to getting started
					</Link>
				</div>
			</DocLayout>
		)
	}

	const Content = page.component
	const toc = page.toc

	const { prev, next } = docsData.getPrevNext(page.slug)
	const group = docsData.getGroupForPage(page.slug)
	const indexCards = group?.children
		.flatMap((child) => {
			if (child.type === "page") return [child.page]
			return child.indexPage ? [child.indexPage] : []
		})
		.filter((child) => child.slug !== page.slug)

	const editUrl = `https://github.com/buape/carbon/edit/main/website/content/${page.filePath}`
	const lastUpdated = formatDate(page.lastUpdated)

	return (
		<DocLayout toc={toc}>
			<div className="doc-content">
				<header className="doc-header">
					<h1>{page.title}</h1>
					{page.description ? (
						<p className="doc-description">{page.description}</p>
					) : null}
				</header>
				<article className="doc-prose">
					<Content />
					{page.index && indexCards && indexCards.length > 0 ? (
						<Cards>
							{indexCards.map((card) => (
								<Card
									key={card.slug}
									href={`/${card.slug}`}
									title={card.title}
									description={card.description}
								/>
							))}
						</Cards>
					) : null}
				</article>
				<div className="doc-meta">
					<a
						href={editUrl}
						className="doc-meta__link"
						target="_blank"
						rel="noreferrer"
					>
						Edit on GitHub
					</a>
					{lastUpdated ? (
						<span className="doc-meta__updated">
							Last updated on {lastUpdated}
						</span>
					) : null}
				</div>
				<PageNav prev={prev} next={next} />
			</div>
		</DocLayout>
	)
}
