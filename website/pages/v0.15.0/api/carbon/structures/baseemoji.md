---
title: BaseEmoji
hidden: true
---

## class `BaseEmoji`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `T` | Yes |  |
| getUrl | `(options: CDNUrlOptions) => string | null` | Yes | Get the URL of the emoji with custom format and size options @param options Optional format and size parameters @returns The emoji URL or null if no ID is set |
| toString | `() => void` | Yes |  |
