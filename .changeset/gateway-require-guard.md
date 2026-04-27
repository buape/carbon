---
"@buape/carbon": patch
---

Guard gateway `createRequire(import.meta.url)` initialization so Cloudflare Worker deploy validation does not crash when `import.meta.url` is unavailable.
