import createMDX from "fumadocs-mdx/config"

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	output: "export",
	images: {
		unoptimized: true
	}
}

export default withMDX(config)
