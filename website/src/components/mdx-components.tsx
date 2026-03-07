import { Link } from "react-router"
import { Step, Steps } from "../fumadocs-ui/components/steps"
import { Callout } from "./callout"
import { Card, Cards } from "./cards"
import { PackageManager } from "./package-manager"
import { RouteCard } from "./route-card"

const isExternal = (href?: string) =>
	!!href && (href.startsWith("http://") || href.startsWith("https://"))

function MdxLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	const href = props.href
	if (href?.startsWith("/")) {
		return (
			<Link to={href} className={`doc-link ${props.className ?? ""}`.trim()}>
				{props.children}
			</Link>
		)
	}

	return (
		<a
			{...props}
			rel={isExternal(href) ? "noreferrer" : undefined}
			target={isExternal(href) ? "_blank" : undefined}
			className={`doc-link ${props.className ?? ""}`.trim()}
		/>
	)
}

export const mdxComponents = {
	a: MdxLink,
	Callout,
	Cards,
	Card,
	PackageManager,
	RouteCard,
	Steps,
	Step
}
