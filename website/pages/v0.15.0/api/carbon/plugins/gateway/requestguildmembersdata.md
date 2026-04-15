---
title: RequestGuildMembersData
hidden: true
---

## interface `RequestGuildMembersData`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| guild_id | `string` | Yes |  |
| query | `string` | No | Query string (empty string "" requests all members). Either query or user_ids is required. |
| limit | `number` | Yes |  |
| presences | `boolean` | No |  |
| user_ids | `string | string[]` | No | Specific user IDs to request. Either query or user_ids is required. |
| nonce | `string` | No |  |
