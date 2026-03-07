---
"@buape/carbon": patch
---

fix(gateway): invalidate stale resume session after consecutive failures

When the Discord WebSocket drops with a close code that doesn't trigger automatic session invalidation (e.g. 1005), the gateway now clears the session after 3 consecutive failed reconnect attempts and falls back to a fresh IDENTIFY. This prevents infinite resume loops, particularly when maxAttempts is set to a high value.
