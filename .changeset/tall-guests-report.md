---
"@buape/carbon": minor
---

feat: rewrite GatewayPlugin for better Discord lifecycle handling and extending
- Note: gateway.send(...) now throws when websocket is not open, so guard with gateway.isConnected or use try/catch.
