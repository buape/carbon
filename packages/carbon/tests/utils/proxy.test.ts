import { beforeEach, describe, expect, test } from "vitest"
import { createProxyAgent, getProxyUrl } from "../../src/utils/proxy.js"

describe("getProxyUrl", () => {
	beforeEach(() => {
		// Clear proxy-related environment variables before each test
		delete process.env.DISCORD_HTTP_PROXY
		delete process.env.HTTP_PROXY
		delete process.env.http_proxy
		delete process.env.HTTPS_PROXY
		delete process.env.https_proxy
	})

	test("returns null when no proxy is configured", () => {
		const result = getProxyUrl()
		expect(result).toBeNull()
	})

	test("returns configured proxy URL", () => {
		const result = getProxyUrl("http://example.com:8080")
		expect(result).toBe("http://example.com:8080")
	})

	test("prioritizes configured proxy over environment variables", () => {
		process.env.DISCORD_HTTP_PROXY = "http://discord-proxy:8080"
		const result = getProxyUrl("http://config-proxy:9090")
		expect(result).toBe("http://config-proxy:9090")
	})

	test("reads DISCORD_HTTP_PROXY environment variable", () => {
		process.env.DISCORD_HTTP_PROXY = "http://127.0.0.1:7891"
		const result = getProxyUrl()
		expect(result).toBe("http://127.0.0.1:7891")
	})

	test("falls back to HTTP_PROXY when DISCORD_HTTP_PROXY is not set", () => {
		process.env.HTTP_PROXY = "http://http-proxy:8080"
		const result = getProxyUrl()
		expect(result).toBe("http://http-proxy:8080")
	})

	test("falls back to http_proxy (lowercase) when HTTP_PROXY is not set", () => {
		process.env.http_proxy = "http://http-proxy-lower:8080"
		const result = getProxyUrl()
		expect(result).toBe("http://http-proxy-lower:8080")
	})

	test("prioritizes HTTPS_PROXY over HTTP_PROXY", () => {
		process.env.HTTPS_PROXY = "http://https-proxy:8443"
		process.env.HTTP_PROXY = "http://http-proxy:8080"
		const result = getProxyUrl()
		expect(result).toBe("http://https-proxy:8443")
	})

	test("prioritizes https_proxy (lowercase) over http_proxy", () => {
		process.env.https_proxy = "http://https-proxy-lower:8443"
		process.env.http_proxy = "http://http-proxy-lower:8080"
		const result = getProxyUrl()
		expect(result).toBe("http://https-proxy-lower:8443")
	})

	test("priority: configured > DISCORD_HTTP_PROXY > HTTPS_PROXY > HTTP_PROXY", () => {
		process.env.HTTP_PROXY = "http://http-proxy:8080"
		process.env.HTTPS_PROXY = "http://https-proxy:8443"
		process.env.DISCORD_HTTP_PROXY = "http://discord-proxy:7891"

		// DISCORD_HTTP_PROXY should win
		expect(getProxyUrl()).toBe("http://discord-proxy:7891")

		// Remove DISCORD_HTTP_PROXY, HTTPS_PROXY should win
		delete process.env.DISCORD_HTTP_PROXY
		expect(getProxyUrl()).toBe("http://https-proxy:8443")

		// Remove HTTPS_PROXY, HTTP_PROXY should win
		delete process.env.HTTPS_PROXY
		expect(getProxyUrl()).toBe("http://http-proxy:8080")
	})

	test("handles proxy URL with authentication", () => {
		process.env.DISCORD_HTTP_PROXY = "http://user:pass@example.com:8080"
		const result = getProxyUrl()
		expect(result).toBe("http://user:pass@example.com:8080")
	})
})

describe("createProxyAgent", () => {
	test("returns null for invalid proxy URL", () => {
		const result = createProxyAgent("")
		expect(result).toBeNull()
	})

	test("returns null for undefined proxy URL", () => {
		// biome-ignore lint/suspicious/noExplicitAny: testing invalid input
		const result = createProxyAgent(undefined as any)
		expect(result).toBeNull()
	})

	test("returns null for non-string proxy URL", () => {
		// biome-ignore lint/suspicious/noExplicitAny: testing invalid input
		const result = createProxyAgent(12345 as any)
		expect(result).toBeNull()
	})

	test("returns proxy agent with agent and dispatcher in Node.js", async () => {
		// This test only runs in Node.js environment
		if (typeof process !== "undefined" && process.versions?.node) {
			const result = createProxyAgent("http://127.0.0.1:7891")
			expect(result).not.toBeNull()
			expect(result?.agent).toBeDefined()
			expect(result?.dispatcher).toBeDefined()
		} else {
			// Skip in non-Node environments
			expect(true).toBe(true)
		}
	})

	test("handles proxy URL with authentication in Node.js", async () => {
		if (typeof process !== "undefined" && process.versions?.node) {
			const result = createProxyAgent("http://user:pass@127.0.0.1:7891")
			expect(result).not.toBeNull()
			expect(result?.agent).toBeDefined()
			expect(result?.dispatcher).toBeDefined()
		} else {
			expect(true).toBe(true)
		}
	})
})
