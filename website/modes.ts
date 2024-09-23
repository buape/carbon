import { Computer, Link, type LucideIcon, Package } from "lucide-react"

export interface Mode {
	param: string
	name: string
	description: string
	icon: LucideIcon
}

export const modes: Mode[] = [
	{
		param: "carbon",
		name: "Carbon",
		description: "@buape/carbon",
		icon: Package
	},
	{
		param: "nodejs",
		name: "NodeJS",
		description: "@buape/carbon-nodejs",
		icon: Computer
	},
	{
		param: "request",
		name: "Request",
		description: "@buape/carbon-request",
		icon: Link
	}
]
