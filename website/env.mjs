import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	extends: [],
	shared: {},
	server: {
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development")
	},
	client: {},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV
	},
	skipValidation:
		!!process.env.CI ||
		!!process.env.SKIP_ENV_VALIDATION ||
		process.env.npm_lifecycle_event === "lint"
})
