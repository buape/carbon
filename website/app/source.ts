import { createMDXSource } from "fumadocs-mdx"
import type { InferMetaType, InferPageType } from "fumadocs-core/source"
import { loader } from "fumadocs-core/source"
import { icons } from "lucide-react"
import { create } from "~/components/icon"
import { meta, docs } from "~/.source"

export const utils = loader({
	baseUrl: "",
	icon(icon) {
		if (icon && icon in icons)
			return create({ icon: icons[icon as keyof typeof icons] })
	},
	source: createMDXSource(docs, meta)
})

console.log(utils.pageTree)

export type Page = InferPageType<typeof utils>
export type Meta = InferMetaType<typeof utils>
