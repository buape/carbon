import type { ReactNode } from "react"

export type CalloutType = "info" | "warn"

export function Callout({
	type = "info",
	children
}: {
	type?: CalloutType
	children: ReactNode
}) {
	return <div className={`callout callout--${type}`}>{children}</div>
}
