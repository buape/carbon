import { readFileSync } from "node:fs"
import { generateOGImage } from "fumadocs-ui/og"
import { notFound } from "next/navigation"
import type { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { utils } from "~/app/source"

const font = readFileSync("./app/og/[...slug]/Rubik-Regular.ttf")
const fontBold = readFileSync("./app/og/[...slug]/Rubik-Bold.ttf")
import Logo from "~/public/CarbonLogo.png"
import { baseUrl, metadataImage } from "./metadata"

export const GET = metadataImage.createAPI((page) => {
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
				data: font,
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
