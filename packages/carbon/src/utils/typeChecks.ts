import type { Client } from "../classes/Client.js"
import { ClientWithCaching } from "../classes/ClientWithCaching.js"

/**
 * Checks if a client is an instance of ClientWithCaching
 * @param client The client to check
 * @returns Whether the client is a ClientWithCaching instance
 */
export function isClientWithCaching(
	client: Client
): client is ClientWithCaching {
	return client instanceof ClientWithCaching
}
