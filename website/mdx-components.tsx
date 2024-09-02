import { Callout } from "fumadocs-ui/components/callout"
import {
	CodeBlock,
	type CodeBlockProps,
	Pre
} from "fumadocs-ui/components/codeblock"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import defaultComponents from "fumadocs-ui/mdx"
import {
	AlertCircle,
	InfoIcon,
	Lightbulb,
	OctagonXIcon,
	TriangleAlert
} from "lucide-react"
import type { MDXComponents } from "mdx/types"
import {
	Children,
	type ComponentProps,
	type ReactNode,
	cloneElement
} from "react"

type CalloutProps = ComponentProps<typeof Callout>

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...defaultComponents,
		pre: ({ title, className, icon, allowCopy, ...props }: CodeBlockProps) => (
			<CodeBlock title={title} icon={icon} allowCopy={allowCopy}>
				<Pre className={`'max-h-[400px] ${className || ""}`} {...props} />
			</CodeBlock>
		),
		Tab,
		InstallTabs: ({
			items,
			children
		}: {
			items: string[]
			children: ReactNode
		}) => (
			<Tabs items={items} id="package-manager">
				{children}
			</Tabs>
		),
		blockquote: (props) => {
			let icon: CalloutProps["icon"] = undefined
			let title: CalloutProps["title"] = undefined
			const children = mapStringChildren(props.children, (str) => {
				return str.replace(/^(?:\[!([A-Z]+)\]|([A-Z]+):)/, (_, t1, t2) => {
					const t = t1 || t2
					if (t === "NOTE") {
						title = <span className="text-blue-500">Note</span>
						icon = (
							<div className="border-l-blue-500 border-l-2 text-blue-500 pl-1 text-lg">
								<InfoIcon />
							</div>
						)
					} else if (t === "TIP") {
						title = <span className="text-emerald-500">Tip</span>
						icon = (
							<div className="border-l-emerald-500 border-l-2 text-emerald-500 pl-2 text-lg">
								<Lightbulb />
							</div>
						)
					} else if (t === "IMPORTANT") {
						title = <span className="text-purple-500">Important</span>
						icon = (
							<div className="border-l-purple-500 border-l-2 text-purple-500 pl-2 text-lg">
								<AlertCircle />
							</div>
						)
					} else if (t === "WARNING") {
						title = <span className="text-yellow-500">Warning</span>
						icon = (
							<div className="border-l-yellow-500 border-l-2 text-yellow-500 pl-2 text-lg">
								<TriangleAlert />
							</div>
						)
					} else if (t === "DANGER") {
						title = <span className="text-rose-500">Danger</span>
						icon = (
							<div className="border-l-rose-500 border-l-2 text-rose-500 pl-2 text-lg">
								<OctagonXIcon />
							</div>
						)
					}
					return ""
				})
			})
			return (
				<Callout title={title} icon={icon}>
					{children}
				</Callout>
			)
		},
		...components
	}
}

function mapStringChildren(
	children: ReactNode,
	fn: (str: string) => string
): ReactNode {
	if (typeof children === "string") {
		return fn(children)
	}
	if (typeof children !== "object" || children === null) {
		return children
	}
	if (Array.isArray(children)) {
		return Children.map(children, (child) => mapStringChildren(child, fn))
	}
	// @ts-expect-error
	return cloneElement(children, {
		// @ts-expect-error
		children: mapStringChildren(children.props.children, fn)
	})
}
