export const KIND_STRINGS: Record<number, string> = {
	1: "Project",
	2: "Module",
	4: "Namespace",
	8: "Enum",
	16: "EnumMember",
	32: "Variable",
	64: "Function",
	128: "Class",
	256: "Interface",
	512: "Constructor",
	1024: "Property",
	2048: "Method",
	4096: "CallSignature",
	8192: "IndexSignature",
	16384: "ConstructorSignature",
	32768: "Parameter",
	65536: "TypeLiteral",
	131072: "TypeParameter",
	262144: "Accessor",
	524288: "GetSignature",
	1048576: "SetSignature",
	2097152: "TypeAlias",
	4194304: "Reference"
}

export interface TypeDocNode {
	id: number
	name: string
	kind: number
	kindString?: string
	children?: TypeDocNode[]
	comment?: {
		summary?: Array<{ text: string }>
	}
}

export type ApiSection = {
	id: string
	title: string
	description: string
	filter?: string[]
	pathPrefix?: string
}

export const API_SECTIONS: ApiSection[] = [
	{
		id: "classes",
		title: "Classes",
		description: "Core Carbon classes and components",
		filter: ["Class"]
	},
	{
		id: "functions",
		title: "Functions",
		description: "Utility functions and helpers",
		filter: ["Function"]
	},
	{
		id: "interfaces",
		title: "Interfaces",
		description: "TypeScript interfaces and contracts",
		filter: ["Interface"]
	},
	{
		id: "types",
		title: "Type Aliases",
		description: "Shared types and aliases",
		filter: ["TypeAlias"]
	},
	{
		id: "adapters",
		title: "Adapters",
		description: "Runtime and platform adapters",
		pathPrefix: "adapters/"
	},
	{
		id: "plugins",
		title: "Plugins",
		description: "Built-in Carbon plugins",
		pathPrefix: "plugins/"
	}
]

export const getKindString = (node: TypeDocNode) =>
	node.kindString ?? KIND_STRINGS[node.kind] ?? "Unknown"

export const formatSummary = (node: TypeDocNode) =>
	node.comment?.summary?.map((summary) => summary.text).join("") ?? ""

export const collectItemsByKind = (root: TypeDocNode, kinds: string[]) => {
	const items: TypeDocNode[] = []

	const traverse = (node: TypeDocNode) => {
		if (kinds.includes(getKindString(node))) items.push(node)
		if (node.children) node.children.forEach(traverse)
	}

	traverse(root)
	return items
}

export const collectModulesByPath = (root: TypeDocNode, prefix: string) => {
	const items: TypeDocNode[] = []

	const traverse = (node: TypeDocNode) => {
		if (getKindString(node) === "Module" && node.name.startsWith(prefix)) {
			items.push(node)
		}
		if (node.children) node.children.forEach(traverse)
	}

	traverse(root)
	return items
}
