---
title: getLatestNpmPackageVersion
description: Get the latest version of an npm package
hidden: true
---

## Signature

```ts
const getLatestNpmPackageVersion: async (name: string) => {
	const response = await exec(`npm show "${name}" dist-tags.latest`)
	return response.stdout.trim()
}
```


Get the latest version of an npm package
