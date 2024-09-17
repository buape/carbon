import { packageManager } from "../utils.js"
import { execSync } from "node:child_process"

export const runPackageManagerCommand = async (command: string) => {
	const manager = packageManager()
	execSync(`${manager} ${command}`, {
		stdio: "inherit"
	})
}
