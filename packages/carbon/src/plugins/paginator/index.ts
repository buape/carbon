declare module "../../classes/Client.js" {
	interface Client {
		paginators: Paginator[]
	}
}

import { Client } from "../../classes/Client.js"
import { Paginator } from "./Paginator.js"

Object.assign(Client.prototype, {
	Paginator,
	paginators: [] as Paginator[]
})

export { Paginator }
