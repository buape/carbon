---
title: GuildScheduledEventCreateData
hidden: true
---

## Signature

```ts
type GuildScheduledEventCreateData = {
	name: string
	description?: string | null
	scheduledStartTime: string
	scheduledEndTime?: string | null
	privacyLevel: GuildScheduledEventPrivacyLevel
	entityType: GuildScheduledEventEntityType
	channelId?: string | null
	entityMetadata?: {
		location?: string | null | undefined
	} | null
	image?: string | null
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | `string` | Yes |  |
| description | `string | null` | No |  |
| scheduledStartTime | `string` | Yes |  |
| scheduledEndTime | `string | null` | No |  |
| privacyLevel | `GuildScheduledEventPrivacyLevel` | Yes |  |
| entityType | `GuildScheduledEventEntityType` | Yes |  |
| channelId | `string | null` | No |  |
| entityMetadata | `{
		location?: string | null | undefined
	} | null` | No |  |
| image | `string | null` | No |  |
