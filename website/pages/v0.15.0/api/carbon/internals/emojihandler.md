---
title: EmojiHandler
description: This class is specifically used for application emojis that you manage from the Discord Developer Portal
hidden: true
---

## class `EmojiHandler`

This class is specifically used for application emojis that you manage from the Discord Developer Portal

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| list | `() => void` | Yes |  |
| get | `(id: string) => void` | Yes |  |
| getByName | `(name: string) => void` | Yes |  |
| create | `(name: string, image: string) => void` | Yes | Upload a new emoji to the application @param name The name of the emoji @param image The image of the emoji in base64 format @returns The created ApplicationEmoji |
| delete | `(id: string) => void` | Yes |  |
