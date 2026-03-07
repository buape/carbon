import GithubSlugger from "github-slugger"
import type { ComponentType } from "react"
import lastUpdatedByPath from "./last-updated.json"

export type TocItem = {
	id: string
	title: string
	depth: number
}

export type Page = {
	slug: string
	title: string
	description?: string
	icon?: string
	filePath: string
	component: ComponentType
	index?: boolean
	full?: boolean
	lastUpdated?: string
	toc: TocItem[]
}

export type NavItem = {
	type: "page"
	page: Page
}

export type NavGroup = {
	type: "group"
	slug: string
	title: string
	icon?: string
	indexPage?: Page
	children: Array<NavItem | NavGroup>
	defaultOpen?: boolean
}

type Frontmatter = {
	title?: string
	description?: string
	icon?: string
	index?: boolean
	full?: boolean
}

type MdxModule = {
	default: ComponentType
	frontmatter?: Frontmatter
}

type MetaConfig = {
	title?: string
	icon?: string
	pages?: string[]
	defaultOpen?: boolean
	root?: boolean
}

const mdxModules = import.meta.glob("../../content/**/*.mdx", {
	eager: true
}) as Record<string, MdxModule>

const mdxRawModules = import.meta.glob("../../content/**/*.mdx", {
	eager: true,
	query: "?raw",
	import: "default"
}) as Record<string, string>

const metaModules = import.meta.glob("../../content/**/meta.json", {
	eager: true,
	import: "default"
}) as Record<string, MetaConfig>

const CONTENT_PREFIX = "../../content/"

const titleCase = (value: string) =>
	value.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

const stripFrontmatter = (content: string) => {
	const normalized = content.replace(/\r\n/g, "\n")
	if (!normalized.startsWith("---")) return content
	const end = normalized.indexOf("\n---", 3)
	if (end === -1) return content
	return normalized.slice(end + 4)
}

const stripMarkdown = (value: string) =>
	value
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/\*([^*]+)\*/g, "$1")
		.replace(/_([^_]+)_/g, "$1")
		.replace(/\[(.*?)\]\(.*?\)/g, "$1")
		.replace(/<[^>]+>/g, "")
		.trim()

const extractToc = (raw: string) => {
	const content = stripFrontmatter(raw)
	const lines = content.split("\n")
	const slugger = new GithubSlugger()
	const toc: TocItem[] = []
	let inCodeBlock = false

	for (const line of lines) {
		const trimmed = line.trim()
		if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
			inCodeBlock = !inCodeBlock
			continue
		}
		if (inCodeBlock) continue

		const match = /^(#{2,4})\s+(.+)$/.exec(trimmed)
		if (!match) continue

		const depth = match[1].length
		if (depth > 3) continue

		const title = stripMarkdown(match[2])
		if (!title) continue

		toc.push({
			id: slugger.slug(title),
			title,
			depth
		})
	}

	return toc
}

const toRelativePath = (path: string) => path.replace(CONTENT_PREFIX, "")

const toSlug = (relativePath: string) =>
	relativePath.replace(/\.mdx$/, "").replace(/\/index$/, "")

const getDirName = (relativePath: string) => {
	const parts = relativePath.split("/")
	parts.pop()
	return parts.join("/")
}

const pages: Page[] = Object.entries(mdxModules).map(([path, module]) => {
	const relativePath = toRelativePath(path)
	const slug = toSlug(relativePath)
	const raw = mdxRawModules[path] ?? ""
	const frontmatter = module.frontmatter ?? {}
	const title = frontmatter.title ?? titleCase(slug.split("/").pop() ?? slug)

	return {
		slug,
		title,
		description: frontmatter.description,
		icon: frontmatter.icon,
		index: frontmatter.index,
		full: frontmatter.full,
		filePath: relativePath,
		component: module.default,
		lastUpdated: lastUpdatedByPath[relativePath],
		toc: extractToc(raw)
	}
})

const pagesBySlug = new Map(pages.map((page) => [page.slug, page]))

const metaByDir = new Map(
	Object.entries(metaModules).map(([path, config]) => {
		const relative = toRelativePath(path)
		const dir =
			relative === "meta.json" ? "" : relative.replace(/\/meta\.json$/, "")
		return [dir, config]
	})
)

const indexByDir = new Map<string, Page>()
const pagesByDir = new Map<string, Page[]>()
const subfoldersByDir = new Map<string, Set<string>>()

for (const page of pages) {
	const dir = getDirName(page.filePath)
	const baseName = page.filePath.split("/").pop() ?? ""

	if (baseName === "index.mdx") {
		indexByDir.set(dir, page)
		continue
	}

	const list = pagesByDir.get(dir) ?? []
	list.push(page)
	pagesByDir.set(dir, list)
}

const folderSet = new Set<string>()
for (const page of pages) {
	const dir = getDirName(page.filePath)
	folderSet.add(dir)
}

for (const dir of folderSet) {
	if (!dir) continue
	const parts = dir.split("/")
	const parent = parts.slice(0, -1).join("/")
	const child = parts[parts.length - 1]
	const children = subfoldersByDir.get(parent) ?? new Set()
	children.add(child)
	subfoldersByDir.set(parent, children)
}

const buildGroup = (dir: string): NavGroup => {
	const meta = metaByDir.get(dir) ?? {}
	const dirName = dir.split("/").filter(Boolean).pop() ?? "Docs"
	const title = meta.title ?? titleCase(dirName)
	const icon = meta.icon
	const indexPage = indexByDir.get(dir)
	const defaultOpen = meta.defaultOpen

	const pagesInDir = pagesByDir.get(dir) ?? []
	const pagesByName = new Map(
		pagesInDir.map((page) => [
			page.filePath
				.split("/")
				.pop()
				?.replace(/\.mdx$/, "") ?? "",
			page
		])
	)
	const groupsInDir = new Set(subfoldersByDir.get(dir) ?? [])

	const children: Array<NavItem | NavGroup> = []
	const seenPages = new Set<string>()
	const seenGroups = new Set<string>()

	const insertRemaining = () => {
		const remainingPages = Array.from(pagesByName.entries())
			.filter(([name]) => !seenPages.has(name))
			.sort(([, a], [, b]) => a.title.localeCompare(b.title))
		const remainingGroups = Array.from(groupsInDir)
			.filter((name) => !seenGroups.has(name))
			.sort((a, b) => a.localeCompare(b))

		for (const [name, page] of remainingPages) {
			children.push({ type: "page", page })
			seenPages.add(name)
		}

		for (const groupName of remainingGroups) {
			children.push(buildGroup(dir ? `${dir}/${groupName}` : groupName))
			seenGroups.add(groupName)
		}
	}

	const pagesConfig = meta.pages ?? ["..."]
	for (const entry of pagesConfig) {
		if (entry === "...") {
			insertRemaining()
			continue
		}

		if (groupsInDir.has(entry)) {
			children.push(buildGroup(dir ? `${dir}/${entry}` : entry))
			seenGroups.add(entry)
			continue
		}

		const page = pagesByName.get(entry)
		if (page) {
			children.push({ type: "page", page })
			seenPages.add(entry)
		}
	}

	return {
		type: "group",
		slug: dir,
		title,
		icon,
		indexPage,
		children,
		defaultOpen
	}
}

const rootGroup = buildGroup("")
const navTree = rootGroup.children.filter(
	(item): item is NavGroup => item.type === "group"
)

const flattenGroup = (group: NavGroup): Page[] => {
	const items: Page[] = []
	if (group.indexPage) items.push(group.indexPage)

	for (const child of group.children) {
		if (child.type === "page") {
			items.push(child.page)
		} else {
			items.push(...flattenGroup(child))
		}
	}

	return items
}

const flatPages = navTree.flatMap((group) => flattenGroup(group))
const defaultSlug = flatPages[0]?.slug ?? ""

const findGroupBySlug = (slug: string, groups: NavGroup[]): NavGroup | null => {
	for (const group of groups) {
		if (group.indexPage?.slug === slug || group.slug === slug) return group
		for (const child of group.children) {
			if (child.type === "group") {
				const match = findGroupBySlug(slug, [child])
				if (match) return match
			}
		}
	}
	return null
}

const findGroupForPage = (
	slug: string,
	groups: NavGroup[]
): NavGroup | null => {
	for (const group of groups) {
		if (group.indexPage?.slug === slug) return group
		for (const child of group.children) {
			if (child.type === "page" && child.page.slug === slug) return group
			if (child.type === "group") {
				const match = findGroupForPage(slug, [child])
				if (match) return match
			}
		}
	}
	return null
}

export const docsData = {
	pages,
	pagesBySlug,
	navTree,
	flatPages,
	defaultSlug,
	getPage: (slug: string) => pagesBySlug.get(slug),
	getPrevNext: (slug: string) => {
		const index = flatPages.findIndex((page) => page.slug === slug)
		return {
			prev: index > 0 ? flatPages[index - 1] : null,
			next:
				index >= 0 && index < flatPages.length - 1 ? flatPages[index + 1] : null
		}
	},
	getGroupBySlug: (slug: string) => findGroupBySlug(slug, navTree),
	getGroupForPage: (slug: string) => findGroupForPage(slug, navTree)
}
