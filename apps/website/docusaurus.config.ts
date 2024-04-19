import { themes } from "prism-react-renderer"
const lightTheme = themes.github
const darkTheme = themes.dracula
import path from "node:path"

import type * as Preset from "@docusaurus/preset-classic"
import type { Config } from "@docusaurus/types"

const config: Config = {
	title: "Carbon",
	tagline: "What the fuck is this",

	url: "https://carbon.buape.com",
	baseUrl: "/",

	organizationName: "buape",
	projectName: "carbon",

	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",
	trailingSlash: false,

	i18n: {
		defaultLocale: "en",
		locales: ["en"]
	},

	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: require.resolve("./sidebars.js"),
					editUrl: "https://github.com/buape/carbon/tree/main/apps/website/docs"
				},
				theme: {
					customCss: require.resolve("./src/css/custom.css")
				}
			} satisfies Preset.Options
		]
	],

	themeConfig: {
		// Replace with your project's social card
		image: "img/docusaurus-social-card.jpg",
		navbar: {
			title: "Carbon",
			items: [
				{
					to: "api/carbon",
					label: "API",
					position: "left"
				},
				{
					type: "docSidebar",
					sidebarId: "tutorialSidebar",
					position: "left",
					label: "Docs"
				},
				{
					href: "https://github.com/buape/carbon",
					className: "navbar-item-github",
					position: "right"
				},
				{
					href: "https://go.buape.com/discord",
					className: "navbar-item-discord",
					position: "right"
				}
			]
		},

		prism: {
			theme: lightTheme,
			darkTheme: darkTheme
		}
	} satisfies Preset.ThemeConfig,

	plugins: [
		[
			"docusaurus-plugin-typedoc-api",
			{
				projectRoot: path.join(__dirname, "../.."),
				packages: ["carbon", "nodejs"].map((x) => `packages/${x}`),
				tsconfigName: "tsconfig.base.json"
			}
		]
	]
}

module.exports = config
