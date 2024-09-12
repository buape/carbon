import "./global.css"
import { RootProvider } from "fumadocs-ui/provider"
import { Rubik } from "next/font/google"
import type { ReactNode } from "react"
import { baseUrl, createMetadata } from "./og/[...slug]/metadata"

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
		</html>
	)
}
