import { Search as SearchIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation } from "react-router"
import { docsData } from "@/content/docs-data"

export function Search() {
	const [query, setQuery] = useState("")
	const [open, setOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const location = useLocation()

	useEffect(() => {
		if (!location.pathname) return
		setQuery("")
		setOpen(false)
	}, [location.pathname])

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault()
				inputRef.current?.focus()
				setOpen(true)
			}
		}
		window.addEventListener("keydown", handler)
		return () => window.removeEventListener("keydown", handler)
	}, [])

	const results = useMemo(() => {
		if (!query.trim()) return []
		const value = query.toLowerCase()
		return docsData.flatPages
			.filter((page) =>
				[page.title, page.description]
					.filter(Boolean)
					.some((text) => text?.toLowerCase().includes(value))
			)
			.slice(0, 6)
	}, [query])

	return (
		<div className="search">
			<div className="search__input">
				<SearchIcon className="search__icon" />
				<input
					ref={inputRef}
					value={query}
					onChange={(event) => {
						const value = event.target.value
						setQuery(value)
						setOpen(!!value)
					}}
					onFocus={() => query && setOpen(true)}
					onBlur={() => setTimeout(() => setOpen(false), 120)}
					placeholder="Search"
					className="search__field"
				/>
				<span className="search__shortcut">⌘ K</span>
			</div>
			{open && results.length > 0 ? (
				<div className="search__results">
					{results.map((page) => (
						<Link
							key={page.slug}
							to={`/${page.slug}`}
							className="search__result"
						>
							<div className="search__result-title">{page.title}</div>
							{page.description ? (
								<div className="search__result-description">
									{page.description}
								</div>
							) : null}
						</Link>
					))}
				</div>
			) : null}
		</div>
	)
}
