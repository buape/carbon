export const runtimes = [
	{
		label: "Gateway Forwarder",
		value: "forwarder"
	},
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

export const serverRuntimes: Runtime[] = ["node", "bun", "forwarder"]

export type Runtime = (typeof runtimes)[number]["value"]
