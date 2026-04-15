---
title: getPackageManager
description: Get the package manager being used from the user agent or the versions object
hidden: true
---

## Signature

```ts
const getPackageManager: () => {
	const versions = process.versions
	if (versions.bun) return "bun"

	const userAgent = process.env.npm_config_user_agent
	if (userAgent) {
		if (userAgent.startsWith("yarn")) return "yarn"
		if (userAgent.startsWith("pnpm")) return "pnpm"
		if (userAgent.startsWith("bun")) return "bun"
	}

	return "npm"
}
```


Get the package manager being used from the user agent or the versions object
