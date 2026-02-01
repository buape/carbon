/**
 * Get proxy URL from environment variables or configuration
 *
 * Priority:
 * 1. configuredProxy (passed directly)
 * 2. DISCORD_HTTP_PROXY environment variable
 * 3. HTTP_PROXY / HTTPS_PROXY environment variables (fallback)
 *
 * @param configuredProxy - Proxy URL from options
 * @returns Proxy URL string or null if no proxy is configured
 */
export function getProxyUrl(configuredProxy?: string): string | null {
	// 1. Use configured proxy if provided
	if (configuredProxy) {
		return configuredProxy
	}

	// 2. Check Discord-specific proxy environment variable
	const discordProxy = process.env.DISCORD_HTTP_PROXY
	if (discordProxy) {
		return discordProxy
	}

	// 3. Fall back to generic proxy variables
	const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy
	if (httpsProxy) {
		return httpsProxy
	}

	const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy
	if (httpProxy) {
		return httpProxy
	}

	return null
}

/**
 * Create a proxy agent for the current runtime
 *
 * @param proxyUrl - The proxy URL to create an agent for
 * @returns Proxy agent instance or null if not supported
 */
export function createProxyAgent(
	proxyUrl: string
): { agent: unknown; dispatcher: unknown } | null {
	// Validate proxy URL format
	if (!proxyUrl || typeof proxyUrl !== "string") {
		return null
	}

	try {
		// Check if we're in a Node.js environment
		if (typeof process !== "undefined" && process.versions?.node) {
			const HttpsProxyAgent = require("https-proxy-agent")
			const agent = new HttpsProxyAgent.HttpsProxyAgent(proxyUrl)
			// Return both agent and dispatcher for compatibility
			// - agent: for ws library (WebSocket)
			// - dispatcher: for undici fetch API
			return { agent, dispatcher: agent }
		}
	} catch {
		// Silently fail if proxy agent is not available
		// (e.g., in Cloudflare Workers, Bun without support, etc.)
	}

	return null
}
