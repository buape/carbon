---
title: BrandedAPIAuthorizingIntegrationOwnersMap
hidden: true
---

## Signature

```ts
type BrandedAPIAuthorizingIntegrationOwnersMap = Omit<
	APIAuthorizingIntegrationOwnersMap,
	keyof APIAuthorizingIntegrationOwnersMap
> & {
	[key in keyof APIAuthorizingIntegrationOwnersMap]?: GuildId | UserId
}
```

