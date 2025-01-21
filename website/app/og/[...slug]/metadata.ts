import { createMetadataImage } from "fumadocs-core/server"
import type { Metadata } from "next/types"
import { utils } from "~/app/source"

export const metadataImage = createMetadataImage({
	imageRoute: "/og",
	source: utils
})

export function createMetadata(override: Metadata): Metadata {
	return {
		...override,
		openGraph: {
			title: override.title ?? undefined,
			description: override.description ?? undefined,
			url: "https://carbon.buape.com",
			images: "/CarbonWordmark.png",
			siteName: "Carbon",
			...override.openGraph
		},
		twitter: {
			card: "summary_large_image",
			creator: "@buapestudios",
			title: override.title ?? undefined,
			description: override.description ?? undefined,
			images: "/CarbonWordmark.png",
			...override.twitter
		}
	}
}

export const baseUrl =
	process.env.NODE_ENV === "development"
		? process.env.HOME === "/Users/shadow"
			? new URL("https://local.shadowing.dev")
			: new URL("http://localhost:3000")
		: new URL("https://carbon.buape.com")
