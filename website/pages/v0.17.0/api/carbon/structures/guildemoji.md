---
title: GuildEmoji
hidden: true
---

## class `GuildEmoji`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| guildId | `GuildId` | Yes |  |
| setData | `(data: typeof this._rawData) => void` | Yes |  |
| setName | `(name: string) => void` | Yes |  |
| setRoles | `(roles: RoleIdLike[] | Role[]) => void` | Yes | Set the roles that can use the emoji @param roles The roles to set |
| delete | `() => void` | Yes |  |
