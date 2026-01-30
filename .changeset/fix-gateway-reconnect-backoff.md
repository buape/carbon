---
"@buape/carbon": patch
---

fix: reset reconnect backoff counter on READY/RESUMED instead of WebSocket open to prevent connection storms
