---
title: Activity
hidden: true
---

## interface `Activity`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | `string` | Yes |  |
| type | `number` | Yes |  |
| url | `string | null` | No |  |
| created_at | `number` | No |  |
| timestamps | `{
		start?: number
		end?: number
	}` | No |  |
| application_id | `string` | No |  |
| details | `string | null` | No |  |
| state | `string | null` | No |  |
| emoji | `{
		name: string
		id?: string
		animated?: boolean
	} | null` | No |  |
| party | `{
		id?: string
		size?: [number, number]
	}` | No |  |
| assets | `{
		large_image?: string
		large_text?: string
		small_image?: string
		small_text?: string
	}` | No |  |
| secrets | `{
		join?: string
		spectate?: string
		match?: string
	}` | No |  |
| instance | `boolean` | No |  |
| flags | `number` | No |  |
| buttons | `string[]` | No |  |
