import { generateOGImage } from "fumadocs-ui/og"
import { utils } from "~/app/source"

import Logo from "~/public/CarbonLogo.png"
import { baseUrl, metadataImage } from "./metadata"

export const GET = metadataImage.createAPI(async (page) => {
	// Fetch font data from CDN
	const [fontRegular, fontBold]: [ArrayBuffer, ArrayBuffer] = await Promise.all(
		[
			fetch("https://cdn.buape.com/fonts/Rubik-Regular.ttf").then((res) =>
				res.arrayBuffer()
			),
			fetch("https://cdn.buape.com/fonts/Rubik-Bold.ttf").then((res) =>
				res.arrayBuffer()
			)
		]
	)

	return generateOGImage({
		primaryTextColor: "rgb(240,240,240)",
		primaryColor: "rgb(145,234,228)",
		title: page.data.title,
		icon: (
			<img
				src={`${baseUrl}/${Logo.src}`}
				alt="Carbon Logo"
				className="rounded-lg"
				width={100}
				height={100}
			/>
		),
		description: page.data.description,
		site: "Carbon",
		fonts: [
			{
				name: "Rubik Regular",
				data: fontRegular,
				weight: 400
			},
			{
				name: "Rubik Bold",
				data: fontBold,
				weight: 800
			}
		]
	})
})

export function generateStaticParams(): {
	slug: string[]
}[] {
	return utils.generateParams().map((param) => ({
		...param,
		slug: [...param.slug, "og.png"]
	}))
}
