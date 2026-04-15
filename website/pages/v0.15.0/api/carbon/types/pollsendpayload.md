---
title: PollSendPayload
hidden: true
---

## Signature

```ts
type PollSendPayload = {
	question: {
		/**
		 * The text of the question, up to 300 characters
		 */
		text?: string
	}
	answers: {
		/**
		 * The text of the answer, up to 55 characters
		 */
		text?: string
		/**
		 * The emoji of the answer.
		 * When creating a poll answer with an emoji,
		 * you only need to send either the id (custom emoji) or name (default emoji) as the only field.
		 */
		emoji?: { name: string; id: string }
	}[]
	/**
	 * The time in seconds before the poll expires.
	 */
	expiry: number
	/**
	 * Whether the poll allows multiple answers
	 */
	allowMultiselect: boolean
	/**
	 * The layout type of the poll.
	 * Currently only 1 is supported, and will be set by default.
	 * @default 1
	 */
	layoutType?: 1
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| question | `{
		/**
		 * The text of the question, up to 300 characters
		 */
		text?: string
	}` | Yes |  |
| answers | `{
		/**
		 * The text of the answer, up to 55 characters
		 */
		text?: string
		/**
		 * The emoji of the answer.
		 * When creating a poll answer with an emoji,
		 * you only need to send either the id (custom emoji) or name (default emoji) as the only field.
		 */
		emoji?: { name: string; id: string }
	}[]` | Yes |  |
| expiry | `number` | Yes | The time in seconds before the poll expires. |
| allowMultiselect | `boolean` | Yes | Whether the poll allows multiple answers |
| layoutType | `1` | No | The layout type of the poll. Currently only 1 is supported, and will be set by default. @default 1 |
