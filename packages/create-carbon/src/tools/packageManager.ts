import { execSync } from "node:child_process"

/**
 * Get the package manager being used from the user agent or the versions object
 * @returns
 */
export const getPackageManager = () => {
	const versions = process.versions
	if (versions.bun) return "bun"

	const userAgent = process.env.npm_config_user_agent
	if (userAgent) {
		if (userAgent.startsWith("yarn")) return "yarn"
		if (userAgent.startsWith("pnpm")) return "pnpm"
		if (userAgent.startsWith("bun")) return "bun"
	}

	return "npm"
}

/**
 * Run a package manager command in a directory
 * @param command The command to run
 * @param directory The directory to run the command in
 */
export const runPackageManagerCommand = async (
	command: string,
	directory: string
) => {
	const manager = getPackageManager()
	execSync(
		`cd ${directory} && ${manager} ${command}`, //
		{ stdio: process.env.DEBUG ? "inherit" : "ignore" }
	)
}
