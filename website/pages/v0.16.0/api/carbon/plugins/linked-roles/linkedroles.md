---
title: LinkedRoles
description: This class is the main class that is used for the linked roles feature of Carbon.
hidden: true
---

## class `LinkedRoles`

This class is the main class that is used for the linked roles feature of Carbon.
It handles all the additional routes and oauth.

```ts
import { Client, ApplicationRoleConnectionMetadataType } from "@buape/carbon"
import { LinkedRoles } from "@buape/carbon/linked-roles"

const linkedRoles = new LinkedRoles({
  metadata: [
	   {
		   key: "is_staff",
		   name: "Verified Staff",
		   description: "Whether the user is a verified staff member",
		   type: ApplicationRoleConnectionMetadataType.BooleanEqual
	   }
  ],
  metadataCheckers: {
    is_staff: async (userId) => {
      const allStaff = ["439223656200273932"]
      return allStaff.includes(userId)
    }
  }
})

const client = new Client({ ...  }, [ ... ], [linkedRoles])
```

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `unknown` | Yes |  |
| client | `Client` | No |  |
| options | `LinkedRolesOptions` | Yes |  |
| registerClient | `(client: Client) => void` | Yes |  |
| registerRoutes | `(client: Client) => void` | Yes |  |
| assertRegistered | `() => asserts this is { client: Client }` | Yes |  |
| handleDeployRequest | `() => void` | Yes | Handle a request to deploy the linked roles to Discord @returns A response |
| handleUserVerificationRequest | `() => void` | Yes | Handle the verify user request @returns A response |
| handleUserVerificationCallbackRequest | `(req: Request) => void` | Yes | Handle the verify user callback request @param req The request @returns A response |
| getMetadataFromCheckers | `(userId: string) => void` | Yes |  |
| getOAuthTokens | `(code: string) => void` | Yes |  |
| updateMetadata | `(userId: string, metadata: Record<string, unknown>, tokens: Tokens) => void` | Yes |  |
| setMetadata | `(data: typeof this.options.metadata) => void` | Yes |  |
