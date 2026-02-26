import { icons } from "lucide-react"
import type { SVGProps } from "react"

export function Icon({
	name,
	className
}: {
	name?: string
	className?: string
}) {
	if (!name) return null
	const LucideIcon = icons[name as keyof typeof icons]
	if (!LucideIcon) return null
	return <LucideIcon className={className} />
}

export type IconProps = SVGProps<SVGSVGElement>
