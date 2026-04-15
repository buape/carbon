---
title: Route
hidden: true
---

## interface `Route`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| method | `"GET" | "POST" | "PUT" | "PATCH" | "DELETE"` | Yes | The HTTP method of the route |
| path | ``/${string}`` | Yes | The relative path of the route |
| handler | `(req: Request, ctx: Context) => Response | Promise<Response>` | Yes | The handler function for the route @param req The request object @param ctx The context object @returns The response object or a promise that resolves to a response object |
| protected | `boolean` | No | Whether this route requires authentication |
| disabled | `boolean` | No | Whether this route is disabled |
