import { utils } from "~/app/source"
import { createSearchAPI } from "fumadocs-core/search/server"

export const { GET } = createSearchAPI("advanced", {
	indexes: utils.getPages().map((page) => ({
		id: page.slugs.join("/"),
		title: page.data.title,
		structuredData: page.data.structuredData,
		url: `/${page.slugs.join("/")}`
	}))
})
