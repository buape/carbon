---
title: LinkedRoleCriteria
description: The metadata that you want to check for, and that should show to the end-user on Discord.
hidden: true
---

## Signature

```ts
type LinkedRoleCriteria = {
	/**
	 * The key of the metadata. This is only used on the code side, and is not seen by the end user.
	 */
	key: string
	/**
	 * The type of metadata that you want to check for.
	 */
	type: ApplicationRoleConnectionMetadataType
	/**
	 * The name of the metadata. This is what the end user will see.
	 */
	name: string
	/**
	 * A description of the metadata.
	 */
	description: string
}
```


The metadata that you want to check for, and that should show to the end-user on Discord.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | `string` | Yes | The key of the metadata. This is only used on the code side, and is not seen by the end user. |
| type | `ApplicationRoleConnectionMetadataType` | Yes | The type of metadata that you want to check for. |
| name | `string` | Yes | The name of the metadata. This is what the end user will see. |
| description | `string` | Yes | A description of the metadata. |
