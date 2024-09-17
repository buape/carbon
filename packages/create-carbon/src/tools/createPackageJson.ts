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
				"@buape/carbon": getCarbonVersion(),
				"@types/node": "latest"
			}
			packageJson.devDependencies = {
				typescript: "5.6.2"
			}
			break
		case ClientMode.Bun:
			packageJson.main = "src/index.ts"
			packageJson.scripts = {
				start: "bun run ."
			}
			packageJson.dependencies = {
				"@buape/carbon": getCarbonVersion()
			}
			packageJson.devDependencies = {
				"@types/bun": "latest"
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

const getCarbonVersion = () => {
	const pkg = getSelfPackageJson()
	return pkg.peerDependencies ? pkg.peerDependencies["@buape/carbon"] : "latest"
}

const getSelfVersion = () => {
	const pkg = getSelfPackageJson()
	return pkg.version
}
