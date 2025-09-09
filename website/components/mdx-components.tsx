import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { ImageZoom } from "fumadocs-ui/components/image-zoom"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import defaultComponents from "fumadocs-ui/mdx"
import { ApiDocs } from "./api-docs"
import { PackageManager } from "./package-manager"
import { RouteCard } from "./route-card"

export function useMDXComponents() {
	return {
		...defaultComponents,

		pre: ({ ...props }) => (
			<CodeBlock {...props}>
				<Pre>{props.children}</Pre>
			</CodeBlock>
		),

		Tabs,
		Tab,
		ImageZoom,

		ApiDocs,
		PackageManager,
		RouteCard
	}
}
