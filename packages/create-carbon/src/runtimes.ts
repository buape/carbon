export const runtimes = [
	{
		label: "Node.js",
		value: "node"
	},
	{
		label: "Bun",
		value: "bun"
	},
	{
		label: "Cloudflare Workers",
		value: "cloudflare"
	},
	{
		label: "Next.js",
		value: "nextjs"
	}
] as const satisfies { label: string; value: string }[]

export type Runtime = (typeof runtimes)[number]["value"]
