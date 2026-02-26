import { Book, Github, Heart, LayoutTemplate } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, NavLink, useLocation } from "react-router"
import { docsData, type NavGroup, type NavItem } from "@/content/docs-data"
import { Icon } from "./icon"
import { Search } from "./search"

const staticLinks = [
	{
		label: "API Reference",
		href: "/api",
		icon: Book
	},
	{
		label: "Showcase",
		href: "/even-more/powered-by-carbon",
		icon: LayoutTemplate
	},
	{
		label: "Sponsors",
		href: "https://github.com/sponsors/buape",
		icon: Heart,
		external: true
	}
]

const isGroupActive = (group: NavGroup, slug: string) => {
	if (group.indexPage?.slug === slug) return true
	return group.children.some((child) => {
		if (child.type === "page") return child.page.slug === slug
		return isGroupActive(child, slug)
	})
}

const SidebarItem = ({
	item,
	activeSlug
}: {
	item: NavItem
	activeSlug: string
}) => (
	<NavLink
		to={`/${item.page.slug}`}
		className={({ isActive }) =>
			`nav-item${isActive ? " is-active" : ""}${
				activeSlug === item.page.slug ? " is-active" : ""
			}`
		}
	>
		{item.page.icon ? (
			<Icon name={item.page.icon} className="nav-icon" />
		) : (
			<span className="nav-icon nav-icon--empty" />
		)}
		<span>{item.page.title}</span>
	</NavLink>
)

const SidebarGroup = ({
	group,
	activeSlug
}: {
	group: NavGroup
	activeSlug: string
}) => {
	const active = isGroupActive(group, activeSlug)
	const [open, setOpen] = useState(group.defaultOpen ?? active)

	useEffect(() => {
		if (active) setOpen(true)
	}, [active])

	return (
		<div className="nav-group">
			<div className={`nav-group__header${open ? " is-open" : ""}`}>
				<button
					type="button"
					className="nav-group__toggle"
					onClick={() => setOpen((prev) => !prev)}
					aria-label={open ? "Collapse section" : "Expand section"}
				>
					<span className="nav-group__chevron" />
				</button>
				{group.indexPage ? (
					<NavLink
						to={`/${group.indexPage.slug}`}
						className={({ isActive }) =>
							`nav-group__title${isActive ? " is-active" : ""}`
						}
					>
						<Icon name={group.icon} className="nav-icon" />
						<span>{group.title}</span>
					</NavLink>
				) : (
					<span className="nav-group__title">
						<Icon name={group.icon} className="nav-icon" />
						<span>{group.title}</span>
					</span>
				)}
			</div>
			{open ? (
				<div className="nav-group__children">
					{group.children.map((child) =>
						child.type === "page" ? (
							<SidebarItem
								key={child.page.slug}
								item={child}
								activeSlug={activeSlug}
							/>
						) : (
							<SidebarGroup
								key={child.slug}
								group={child}
								activeSlug={activeSlug}
							/>
						)
					)}
				</div>
			) : null}
		</div>
	)
}

export function Sidebar() {
	const location = useLocation()
	const activeSlug = useMemo(
		() => location.pathname.replace(/^\/+/, "").replace(/\/$/, ""),
		[location.pathname]
	)

	return (
		<aside className="sidebar">
			<div className="sidebar__brand">
				<Link to="/" className="sidebar__logo">
					<img
						src="/CarbonWordmark.png"
						alt="Carbon"
						className="sidebar__logo-image"
					/>
					<span className="sidebar__logo-text">Carbon</span>
				</Link>
			</div>
			<Search />
			<nav className="sidebar__nav">
				<div className="sidebar__section">
					{staticLinks.map((link) => {
						const IconComponent = link.icon
						if (link.external) {
							return (
								<a
									key={link.label}
									href={link.href}
									className="nav-item"
									rel="noreferrer"
									target="_blank"
								>
									<IconComponent className="nav-icon" />
									<span>{link.label}</span>
								</a>
							)
						}

						return (
							<NavLink
								key={link.label}
								to={link.href}
								className={({ isActive }) =>
									`nav-item${isActive ? " is-active" : ""}`
								}
							>
								<IconComponent className="nav-icon" />
								<span>{link.label}</span>
							</NavLink>
						)
					})}
				</div>
				<div className="sidebar__section">
					{docsData.navTree.map((group) => (
						<SidebarGroup
							key={group.slug || group.title}
							group={group}
							activeSlug={activeSlug}
						/>
					))}
				</div>
			</nav>
			<div className="sidebar__footer">
				<a
					href="https://github.com/buape/carbon"
					className="sidebar__footer-link"
					rel="noreferrer"
					target="_blank"
				>
					<Github className="nav-icon" />
					<span>GitHub</span>
				</a>
			</div>
		</aside>
	)
}
