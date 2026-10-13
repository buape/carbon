---
title: doesDirectoryExist
description: Check if a directory exists
hidden: true
---

## Signature

```ts
const doesDirectoryExist: (name: string) => {
	try {
		if (statSync(`${name}`).isDirectory()) return true
		return false
	} catch (_e) {
		return false
	}
}
```


Check if a directory exists
