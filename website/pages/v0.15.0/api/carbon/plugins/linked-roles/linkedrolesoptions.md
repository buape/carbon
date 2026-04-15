---
title: LinkedRolesOptions
description: The options for the linked roles package
hidden: true
---

## Signature

```ts
type LinkedRolesOptions = {
	/**
	 * The metadata that you want to check for, and that should show to the end-user on Discord.
	 */
	metadata: LinkedRoleCriteria[]
	/**
	 * The functions that you want to use to check the metadata.
	 * @remarks
	 * If you are checking a boolean, you should return `true` or `false`.
	 * If you are checking an integer, you should return a number that is safe to use as an integer.
	 * If you are checking a datetime, you should return a Date.now() timestamp.
	 */
	metadataCheckers: {
		[name: string]: (userId: string) => Promise<number | boolean>
	}
	/**
	 * Whether the deploy route should be disabled.
	 * @default false
	 */
	disableDeployRoute?: boolean
	/**
	 * Whether the connect route should be disabled.
	 * @default false
	 */
	disableVerifyUserRoute?: boolean
	/**
	 * Whether the connect callback route should be disabled.
	 * @default false
	 */
	disableVerifyUserCallbackRoute?: boolean
}
```


The options for the linked roles package

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| metadata | `LinkedRoleCriteria[]` | Yes | The metadata that you want to check for, and that should show to the end-user on Discord. |
| metadataCheckers | `{
		[name: string]: (userId: string) => Promise<number | boolean>
	}` | Yes | The functions that you want to use to check the metadata. @remarks If you are checking a boolean, you should return `true` or `false`. If you are checking an integer, you should return a number that is safe to use as an integer. If you are checking a datetime, you should return a Date.now() timestamp. |
| disableDeployRoute | `boolean` | No | Whether the deploy route should be disabled. @default false |
| disableVerifyUserRoute | `boolean` | No | Whether the connect route should be disabled. @default false |
| disableVerifyUserCallbackRoute | `boolean` | No | Whether the connect callback route should be disabled. @default false |
