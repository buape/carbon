---
title: getPinnedNpmPackageVersion
description: Get the pinned version of an npm package
hidden: true
---

## Signature

```ts
const getPinnedNpmPackageVersion: async (
	name: string,
	dist: string | number
) => {
	if (dist === "workspace") return "workspace:*"
	if (typeof dist === "string") return dist
	const response = await exec(`npm show "${name}" versions --json`)
	const versions = JSON.parse(response.stdout).reverse() as string[]
	return versions.find((v) => `${v}.`.startsWith(`${dist}.`))
}
```


Get the pinned version of an npm package
