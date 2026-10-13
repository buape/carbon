---
title: allPermissions
hidden: true
---

## Signature

```ts
const allPermissions: maxPermissions.reduce(
	(permissions, permission) => permissions | permission,
	0n
)
```

