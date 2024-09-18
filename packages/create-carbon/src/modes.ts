export const modes = [
	{
		label: "Cloudflare Workers",
		value: "cloudflare"
	},
	{
		label: "Bun",
		value: "bun"
	},
	{
		label: "Node.js",
		value: "node"
	},
	{
		label: "Next.js",
		value: "nextjs"
	}
] as const satisfies { label: string; value: string }[]

export type Mode = (typeof modes)[number]["value"]
