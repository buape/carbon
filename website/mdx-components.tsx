import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { ImageZoom } from "fumadocs-ui/components/image-zoom"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import defaultComponents from "fumadocs-ui/mdx"
import { CirclePlay, Code, Heart, Library } from "lucide-react"

import type { MDXComponents } from "mdx/types"

export function useMDXComponents(): MDXComponents {
	return {
		...defaultComponents,
		CirclePlay,
		Code,
		Library,
		Heart,
		pre: ({ ref: _ref, ...props }) => (
			<CodeBlock {...props}>
				<Pre>{props.children}</Pre>
			</CodeBlock>
		),
		Tab,
		ImageZoom,
		CommandTabs: ({
			args,
			command,
			executer = false,
			platforms = ["pnpm", "npm", "yarn"]
		}: {
			args: string[]
			command: string
			executer: boolean
			platforms?: string[]
		}) => (
			<Tabs items={platforms} id="package-manager">
				{platforms.map((runner) => (
					<Tab key={runner} value={runner}>
						<CodeBlock allowCopy keepBackground>
							<Pre>
								{args
									.map(
										(x) =>
											`${
												executer
													? runner === "npm"
														? "npx"
														: runner === "bun"
															? "bunx"
															: runner === "pnpm"
																? "pnpm dlx"
																: runner === "yarn"
																	? "yarn dlx"
																	: runner
													: runner
											} ${command === "add" && runner === "npm" ? "install" : command} ${x}`
									)
									.join("\n")}
							</Pre>
						</CodeBlock>
					</Tab>
				))}
			</Tabs>
		)
	}
}
