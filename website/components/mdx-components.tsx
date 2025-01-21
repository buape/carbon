import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { ImageZoom } from "fumadocs-ui/components/image-zoom"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import defaultComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { PackageManager } from "./package-manager"

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

		PackageManager
	}
}
