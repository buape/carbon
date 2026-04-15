export default {
	name: "Carbon",
	baseUrl: "https://carbon.buape.com",
	logo: "/CarbonLogo.png",
	favicon: "/favicon.ico",
	theme: {
		preset: "amber",
		accent: "#8ea2ff",
		mode: "auto",
		radius: "12px",
		fonts: {
			heading: "Inter",
			body: "Inter",
			code: "JetBrains Mono"
		}
	},
	versioning: {
		current: "v0.15.0",
		versions: ["beta", "v0.15.0"]
	},
	topNav: [
		{ label: "Showcase", href: "/even-more/powered-by-carbon" },
		{ label: "Sponsors", href: "https://github.com/sponsors/buape" }
	],
	redirects: [
		{ from: "/", to: "/getting-started/introduction" },
		{ from: "/adapters/cloudflare", to: "/adapters/fetch/cloudflare" },
		{ from: "/adapters/next", to: "/adapters/fetch/next" }
	],
	navigation: [
		{
			group: "Getting Started",
			pages: ["getting-started/introduction", "getting-started/basic-setup"]
		},
		{
			group: "Concepts & Guides",
			pages: [
				"concepts/http-bots",
				"concepts/interaction-responses",
				"concepts/component-registration",
				"concepts/routes",
				"concepts/wildcards",
				"concepts/prechecks",
				"concepts/partial-structures"
			]
		},
		{
			group: "Classes",
			pages: [
				"classes/client",
				"classes/commands",
				"classes/listeners",
				"classes/components/index",
				"classes/components/buttons",
				"classes/components/select-menus",
				"classes/components/label",
				"classes/components/text-inputs",
				"classes/components/text-display",
				"classes/components/section",
				"classes/components/thumbnail",
				"classes/components/file",
				"classes/components/media-gallery",
				"classes/components/container",
				"classes/modals",
				"classes/embeds",
				"classes/poll"
			]
		},
		{
			group: "Adapters",
			pages: [
				"adapters/fetch/index",
				"adapters/fetch/cloudflare",
				"adapters/fetch/next",
				"adapters/node",
				"adapters/bun"
			]
		},
		{
			group: "Plugins",
			pages: [
				"plugins/gateway",
				"plugins/gateway-events",
				"plugins/gateway-forwarder",
				"plugins/linked-roles",
				"plugins/client-manager"
			]
		},
		{
			group: "Even More",
			pages: [
				"even-more/powered-by-carbon",
				"even-more/migration-guide",
				"even-more/contributing",
				"even-more/why-classes"
			]
		},
		{
			group: "API",
			pages: [
				"api/carbon/abstracts/index",
				"api/carbon/classes/index",
				"api/carbon/classes/components/index",
				"api/carbon/structures/index",
				"api/carbon/types/index",
				"api/carbon/utils/index",
				"api/carbon/internals/index",
				"api/carbon/plugins/gateway/index",
				"api/create-carbon/tools/index"
			]
		}
	]
}
