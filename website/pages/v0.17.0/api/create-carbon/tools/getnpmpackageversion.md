---
title: getNpmPackageVersion
description: Get the version of an npm package
hidden: true
---

## Signature

```ts
const getNpmPackageVersion: async (
	name: string,
	dist?: string | number
) => {
	if (dist) return getPinnedNpmPackageVersion(name, dist)
	return getLatestNpmPackageVersion(name)
}
```


Get the version of an npm package
