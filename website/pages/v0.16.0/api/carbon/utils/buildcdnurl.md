---
title: buildCDNUrl
description: Builds a Discord CDN URL with optional format and size parameters
hidden: true
---

## `buildCDNUrl(baseUrl: string, hash: string | null | undefined, options?: CDNUrlOptions): string | null`

Builds a Discord CDN URL with optional format and size parameters

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| baseUrl | `string` | Yes | The base URL without extension or query parameters |
| hash | `string | null | undefined` | Yes | The image hash (returns null if hash is null/undefined) |
| options | `CDNUrlOptions` | No | Optional format and size parameters |

### Returns

`string | null`
