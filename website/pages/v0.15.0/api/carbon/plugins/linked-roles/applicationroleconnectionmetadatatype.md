---
title: ApplicationRoleConnectionMetadataType
description: The type of metadata that you can check for
hidden: true
---

## enum `ApplicationRoleConnectionMetadataType`

The type of metadata that you can check for

### Values

| Name | Type | Required | Description |
|------|------|----------|-------------|
| IntegerLessThanOrEqual | `1` | Yes | The metadata value (`integer`) is less than or equal to the guild's configured value (`integer`) |
| IntegerGreaterThanOrEqual | `2` | Yes | The metadata value (`integer`) is greater than or equal to the guild's configured value (`integer`) |
| IntegerEqual | `3` | Yes | The metadata value (`integer`) is equal to the guild's configured value (`integer`) |
| IntegerNotEqual | `4` | Yes | The metadata value (`integer`) is not equal to the guild's configured value (`integer`) |
| DatetimeLessThanOrEqual | `5` | Yes | The metadata value (`ISO8601 string`) is less than or equal to the guild's configured value (`integer`; days before current date) |
| DatetimeGreaterThanOrEqual | `6` | Yes | The metadata value (`ISO8601 string`) is greater than or equal to the guild's configured value (`integer`; days before current date) |
| BooleanEqual | `7` | Yes | The metadata value (`integer`) is equal to the guild's configured value (`integer`; `1`) |
| BooleanNotEqual | `8` | Yes | The metadata value (`integer`) is not equal to the guild's configured value (`integer`; `1`) |
