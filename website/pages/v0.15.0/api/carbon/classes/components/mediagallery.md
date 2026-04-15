---
title: MediaGallery
description: A media gallery component can display between 1 and 10 images.
hidden: true
---

## class `MediaGallery`

A media gallery component can display between 1 and 10 images.
Each image can be a direct online URL or an attachment://<name> reference.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| isV2 | `unknown` | Yes |  |
| items | `Array<{
		url: string
		description?: string
		spoiler?: boolean
	}>` | Yes |  |
| serialize | `unknown` | Yes |  |
