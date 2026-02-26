import type { ReactNode } from "react"
import type { TocItem } from "@/content/docs-data"
import { TableOfContents } from "./table-of-contents"

export function DocLayout({
	children,
	toc
}: {
	children: ReactNode
	toc: TocItem[]
}) {
	return (
		<div className="doc-layout">
			<div className="doc-layout__main">{children}</div>
			{toc.length > 0 ? (
				<aside className="doc-layout__toc">
					<TableOfContents items={toc} />
				</aside>
			) : null}
		</div>
	)
}
