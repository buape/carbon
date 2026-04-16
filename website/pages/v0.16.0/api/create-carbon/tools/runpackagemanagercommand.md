---
title: runPackageManagerCommand
description: Run a package manager command in a directory
hidden: true
---

## Signature

```ts
const runPackageManagerCommand: async (
	command: string,
	directory: string
) => {
	const manager = getPackageManager()
	execSync(
		`cd ${directory} && ${manager} ${command}`, //
		{ stdio: process.env.DEBUG ? "inherit" : "ignore" }
	)
}
```


Run a package manager command in a directory
