import {
	type APIApplicationCommand,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody,
	Routes
} from "discord-api-types/v10"
import { describe, expect, test, vi } from "vitest"

vi.mock("../../src/structures/Message.js", () => ({
	Message: class Message {}
}))
vi.mock("../../src/plugins/paginator/index.js", () => ({}))

import type { BaseCommand } from "../../src/abstracts/BaseCommand.js"
import { Client } from "../../src/classes/Client.js"

const defaultClientOptions = {
	baseUrl: "https://example.com",
	clientId: "client-1",
	deploySecret: "secret",
	publicKey: "public-key",
	token: "token"
}

const defaultCommandFields = {
	contexts: [
		InteractionContextType.Guild,
		InteractionContextType.BotDM,
		InteractionContextType.PrivateChannel
	],
	integration_types: [
		ApplicationIntegrationType.GuildInstall,
		ApplicationIntegrationType.UserInstall
	],
	default_member_permissions: null
}

function createCommand(params: {
	name: string
	description: string
	guildIds?: string[]
	body?: RESTPostAPIApplicationCommandsJSONBody
}) {
	return {
		id: undefined,
		name: params.name,
		description: params.description,
		type: ApplicationCommandType.ChatInput,
		guildIds: params.guildIds,
		serialize: () =>
			params.body ?? {
				name: params.name,
				description: params.description,
				type: ApplicationCommandType.ChatInput,
				...defaultCommandFields
			}
	} as unknown as BaseCommand
}

function createGlobalLiveCommand(
	body: RESTPostAPIApplicationCommandsJSONBody,
	id: string
): APIApplicationCommand {
	return {
		...body,
		id,
		application_id: "client-1",
		version: "1",
		type: body.type ?? ApplicationCommandType.ChatInput,
		name: body.name
	} as APIApplicationCommand
}

function createRestHarness(
	initialGlobalCommands: APIApplicationCommand[] = []
) {
	let nextId = initialGlobalCommands.length + 1
	let liveGlobalCommands = [...initialGlobalCommands]
	const guildRoutePrefix = `/applications/client-1/guilds/`

	const rest = {
		get: vi.fn(async (route: string) => {
			if (route === Routes.applicationCommands("client-1")) {
				return [...liveGlobalCommands]
			}

			throw new Error(`unexpected GET ${route}`)
		}),
		put: vi.fn(
			async (
				route: string,
				data?: { body?: RESTPostAPIApplicationCommandsJSONBody[] }
			) => {
				const body = data?.body ?? []
				if (route === Routes.applicationCommands("client-1")) {
					liveGlobalCommands = body.map((command) =>
						createGlobalLiveCommand(command, `cmd-${nextId++}`)
					)
					return [...liveGlobalCommands]
				}

				if (route.startsWith(guildRoutePrefix) && route.endsWith("/commands")) {
					const guildId = route.slice(
						guildRoutePrefix.length,
						-"/commands".length
					)
					return body.map((command) => ({
						...createGlobalLiveCommand(command, `cmd-${nextId++}`),
						guild_id: guildId
					}))
				}

				throw new Error(`unexpected PUT ${route}`)
			}
		),
		post: vi.fn(
			async (
				route: string,
				data?: { body?: RESTPostAPIApplicationCommandsJSONBody }
			) => {
				if (route !== Routes.applicationCommands("client-1")) {
					throw new Error(`unexpected POST ${route}`)
				}

				const created = createGlobalLiveCommand(
					data?.body ?? {
						name: "unknown",
						type: ApplicationCommandType.ChatInput
					},
					`cmd-${nextId++}`
				)
				liveGlobalCommands.push(created)
				return created
			}
		),
		patch: vi.fn(
			async (
				route: string,
				data?: { body?: RESTPostAPIApplicationCommandsJSONBody }
			) => {
				const commandId = route.slice(
					`${Routes.applicationCommands("client-1")}/`.length
				)
				const index = liveGlobalCommands.findIndex(
					(command) => command.id === commandId
				)
				if (index === -1) {
					throw new Error(`missing command ${commandId}`)
				}

				const updated = createGlobalLiveCommand(
					data?.body ?? {
						name: "unknown",
						type: ApplicationCommandType.ChatInput
					},
					commandId
				)
				liveGlobalCommands[index] = updated
				return updated
			}
		),
		delete: vi.fn(async (route: string) => {
			const commandId = route.slice(
				`${Routes.applicationCommands("client-1")}/`.length
			)
			liveGlobalCommands = liveGlobalCommands.filter(
				(command) => command.id !== commandId
			)
			return undefined
		})
	}

	return {
		rest,
		getGlobalCommands: () => [...liveGlobalCommands]
	}
}

function createClient(
	commands: BaseCommand[],
	initialGlobalCommands: APIApplicationCommand[] = [],
	options: ConstructorParameters<typeof Client>[0] = defaultClientOptions
) {
	const client = new Client(options, { commands }, [])
	const harness = createRestHarness(initialGlobalCommands)
	client.rest = harness.rest as never
	return { client, ...harness }
}

describe("Client command deployment", () => {
	test("reconciles global commands while keeping guild-scoped commands on bulk overwrite", async () => {
		const globalCommand = createCommand({
			name: "ping",
			description: "Fresh ping"
		})
		const guildCommand = createCommand({
			name: "guild-only",
			description: "Guild command",
			guildIds: ["guild-1"]
		})
		const { client, rest, getGlobalCommands } = createClient(
			[globalCommand, guildCommand],
			[
				createGlobalLiveCommand(
					{
						name: "ping",
						description: "Stale ping",
						type: ApplicationCommandType.ChatInput,
						...defaultCommandFields
					},
					"cmd-1"
				),
				createGlobalLiveCommand(
					{
						name: "legacy",
						description: "Remove me",
						type: ApplicationCommandType.ChatInput
					},
					"cmd-2"
				)
			],
			{
				...defaultClientOptions,
				commandDeploymentMode: "reconcile"
			}
		)

		await client.deployCommands()

		expect(rest.put).toHaveBeenCalledWith(
			Routes.applicationGuildCommands("client-1", "guild-1"),
			expect.objectContaining({
				body: [
					expect.objectContaining({
						name: "guild-only"
					})
				]
			})
		)
		expect(rest.get).toHaveBeenCalledWith(
			Routes.applicationCommands("client-1")
		)
		expect(rest.delete).toHaveBeenCalledTimes(1)
		expect(rest.patch).toHaveBeenCalledTimes(1)
		expect(rest.post).not.toHaveBeenCalled()
		expect(getGlobalCommands().map((command) => command.name)).toEqual(["ping"])
		expect(globalCommand.id).toBe("cmd-1")
	})

	test("reconcileCommands creates missing commands without bulk overwriting globals", async () => {
		const pingCommand = createCommand({
			name: "ping",
			description: "Ping"
		})
		const { client, rest, getGlobalCommands } = createClient([pingCommand])

		await client.reconcileCommands()

		expect(rest.get).toHaveBeenCalledWith(
			Routes.applicationCommands("client-1")
		)
		expect(rest.put).not.toHaveBeenCalled()
		expect(rest.post).toHaveBeenCalledTimes(1)
		expect(rest.patch).not.toHaveBeenCalled()
		expect(rest.delete).not.toHaveBeenCalled()
		expect(getGlobalCommands().map((command) => command.name)).toEqual(["ping"])
		expect(pingCommand.id).toBe("cmd-1")
	})

	test("treats Discord response-only fields as unchanged during reconcile", async () => {
		const statusCommand = createCommand({
			name: "status",
			description: "Status"
		})
		const { client, rest } = createClient(
			[statusCommand],
			[
				{
					...createGlobalLiveCommand(
						{
							name: "status",
							description: "Status",
							type: ApplicationCommandType.ChatInput,
							...defaultCommandFields
						},
						"cmd-1"
					),
					dm_permission: true,
					nsfw: false,
					name_localized: "status",
					description_localized: "Status"
				} as APIApplicationCommand
			]
		)

		await client.reconcileCommands()

		expect(rest.patch).not.toHaveBeenCalled()
		expect(rest.post).not.toHaveBeenCalled()
		expect(rest.delete).not.toHaveBeenCalled()
	})

	test("treats omitted required false option fields as unchanged during reconcile", async () => {
		const skillCommand = createCommand({
			name: "skill",
			description: "Run a skill",
			body: {
				name: "skill",
				description: "Run a skill",
				type: ApplicationCommandType.ChatInput,
				options: [
					{
						name: "name",
						description: "Skill name",
						type: ApplicationCommandOptionType.String,
						required: true
					},
					{
						name: "input",
						description: "Skill input",
						type: ApplicationCommandOptionType.String,
						required: false
					}
				],
				...defaultCommandFields
			}
		})
		const { client, rest } = createClient(
			[skillCommand],
			[
				createGlobalLiveCommand(
					{
						name: "skill",
						description: "Run a skill",
						type: ApplicationCommandType.ChatInput,
						options: [
							{
								name: "name",
								description: "Skill name",
								type: ApplicationCommandOptionType.String,
								required: true
							},
							{
								name: "input",
								description: "Skill input",
								type: ApplicationCommandOptionType.String
							}
						],
						...defaultCommandFields
					},
					"cmd-1"
				)
			]
		)

		await client.reconcileCommands()

		expect(rest.patch).not.toHaveBeenCalled()
		expect(rest.post).not.toHaveBeenCalled()
		expect(rest.delete).not.toHaveBeenCalled()
	})

	test("does not patch unchanged subcommand commands during reconcile", async () => {
		const adminCommand = createCommand({
			name: "admin",
			description: "Administrative commands",
			body: {
				name: "admin",
				description: "Administrative commands",
				type: ApplicationCommandType.ChatInput,
				options: [
					{
						name: "status",
						description: "Show status",
						type: ApplicationCommandOptionType.Subcommand,
						...defaultCommandFields
					}
				],
				...defaultCommandFields
			}
		})
		const { client, rest } = createClient(
			[adminCommand],
			[
				createGlobalLiveCommand(
					{
						name: "admin",
						description: "Administrative commands",
						type: ApplicationCommandType.ChatInput,
						options: [
							{
								name: "status",
								description: "Show status",
								type: ApplicationCommandOptionType.Subcommand
							}
						],
						...defaultCommandFields
					},
					"cmd-1"
				)
			]
		)

		await client.reconcileCommands()

		expect(rest.patch).not.toHaveBeenCalled()
		expect(rest.post).not.toHaveBeenCalled()
		expect(rest.delete).not.toHaveBeenCalled()
	})
})
