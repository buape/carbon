---
title: ClientManagerStartupResult
hidden: true
---

## interface `ClientManagerStartupResult`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| total | `number` | Yes |  |
| successes | `number` | Yes |  |
| failures | `number` | Yes |  |
| completedAt | `number` | Yes |  |
| results | `Array<{
		clientId: ApplicationId | "unknown"
		status: "success" | "error"
		error?: string
	}>` | Yes |  |
