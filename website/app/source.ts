import type { InferMetaType, InferPageType } from "fumadocs-core/source"
import { loader } from "fumadocs-core/source"
import { createMDXSource } from "fumadocs-mdx"
import { icons } from "lucide-react"
import { docs, meta } from "~/.source"
import { create } from "~/components/icon"

export const utils = loader({
	baseUrl: "/",
	icon(icon) {
		if (icon && icon in icons)
			return create({ icon: icons[icon as keyof typeof icons] })
	},
	source: createMDXSource(docs, meta)
})

export type Page = InferPageType<typeof utils>
export type Meta = InferMetaType<typeof utils>
