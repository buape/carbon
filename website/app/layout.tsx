import "./global.css"
import { RootProvider } from "fumadocs-ui/provider"
import { Rubik } from "next/font/google"
import type { ReactNode } from "react"
import { baseUrl, createMetadata } from "./og/[...slug]/metadata"
import Script from "next/script"
import { env } from "~/env.mjs"

const rubik = Rubik({
	subsets: ["latin"],
	variable: "--font-sans"
})

export const metadata = createMetadata({
	title: {
		template: "%s | Carbon",
		default: "Carbon"
	},
	description:
		"Carbon is a fully-featured framework for building HTTP Discord bots, built in TypeScript and designed to be easy to use and understand.",
	metadataBase: baseUrl
})

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={rubik.className} suppressHydrationWarning>
			<body>
				<RootProvider>{children}</RootProvider>
			</body>
			{env.NODE_ENV === "production" ? (
				<Script
					defer
					src="https://stats.b1.buape.com/script.js"
					data-website-id="c864c489-8576-427a-b229-6ffac6fc1c33"
				/>
			) : null}
		</html>
	)
}
