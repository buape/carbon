---
title: BrandedDiscordIds
hidden: true
---

## Signature

```ts
type BrandedDiscordIds = T extends (
	...args: never[]
) => unknown
	? T
	: T extends readonly (infer Item)[]
		? BrandedDiscordIds<Item, Id>[]
		: T extends object
			? { [Key in keyof T]: BrandDiscordIdField<Key & string, T[Key], Id> }
			: T
```

