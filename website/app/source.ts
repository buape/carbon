import type { InferMetaType, InferPageType } from "fumadocs-core/source"
import { loader } from "fumadocs-core/source"
import { icons } from "lucide-react"
import { docs } from "~/.source"
import { create } from "~/components/icon"

export const source = loader({
	baseUrl: "/",
	icon(icon) {
		if (icon && icon in icons)
			return create({ icon: icons[icon as keyof typeof icons] })
	},
	source: docs.toFumadocsSource()
})

export function getPageImage(page: InferPageType<typeof source>) {
	const segments = [...page.slugs, "image.png"]
	return {
		segments,
		url: `/og/${segments.join("/")}`
	}
}

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
