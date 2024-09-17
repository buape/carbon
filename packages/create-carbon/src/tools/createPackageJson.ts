import { ClientMode } from "@buape/carbon"
import { readFileSync } from "node:fs"

import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import type { PackageJson } from "type-fest"

export const createPackageJson = (data: {
	name: string
	mode: ClientMode
}) => {
	const packageJson: Record<string, unknown> = {}
	packageJson.name = data.name
	switch (data.mode) {
		case ClientMode.NodeJS:
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
				typescript: "5.6.2"
			}
			break
		case ClientMode.Bun:
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
		case ClientMode.CloudflareWorkers:
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
