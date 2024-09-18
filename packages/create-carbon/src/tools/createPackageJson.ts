import { readFileSync } from "node:fs"

import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import type { PackageJson } from "type-fest"
import type { Mode } from "../modes.js"

export const createPackageJson = (data: {
	name: string
	mode: Mode
}) => {
	const packageJson: Record<string, unknown> = {}
	packageJson.name = data.name
	packageJson.private = true
	switch (data.mode) {
		case "node":
			packageJson.main = "./dist/src/index.js"
			packageJson.scripts = {
				build: "tsc",
				dev: "tsc -w",
				start: "node ."
			}
			packageJson.dependencies = {
				"@buape/carbon": getVersion("@buape/carbon"),
				"@buape/carbon-nodejs": getVersion("@buape/carbon-nodejs")
			}
			packageJson.devDependencies = {
				"@types/node": "latest",
				typescript: "^5"
			}
			break
		case "bun":
			packageJson.main = "src/index.ts"
			packageJson.scripts = {
				start: "bun run ."
			}
			packageJson.dependencies = {
				"@buape/carbon": "^0.4.2" //getVersion("@buape/carbon"),
			}
			packageJson.devDependencies = {
				"@types/bun": "latest"
			}
			break
		case "cloudflare":
			packageJson.main = "src/index.ts"
			packageJson.scripts = {
				build: "wrangler deploy --dry-run",
				deploy: "wrangler deploy",
				dev: "wrangler deploy && wrangler tail"
			}
			packageJson.dependencies = {
				"@buape/carbon": getVersion("@buape/carbon")
			}
			packageJson.devDependencies = {
				"@cloudflare/workers-types": "4.20240909.0",
				wrangler: "3.78.4"
			}
			break
		case "nextjs":
			packageJson.scripts = {
				dev: "next dev --turbo",
				build: "next build",
				start: "next start"
			}
			packageJson.dependencies = {
				"@buape/carbon": "^0.4.2",
				next: "14.2.12",
				react: "^18",
				"react-dom": "^18"
			}
			packageJson.devDependencies = {
				"@types/node": "^20",
				"@types/react": "^18",
				"@types/react-dom": "^18",
				typescript: "^5"
			}
			break
	}

	packageJson.carbonMetadata = {
		initVersion: getSelfVersion()
	}

	return JSON.stringify(packageJson, null, 4)
}

export const getSelfPackageJson = () => {
	const __dirname = dirname(fileURLToPath(import.meta.url))
	const data = JSON.parse(
		readFileSync(`${__dirname}/../../../package.json`, "utf-8")
	) as PackageJson
	return data
}

const getVersion = (_pkgName = "@buape/carbon") => {
	// short circuit for testing
	return "latest"

	// const pkg = getSelfPackageJson()
	// return pkg.peerDependencies ? pkg.peerDependencies[pkgName] : "latest"
}

const getSelfVersion = () => {
	const pkg = getSelfPackageJson()
	return pkg.version
}
