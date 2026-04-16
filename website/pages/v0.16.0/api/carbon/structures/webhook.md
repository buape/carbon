---
title: Webhook
hidden: true
---

## class `Webhook`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rest | `RequestClient` | Yes |  |
| _rawData | `APIWebhook | null` | Yes |  |
| setData | `(data: typeof this._rawData) => void` | Yes |  |
| id | `string` | Yes | The ID of the webhook |
| token | `string` | No | The token of the webhook |
| threadId | `string` | No | The thread ID this webhook is for |
| getAvatarUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the webhook's avatar with custom format and size options @param options Optional format and size parameters @returns The avatar URL or null if no avatar is set |
| buildQuery | `({
		threadId,
		wait,
		withComponents,
		useDefaultThread = false
	}: {
		threadId?: string
		wait?: boolean
		withComponents?: boolean
		useDefaultThread?: boolean
	}) => void` | Yes |  |
| normalizeQuery | `(query: Record<string, string>) => void` | Yes |  |
| urlWithOptions | `({
		/**
		 * Waits for server confirmation of message send before response, and returns the created message body
		 */
		wait,
		/**
		 * Specify the thread to use with this webhook
		 */
		threadId,
		/**
		 * Whether to respect the components field of the request. When enabled, allows application-owned webhooks to use all components and non-owned webhooks to use non-interactive components
		 * @default false
		 */
		withComponents
	}: {
		wait?: boolean
		threadId?: string
		withComponents?: boolean
	}) => string` | Yes |  |
| fetch | `() => Promise<Webhook<false>>` | Yes | Fetch this webhook's data @returns A Promise that resolves to a non-partial Webhook |
| modify | `(data: RESTPatchAPIWebhookJSONBody) => Promise<Webhook<false>>` | Yes | Modify this webhook @param data The data to modify the webhook with @returns A Promise that resolves to the modified webhook |
| delete | `() => Promise<void>` | Yes | Delete this webhook @returns A Promise that resolves when the webhook is deleted |
| send | `(data: MessagePayload, threadId: string, wait: T) => Promise<T extends true ? APIMessage : void>` | Yes | Send a message through this webhook @param data The data to send with the webhook @param threadId Optional ID of the thread to send the message to. If not provided, uses the webhook's thread ID. |
| edit | `(messageId: string, data: MessagePayload, threadId: string) => Promise<APIMessage>` | Yes | Edit a message sent by this webhook @param messageId The ID of the message to edit @param data The data to edit the message with @param threadId Optional ID of the thread to edit the message in. If not provided, uses the webhook's thread ID. |
| deleteMessage | `(messageId: string, threadId: string) => Promise<void>` | Yes | Delete a message sent by this webhook @param messageId The ID of the message to delete @param threadId Optional ID of the thread to delete the message from. If not provided, uses the webhook's thread ID. @returns A Promise that resolves when the message is deleted |
| getMessage | `(messageId: string, threadId: string) => Promise<APIMessage>` | Yes | Get a message sent by this webhook @param messageId The ID of the message to get @param threadId Optional ID of the thread to get the message from. If not provided, uses the webhook's thread ID. @returns The raw data of the message, which you can then use to create a Message instance |
