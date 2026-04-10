export const runtimes = [
	{
		label: "Bun",
		value: "bun"
	},
	{
		label: "Cloudflare Workers",
		value: "cloudflare"
	},
	{
		label: "Deno",
		value: "deno"
	},
	{
		label: "Fetch (Platform Agnostic)",
		value: "fetch"
	},
	{
		label: "Node.js",
		value: "node"
	},
	{
		label: "Next.js",
		value: "next"
	},
	{
		label: "Gateway Forwarder",
		value: "forwarder"
	}
] as const satisfies { label: string; value: string }[]

export const serverRuntimes: Runtime[] = ["node", "bun", "deno", "forwarder"]

export type Runtime = (typeof runtimes)[number]["value"]
