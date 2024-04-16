import type { Client } from "../classes/Client.js"

/**
 * The base class that all classes extend from
 */
export class Base {
	client: Client
	constructor(client: Client) {
		this.client = client
	}
}
