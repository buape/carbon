---
title: User
hidden: true
---

## class `User`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `APIUser | null` | Yes |  |
| setData | `(data: typeof this._rawData) => void` | Yes |  |
| id | `string` | Yes | The ID of the user |
| getAvatarUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the user's avatar with custom format and size options @param options Optional format and size parameters @returns The avatar URL or null if no avatar is set |
| getBannerUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the user's banner with custom format and size options @param options Optional format and size parameters @returns The banner URL or null if no banner is set |
| toString | `() => string` | Yes | Returns the Discord mention format for this user @returns The mention string in the format <@userId> |
| fetch | `() => Promise<User<false>>` | Yes | Fetch updated data for this user. If the user is partial, this will fetch all the data for the user and populate the fields. If the user is not partial, all fields will be updated with new values from Discord. @returns A Promise that resolves to a non-partial User |
| createDm | `() => void` | Yes | Instantiate a new DM channel with this user. |
| send | `(data: MessagePayload) => void` | Yes | Send a message to this user. |
