---
title: EntryPointCommand
description: Represents a Primary Entry Point command for Activities.
hidden: true
---

## class `EntryPointCommand`

Represents a Primary Entry Point command for Activities.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `ApplicationCommandType` | Yes |  |
| handler | `EntryPointCommandHandlerType` | Yes |  |
| serializeOptions | `() => RESTPostAPIApplicationCommandsJSONBody["options"]` | Yes |  |
