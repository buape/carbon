---
title: processTemplate
description: Processes the template using the provided context
hidden: true
---

## Signature

```ts
const processTemplate: async (
	context: Omit<TemplateContext, "versions">
) => {
	const templatePath = resolve(import.meta.dirname, "../../../template")
	debug("Processing template")
	debug("Getting dependency versions")
	const packageVersions = await getDependencyVersions()
	const jointContext = { ...context, versions: packageVersions }
	debug("Using context", jointContext)
	processFolder(templatePath, jointContext)
	debug("Template processed")
}
```


Processes the template using the provided context
