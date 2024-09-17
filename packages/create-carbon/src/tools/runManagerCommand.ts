import { packageManager } from "../utils.js"
import { execSync } from "node:child_process"

export const runPackageManagerCommand = async (
	command: string,
	directory: string
) => {
	const manager = packageManager()
	execSync(`cd ${directory} && ${manager} ${command}`, {
		stdio: process.env.DEBUG ? "inherit" : "ignore"
	})
}
