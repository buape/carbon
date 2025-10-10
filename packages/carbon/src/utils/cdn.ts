/**
 * Supported image formats for Discord CDN URLs
 */
export type ImageFormat = "png" | "jpg" | "jpeg" | "webp" | "gif"

/**
 * Valid sizes for Discord CDN images (must be a power of 2 between 16 and 4096)
 */
export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096

/**
 * Options for building a CDN URL
 */
export interface CDNUrlOptions {
	/**
	 * The image format to use
	 * @default "png"
	 */
	format?: ImageFormat
	/**
	 * The desired image size (must be a power of 2 between 16 and 4096)
	 */
	size?: ImageSize
}

/**
 * Builds a Discord CDN URL with support for multiple image formats and size parameters
 * @param endpoint - The CDN endpoint (e.g., "avatars", "icons", "banners")
 * @param id - The resource ID (e.g., user ID, guild ID)
 * @param hash - The image hash from Discord
 * @param options - Optional format and size parameters
 * @returns The complete CDN URL, or null if hash is null/undefined
 *
 * @example
 * ```ts
 * buildCDNUrl("avatars", "123456789", "abc123def456")
 * // Returns: "https://cdn.discordapp.com/avatars/123456789/abc123def456.png"
 *
 * buildCDNUrl("avatars", "123456789", "abc123def456", { format: "webp", size: 1024 })
 * // Returns: "https://cdn.discordapp.com/avatars/123456789/abc123def456.webp?size=1024"
 * ```
 */
export function buildCDNUrl(
	endpoint: string,
	id: string,
	hash: string | null | undefined,
	options: CDNUrlOptions = {}
): string | null {
	if (!hash) return null

	const { format = "png", size } = options
	let url = `https://cdn.discordapp.com/${endpoint}/${id}/${hash}.${format}`

	if (size) {
		url += `?size=${size}`
	}

	return url
}
