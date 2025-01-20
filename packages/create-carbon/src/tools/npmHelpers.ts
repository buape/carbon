import { exec as execAsync } from "node:child_process"
import { promisify } from "node:util"
const exec = promisify(execAsync)

/**
 * Get the latest version of an npm package
 * @param name The name of the package to get the version of
 */
export const getLatestNpmPackageVersion = async (name: string) => {
	const response = await exec(`npm show "${name}" dist-tags.latest`)
	return response.stdout.trim()
}

/**
 * Get the pinned version of an npm package
 * @param name The name of the package to get the version of
 * @param dist The pinned version of the package
 */
export const getPinnedNpmPackageVersion = async (
	name: string,
	dist: string | number
) => {
	if (dist === "workspace") return "workspace:*"
	if (typeof dist === "string") return dist
	const response = await exec(`npm show "${name}" versions --json`)
	const versions = JSON.parse(response.stdout).reverse() as string[]
	return versions.find((v) => `${v}.`.startsWith(`${dist}.`))
}

/**
 * Get the version of an npm package
 * @param name The name of the package to get the version of
 * @param dist The pinned version of the package (optional)
 */
export const getNpmPackageVersion = async (
	name: string,
	dist?: string | number
) => {
	if (dist) return getPinnedNpmPackageVersion(name, dist)
	return getLatestNpmPackageVersion(name)
}

const dependencies = {
	"@buape/carbon":
		process.env.NODE_ENV === "development" ? "workspace" : undefined,
	typescript: undefined,
	// Node
	"@types/node": undefined,
	dotenv: undefined,
	"tsc-watch": undefined,
	// Bun
	"@types/bun": undefined,
	// Cloudflare
	wrangler: undefined,
	"@cloudflare/workers-types": undefined,
	// Next.js
	next: undefined,
	react: undefined,
	"react-dom": undefined,
	"@types/react": undefined,
	"@types/react-dom": undefined
} as const satisfies Record<string, string | number | undefined>
type Dependency = keyof typeof dependencies

/**
 * Get the versions of the dependencies used in the project
 * @returns The versions of the dependencies
 */
export const getDependencyVersions = async () => {
	const versionPromises = Object.entries(dependencies).map(
		async ([pkg, pin]) => {
			const version = await getNpmPackageVersion(pkg, pin)
			return [pkg, version] as [string, string]
		}
	)

	const versions = {} as Record<Dependency, string>
	const resolvedVersions = await Promise.all(versionPromises)
	for (const [pkg, version] of resolvedVersions)
		versions[pkg as Dependency] = version
	return versions
}
