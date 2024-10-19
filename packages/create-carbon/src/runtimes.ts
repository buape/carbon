export const runtimes = [
	{
		label: "Cloudflare Workers",
		value: "cloudflare"
	},
	{
		label: "Next.js",
		value: "next"
	},
	{
		label: "Node.js",
		value: "node"
	},
	{
		label: "Bun",
		value: "bun"
	}
] as const satisfies { label: string; value: string }[]

export type Runtime = (typeof runtimes)[number]["value"]
