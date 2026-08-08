import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		typecheck: {
			enabled: true,
			tsconfig: "packages/carbon/tsconfig.type-tests.json"
		}
	}
})
