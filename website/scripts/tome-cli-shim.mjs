import { createRequire } from "node:module"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

globalThis.require = createRequire(import.meta.url)
globalThis.__filename = fileURLToPath(import.meta.url)
globalThis.__dirname = dirname(globalThis.__filename)

await import(require.resolve("@tomehq/cli/dist/cli.js"))
