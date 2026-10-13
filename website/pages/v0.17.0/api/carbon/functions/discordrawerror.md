---
title: DiscordRawError
hidden: true
---

## Signature

```ts
type DiscordRawError = {
	code?: number
	message: string
	errors?: {
		// biome-ignore lint/suspicious/noExplicitAny: We use any here to allow for many different forms of errors that are checked in the mapper
		[key: string]: any
	}
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| code | `number` | No |  |
| message | `string` | Yes |  |
| errors | `{
		// biome-ignore lint/suspicious/noExplicitAny: We use any here to allow for many different forms of errors that are checked in the mapper
		[key: string]: any
	}` | No |  |
