---
title: BaseInteraction
description: This is the base type interaction, all interaction types extend from this
hidden: true
---

## class `BaseInteraction`

This is the base type interaction, all interaction types extend from this

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `InteractionType` | Yes | The type of interaction |
| _rawData | `T` | Yes | The internal raw data of the interaction |
| userId | `string | undefined` | Yes | The user who sent the interaction |
| _deferred | `unknown` | Yes | Whether the interaction is deferred already @internal |
| defaultEphemeral | `unknown` | Yes |  |
| _internalAutoRegisterComponentsOnSend | `(data: MessagePayload) => void` | Yes | @internal Automatically register components found in a message payload when sending the message. |
| _internalRegisterComponentsOnSend | `(components: TopLevelComponents[]) => void` | Yes | @internal Register components found in a message payload when sending the message. |
| reply | `(data: MessagePayload, overrideAutoRegister: unknown) => void` | Yes | Reply to an interaction. If the interaction is deferred, this will edit the original response. @param data The message data to send |
| setDefaultEphemeral | `(ephemeral: boolean) => void` | Yes | Set the default ephemeral value for this interaction @internal |
| defer | `({ ephemeral = false }: unknown) => void` | Yes | Defer the interaction response. This is used automatically by commands that are set to defer. If the interaction is already deferred, this will do nothing. @internal |
| showModal | `(modal: Modal) => void` | Yes | Show a modal to the user This can only be used if the interaction is not deferred |
| followUp | `(reply: MessagePayload) => void` | Yes | Send a followup message to the interaction |
| replyAndWaitForComponent | `(data: MessagePayload, timeout: unknown) => Promise<
		| {
				/**
				 * Whether the interaction was successful
				 */
				success: true
				/**
				 * The custom ID of the component that was pressed
				 */
				customId: string
				/**
				 * The message object returned by the interaction reply
				 */
				message: Message<false>
				/**
				 * If this is a select menu, this will be the values of the selected options
				 */
				values?: string[]
		  }
		| {
				/**
				 * Whether the interaction was successful
				 */
				success: false
				/**
				 * The message object returned by the interaction reply
				 */
				message: Message<false>
				/**
				 * The reason the interaction failed
				 */
				reason: "timed out"
		  }
	>` | Yes | This function will reply to the interaction and wait for a component to be pressed. Any components passed in the message will not have run() functions called and will only trigger the interaction.acknowledge() function. This function will also return a promise that resolves to the custom ID of the component that was pressed.  @param data The message data to send @param timeout After this many milliseconds, the promise will resolve to null |
| editAndWaitForComponent | `(data: MessagePayload, message: Message, timeout: unknown) => Promise<
		| {
				/**
				 * Whether the interaction was successful
				 */
				success: true
				/**
				 * The custom ID of the component that was pressed
				 */
				customId: string
				/**
				 * The message object returned by the interaction reply
				 */
				message: Message<false>
				/**
				 * If this is a select menu, this will be the values of the selected options
				 */
				values?: string[]
		  }
		| {
				/**
				 * Whether the interaction was successful
				 */
				success: false
				/**
				 * The message object returned by the interaction reply
				 */
				message: Message<false>
				/**
				 * The reason the interaction failed
				 */
				reason: "timed out"
		  }
		| null
	>` | Yes | This function will edit to the interaction and wait for a component to be pressed. Any components passed in the message will not have run() functions called and will only trigger the interaction.acknowledge() function. This function will also return a promise that resolves to the custom ID of the component that was pressed.  @param data The message data to send @param message The message to edit (defaults to the interaction's original message) @param {number} [timeout=300000] After this many milliseconds, the promise will resolve to null  @returns Will return null if the interaction has not yet been replied to or if the message provided no longer exists |
