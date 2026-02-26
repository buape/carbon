import type { TocItem } from "@/content/docs-data"

export function TableOfContents({ items }: { items: TocItem[] }) {
	return (
		<div className="toc">
			<div className="toc__title">On this page</div>
			<ul className="toc__list">
				{items.map((item) => (
					<li
						key={item.id}
						className={`toc__item toc__item--depth-${item.depth}`}
					>
						<a href={`#${item.id}`}>{item.title}</a>
					</li>
				))}
			</ul>
		</div>
	)
}
