/**
 * https://discord.com/developers/docs/resources/application#application-object-application-integration-types
 */
export enum ApplicationIntegrationType {
	/**
	 * App is installable to servers
	 */
	GuildInstall = 0,
	/**
	 * App is installable to users
	 */
	UserInstall = 1
}

/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types
 */
export enum InteractionContextType {
	/**
	 * Interaction can be used within servers
	 */
	Guild = 0,
	/**
	 * Interaction can be used within DMs with the app's bot user
	 */
	BotDM = 1,
	/**
	 * Interaction can be used within Group DMs and DMs other than the app's bot user
	 */
	PrivateChannel = 2
}
