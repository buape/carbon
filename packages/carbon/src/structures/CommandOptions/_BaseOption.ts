import type { APIApplicationCommandInteractionDataOption, ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Client } from "../../classes/Client.js";
import { Base } from "../Base.js";


/**
 * The base type for options received from Discord, to create a usable interface for the end user
 */
export abstract class BaseOption extends Base {
	type: ApplicationCommandOptionType
	name: string
	rawData: APIApplicationCommandInteractionDataOption;
	constructor(client: Client, data: APIApplicationCommandInteractionDataOption) {
		super(client);
		this.rawData = data;
		this.type = data.type;
		this.name = data.name
	}
}