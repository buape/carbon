import { RootToggle } from "fumadocs-ui/components/layout/root-toggle"
import { Braces, Computer, Link, Package2 } from "lucide-react"

export function Toggle() {
	return (
		<RootToggle
			options={[
				{
					title: "Carbon",
					description: "@buape/carbon",
					url: "/carbon",
					icon: <Package2 size={24} />
				},
				{
					title: "NodeJS",
					description: "@buape/carbon-nodejs",
					url: "/nodejs",
					icon: <Braces size={24} />
				},
				{
					title: "Request",
					description: "@buape/carbon-request",
					url: "/request",
					icon: <Computer size={24} />
				},
				{
					title: "Linked Roles",
					description: "@buape/carbon-linked-roles",
					url: "/linked-roles",
					icon: <Link size={24} />
				}
			]}
		/>
	)
}
