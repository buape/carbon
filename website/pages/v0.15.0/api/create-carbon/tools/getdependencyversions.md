---
title: getDependencyVersions
description: Get the versions of the dependencies used in the project
hidden: true
---

## Signature

```ts
const getDependencyVersions: async () => {
	const versionPromises = Object.entries(dependencies).map(
		async ([pkg, pin]) => {
			const version = await getNpmPackageVersion(pkg, pin)
			return [pkg, version] as [string, string]
		}
	)

	const versions = {} as Record<Dependency, string>
	const resolvedVersions = await Promise.all(versionPromises)
	for (const [pkg, version] of resolvedVersions)
		versions[pkg as Dependency] = version
	return versions
}
```


Get the versions of the dependencies used in the project
