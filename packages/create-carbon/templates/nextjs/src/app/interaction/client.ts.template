import { Client, ClientMode } from "@buape/carbon";
import PingCommand from "./commands/ping";
import ButtonCommand from "./commands/button";

if (!process.env.CLIENT_ID || !process.env.PUBLIC_KEY || !process.env.DISCORD_TOKEN) {
	throw new Error("Missing environment variables");
}

export const client = new Client(
	{
		mode: ClientMode.Bun,
		clientId: process.env.CLIENT_ID,
		publicKey: process.env.PUBLIC_KEY,
		token: process.env.DISCORD_TOKEN,
		port: 3000
	},
	[new PingCommand(), new ButtonCommand()]
);