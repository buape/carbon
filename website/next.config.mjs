import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	images: {
		unoptimized: true
	},
	redirects: async () => [
		{
			source: "/",
			destination: "/getting-started/introduction",
			permanent: false
		},
		{
			// Redirect old Carbon URLs to introduction page
			source: "/carbon/:path*",
			destination: "/getting-started/introduction",
			permanent: false
		}
	]
}

export default withMDX(config)
