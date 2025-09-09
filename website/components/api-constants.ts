// Shared constants and utilities for TypeDoc API documentation

// TypeDoc kind numbers mapping
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

// TypeDoc node interface
export interface TypeDocNode {
	id: number
	name: string
	kind: number
	kindString?: string
	children?: TypeDocNode[]
	comment?: {
		summary?: Array<{ text: string }>
	}
	sources?: Array<{
		fileName: string
		line: number
		character: number
	}>
	signatures?: Array<{
		name: string
		comment?: {
			summary?: Array<{ text: string }>
		}
		parameters?: Array<{
			name: string
			comment?: {
				summary?: Array<{ text: string }>
			}
			type?: {
				name?: string
				type?: string
			}
		}>
		type?: {
			name?: string
			type?: string
		}
	}>
	type?: {
		name?: string
		type?: string
	}
	flags?: {
		isOptional?: boolean
		isReadonly?: boolean
		isStatic?: boolean
		isAbstract?: boolean
	}
}

// API Types configuration
export const API_TYPES = {
	classes: {
		filter: ["Class"] as string[],
		singular: "Class",
		title: "Classes",
		description: "Core Carbon classes and components"
	},
	functions: {
		filter: ["Function"] as string[],
		singular: "Function",
		title: "Functions",
		description: "Utility functions and helpers"
	},
	interfaces: {
		filter: ["Interface"] as string[],
		singular: "Interface",
		title: "Interfaces",
		description: "TypeScript interfaces and type definitions"
	},
	types: {
		filter: ["TypeAlias"] as string[],
		singular: "TypeAlias",
		title: "Type Aliases",
		description: "Custom type definitions and aliases"
	},
	adapters: {
		filter: null, // Uses path filtering
		singular: "Module",
		title: "Adapters",
		description: "Platform and runtime adapters"
	},
	plugins: {
		filter: null, // Uses path filtering
		singular: "Module",
		title: "Plugins",
		description: "Carbon plugins and extensions"
	}
}

// Utility functions
export function getKindString(node: TypeDocNode): string {
	return node.kindString || KIND_STRINGS[node.kind] || "Unknown"
}

export function collectItemsByKind(
	root: TypeDocNode,
	kindFilter: string[]
): TypeDocNode[] {
	const items: TypeDocNode[] = []

	function traverse(node: TypeDocNode) {
		if (kindFilter.includes(getKindString(node))) {
			items.push(node)
		}

		if (node.children) {
			for (const child of node.children) {
				traverse(child)
			}
		}
	}

	traverse(root)
	return items
}

export function collectModulesByPath(
	root: TypeDocNode,
	pathPrefix: string
): TypeDocNode[] {
	const items: TypeDocNode[] = []

	function traverse(node: TypeDocNode) {
		if (getKindString(node) === "Module" && node.name.startsWith(pathPrefix)) {
			items.push(node)
		}

		if (node.children) {
			for (const child of node.children) {
				traverse(child)
			}
		}
	}

	traverse(root)
	return items
}

export function findItemByName(
	root: TypeDocNode,
	name: string,
	typeKey: string
): TypeDocNode | null {
	const config = API_TYPES[typeKey as keyof typeof API_TYPES]
	if (!config) return null

	function traverse(node: TypeDocNode): TypeDocNode | null {
		// Check if this node matches
		const nodeName = node.name.split("/").pop() || node.name
		if (nodeName.toLowerCase() === name.toLowerCase()) {
			if (config.filter) {
				// For kind-based filtering
				if (config.filter.includes(getKindString(node))) {
					return node
				}
			} else {
				// For path-based filtering (adapters/plugins)
				const pathPrefix = typeKey === "adapters" ? "adapters/" : "plugins/"
				if (
					getKindString(node) === "Module" &&
					node.name.startsWith(pathPrefix)
				) {
					return node
				}
			}
		}

		// Recursively search children
		if (node.children) {
			for (const child of node.children) {
				const result = traverse(child)
				if (result) return result
			}
		}

		return null
	}

	return traverse(root)
}

export function formatSummary(node: TypeDocNode): string {
	if (!node.comment?.summary) return ""
	return node.comment.summary.map((part) => part.text).join("")
}

export function formatCommentSummary(comment?: TypeDocNode["comment"]): string {
	if (!comment?.summary) return ""
	return comment.summary.map((part) => part.text).join("")
}

export function generateApiUrl(kindString: string, name: string): string {
	const typeMap: Record<string, string> = {
		Class: "classes",
		Function: "functions",
		Interface: "interfaces",
		TypeAlias: "types",
		Module: name.startsWith("adapters/") ? "adapters" : "plugins"
	}

	const type = typeMap[kindString] || kindString.toLowerCase()
	const itemName = name.split("/").pop() || name
	return `/api/${type}/${itemName.toLowerCase()}`
}
