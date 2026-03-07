import { useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router"
import {
	API_SECTIONS,
	type ApiSection,
	collectItemsByKind,
	collectModulesByPath,
	formatSummary,
	getKindString,
	type TypeDocNode
} from "./api-utils"
import { Card, Cards } from "./cards"
import { DocLayout } from "./doc-layout"

const findSection = (id?: string) =>
	API_SECTIONS.find((section) => section.id === id)

const getItemsForSection = (section: ApiSection, root: TypeDocNode) => {
	if (section.filter) return collectItemsByKind(root, section.filter)
	if (section.pathPrefix) return collectModulesByPath(root, section.pathPrefix)
	return []
}

export function ApiPage() {
	const location = useLocation()
	const [apiData, setApiData] = useState<TypeDocNode | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let mounted = true
		fetch("/api.json")
			.then((response) => {
				if (!response.ok) throw new Error("Failed to load api.json")
				return response.json()
			})
			.then((data) => {
				if (mounted) setApiData(data)
			})
			.catch((err) => {
				if (mounted)
					setError(err instanceof Error ? err.message : "Unknown error")
			})

		return () => {
			mounted = false
		}
	}, [])

	const segments = useMemo(() => {
		const trimmed = location.pathname.replace(/^\/api\/?/, "")
		return trimmed.split("/").filter(Boolean)
	}, [location.pathname])

	const section = findSection(segments[0])

	useEffect(() => {
		let title = "API Reference"
		let description = "Browse Carbon classes, functions, adapters, and plugins."
		if (section) {
			title = section.title
			description = section.description
		}
		if (section && segments[1]) {
			title = `${segments[1]} · ${section.title}`
		}
		document.title = `${title} | Carbon`
		let meta = document.querySelector("meta[name='description']")
		if (!meta) {
			meta = document.createElement("meta")
			meta.setAttribute("name", "description")
			document.head.appendChild(meta)
		}
		meta.setAttribute("content", description)
	}, [section, segments])

	const items = useMemo(() => {
		if (!apiData || !section) return []
		return getItemsForSection(section, apiData).sort((a, b) =>
			(a.name.split("/").pop() ?? a.name).localeCompare(
				b.name.split("/").pop() ?? b.name
			)
		)
	}, [apiData, section])

	const selected = useMemo(() => {
		if (!section || !segments[1]) return null
		const target = decodeURIComponent(segments[1]).toLowerCase()
		return items.find((item) => {
			const name = item.name.split("/").pop() ?? item.name
			return name.toLowerCase() === target
		})
	}, [items, section, segments])

	if (error) {
		return (
			<DocLayout toc={[]}>
				<div className="doc-content">
					<h1>API Reference</h1>
					<p className="doc-description">{error}</p>
				</div>
			</DocLayout>
		)
	}

	if (!apiData) {
		return (
			<DocLayout toc={[]}>
				<div className="doc-content">
					<h1>API Reference</h1>
					<p className="doc-description">Loading API documentation…</p>
				</div>
			</DocLayout>
		)
	}

	if (!section) {
		return (
			<DocLayout toc={[]}>
				<div className="doc-content">
					<header className="doc-header">
						<h1>API Reference</h1>
						<p className="doc-description">
							Browse Carbon classes, functions, adapters, and plugins.
						</p>
					</header>
					<Cards>
						{API_SECTIONS.map((sectionInfo) => {
							const count = getItemsForSection(sectionInfo, apiData).length
							return (
								<Card
									key={sectionInfo.id}
									href={`/api/${sectionInfo.id}`}
									title={sectionInfo.title}
									description={`${sectionInfo.description} · ${count} items`}
								/>
							)
						})}
					</Cards>
				</div>
			</DocLayout>
		)
	}

	if (!segments[1]) {
		return (
			<DocLayout toc={[]}>
				<div className="doc-content">
					<header className="doc-header">
						<h1>{section.title}</h1>
						<p className="doc-description">{section.description}</p>
					</header>
					<div className="api-list">
						{items.map((item) => {
							const name = item.name.split("/").pop() ?? item.name
							return (
								<Link
									key={item.id}
									to={`/api/${section.id}/${encodeURIComponent(name)}`}
									className="api-list__item"
								>
									<div>
										<span className="api-list__name">{name}</span>
										<span className="api-list__kind">
											{getKindString(item)}
										</span>
									</div>
									{formatSummary(item) ? (
										<p className="api-list__summary">{formatSummary(item)}</p>
									) : null}
								</Link>
							)
						})}
					</div>
				</div>
			</DocLayout>
		)
	}

	if (!selected) {
		return (
			<DocLayout toc={[]}>
				<div className="doc-content">
					<h1>{section.title}</h1>
					<p className="doc-description">Item not found.</p>
				</div>
			</DocLayout>
		)
	}

	const selectedName = selected.name.split("/").pop() ?? selected.name
	const children = selected.children ?? []

	return (
		<DocLayout toc={[]}>
			<div className="doc-content">
				<header className="doc-header">
					<h1>{selectedName}</h1>
					<p className="doc-description">{getKindString(selected)}</p>
					{formatSummary(selected) ? <p>{formatSummary(selected)}</p> : null}
				</header>
				{children.length > 0 ? (
					<div className="api-members">
						<h2>Members</h2>
						<ul>
							{children.map((child) => (
								<li key={child.id}>
									<span className="api-members__name">{child.name}</span>
									<span className="api-members__kind">
										{getKindString(child)}
									</span>
								</li>
							))}
						</ul>
					</div>
				) : null}
			</div>
		</DocLayout>
	)
}
