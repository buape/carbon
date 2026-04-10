import "../styles/overrides.css"
import "@tomehq/theme/entry"
// @ts-expect-error - provided by vite-plugin-tome
import { routes } from "virtual:tome/routes"
import Prism from "prismjs"

import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-toml"
import "prismjs/components/prism-diff"
import "prismjs/components/prism-python"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-go"
import "prismjs/components/prism-java"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-graphql"
import "prismjs/components/prism-css"
import "prismjs/components/prism-markup"

if (
	typeof document !== "undefined" &&
	document.documentElement.dataset.themeColorSync !== "1"
) {
	document.documentElement.dataset.themeColorSync = "1"

	const meta =
		document.querySelector("meta[name='theme-color']") ??
		document.createElement("meta")
	meta.setAttribute("name", "theme-color")
	document.head.appendChild(meta)

	const syncThemeColor = () => {
		meta.setAttribute(
			"content",
			document.documentElement.classList.contains("dark")
				? "#09090b"
				: "#fafaf9"
		)
	}

	syncThemeColor()
	new MutationObserver(syncThemeColor).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"]
	})
}

if (
	typeof document !== "undefined" &&
	document.documentElement.dataset.prismInit !== "1"
) {
	document.documentElement.dataset.prismInit = "1"

	const highlightCodeBlocks = () => {
		for (const code of document.querySelectorAll(
			"pre code[class*='language-']:not([data-prism-highlighted='1'])"
		)) {
			const pre = code.parentElement
			const langClass = [...code.classList].find((name) =>
				name.startsWith("language-")
			)

			if (pre && langClass && !pre.classList.contains(langClass)) {
				pre.classList.add(langClass)
			}

			Prism.highlightElement(code as HTMLElement)
			;(code as HTMLElement).dataset.prismHighlighted = "1"
		}
	}

	let raf = 0
	const queueHighlight = () => {
		if (raf) return
		raf = requestAnimationFrame(() => {
			raf = 0
			highlightCodeBlocks()
		})
	}

	queueHighlight()
	new MutationObserver(queueHighlight).observe(document.body, {
		childList: true,
		subtree: true
	})
}

if (
	typeof document !== "undefined" &&
	document.documentElement.dataset.tomeLinkFix !== "1"
) {
	document.documentElement.dataset.tomeLinkFix = "1"

	const knownPaths = new Set(
		(routes as Array<{ urlPath?: string; id?: string }>)
			.map((route) => route.urlPath || (route.id ? `/${route.id}` : ""))
			.filter(Boolean)
			.map((path) => path.replace(/\/$/, "") || "/")
	)

	const findBestPath = (rawHref: string, resolvedPath: string) => {
		const normalized = resolvedPath.replace(/\/$/, "") || "/"
		if (knownPaths.has(normalized)) return normalized

		const segment = normalized.startsWith("/")
			? normalized.slice(1)
			: normalized
		if (!segment) return normalized

		if (!segment.includes("/")) {
			const currentDir =
				window.location.pathname.replace(/\/[^/]*\/?$/, "") || "/"
			const sibling =
				`${currentDir}/${segment}`.replace(/\/+/g, "/").replace(/\/$/, "") ||
				"/"
			if (knownPaths.has(sibling)) return sibling
		}

		const parts = segment.split("/").filter(Boolean)
		const lastTwo = parts.slice(-2).join("/")
		if (lastTwo) {
			const pairMatches = [...knownPaths].filter((path) =>
				path.endsWith(`/${lastTwo}`)
			)
			if (pairMatches.length === 1 && pairMatches[0]) return pairMatches[0]
		}

		const leaf = parts[parts.length - 1]
		if (leaf) {
			const leafMatches = [...knownPaths].filter((path) =>
				path.endsWith(`/${leaf}`)
			)
			if (leafMatches.length === 1 && leafMatches[0]) return leafMatches[0]
		}

		if (!rawHref.startsWith("/")) {
			const rel = new URL(
				rawHref,
				`${window.location.origin}${window.location.pathname.endsWith("/") ? window.location.pathname : `${window.location.pathname}/`}`
			).pathname
			const relNorm = rel.replace(/\/$/, "") || "/"
			if (knownPaths.has(relNorm)) return relNorm
		}

		return normalized
	}

	document.addEventListener(
		"click",
		(event) => {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			)
				return

			const target = event.target as HTMLElement | null
			const anchor = target?.closest(
				".tome-content a"
			) as HTMLAnchorElement | null
			if (!anchor) return
			if (anchor.target === "_blank" || anchor.hasAttribute("download")) return

			const rawHref = anchor.getAttribute("href") || ""
			if (!rawHref) return
			if (rawHref.startsWith("#")) return
			if (/^(mailto:|tel:|javascript:|https?:\/\/|\/\/)/i.test(rawHref)) return

			const resolved = new URL(rawHref, window.location.href)
			if (resolved.origin !== window.location.origin) return

			event.preventDefault()
			event.stopPropagation()
			;(
				event as Event & { stopImmediatePropagation?: () => void }
			).stopImmediatePropagation?.()

			const bestPath = findBestPath(rawHref, resolved.pathname)
			const nextUrl = `${bestPath}${resolved.search}${resolved.hash}`

			window.history.pushState(null, "", nextUrl)
			window.dispatchEvent(new PopStateEvent("popstate"))
		},
		true
	)
}
