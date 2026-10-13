---
title: Role
hidden: true
---

## class `Role`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `APIRole | null` | Yes |  |
| _guildId | `GuildId` | No |  |
| setData | `(data: typeof this._rawData) => void` | Yes |  |
| setField | `(key: keyof APIRole, value: unknown) => void` | Yes |  |
| id | `RoleId` | Yes | The ID of the role. |
| getIconUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the role's icon with custom format and size options @param options Optional format and size parameters @returns The icon URL or null if no icon is set |
| toString | `() => string` | Yes | Returns the Discord mention format for this role @returns The mention string in the format <@&roleId> |
| fetch | `(force: boolean) => Promise<Role<false>>` | Yes | Fetch updated data for this role. If cached data exists, this uses it unless force is true. @param force Whether to bypass cache and request fresh data from Discord @returns A Promise that resolves to a non-partial Role |
| setName | `(name: string, reason: string) => void` | Yes | Set the name of the role @param name The new name for the role @param reason The reason for changing the name (will be shown in audit log) |
| setColor | `(color: number, reason: string) => void` | Yes | Set the color of the role @param color The new color for the role @param reason The reason for changing the color (will be shown in audit log) |
| setIcon | `(icon: string, reason: string) => void` | Yes | Set the icon of the role @param icon The unicode emoji or icon URL to set @param reason The reason for changing the icon (will be shown in audit log) |
| setMentionable | `(mentionable: boolean, reason: string) => void` | Yes | Set the mentionable status of the role @param mentionable Whether the role should be mentionable @param reason The reason for changing the mentionable status (will be shown in audit log) |
| setHoisted | `(hoisted: boolean, reason: string) => void` | Yes | Set the hoisted status of the role @param hoisted Whether the role should be hoisted @param reason The reason for changing the hoisted status (will be shown in audit log) |
| setPosition | `(position: number, reason: string) => void` | Yes | Set the position of the role @param position The new position for the role @param reason The reason for changing the position (will be shown in audit log) |
| setPermissions | `(permissions: bigint[], reason: string) => void` | Yes | Set the permissions of the role @param permissions The permissions to set @param reason The reason for changing the permissions (will be shown in audit log) |
| delete | `(reason: string) => void` | Yes | Delete the role @param reason The reason for deleting the role (will be shown in audit log) |
| fetchMemberCount | `() => Promise<number>` | Yes | Get the member count for this role @returns A Promise that resolves to the number of members with this role |
