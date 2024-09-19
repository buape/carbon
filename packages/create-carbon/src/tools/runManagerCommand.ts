import { execSync } from "node:child_process"
import { packageManager } from "../utils.js"

export const runPackageManagerCommand = async (
	command: string,
	directory: string
) => {
	const manager = packageManager()
	execSync(`cd ${directory} && ${manager} ${command}`, {
		stdio: process.env.DEBUG ? "inherit" : "ignore"
	})
}
