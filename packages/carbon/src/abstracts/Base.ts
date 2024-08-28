import type { Client } from "../classes/Client.js"

/**
 * The base class that all classes extend from
 * @hidden
 */
export class Base {
	client: Client
	constructor(client: Client) {
		this.client = client
	}
}
