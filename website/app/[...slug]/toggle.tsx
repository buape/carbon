import { RootToggle } from "fumadocs-ui/components/layout/root-toggle"
import { Braces, Computer, Package2 } from "lucide-react"

export function Toggle() {
	return (
		<RootToggle
			options={[
				{
					title: "Carbon",
					description: "The main carbon package (@buape/carbon)",
					url: "/carbon",
					icon: <Package2 size={24} />
				},
				{
					title: "@buape/carbon-nodejs",
					description: "The node.js wrapper",
					url: "/nodejs",
					icon: <Braces size={24} />
				},
				{
					title: "@buape/carbon-request",
					description: "The request client",
					url: "/request",
					icon: <Computer size={24} />
				}
			]}
		/>
	)
}
