import { statSync } from "node:fs"

export const doesDirectoryExist = (name: string) => {
	try {
		if (statSync(`./${name}`).isDirectory()) return true
		return false
	} catch (_e) {
		return false
	}
}
