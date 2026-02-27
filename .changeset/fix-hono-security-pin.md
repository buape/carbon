---
"@buape/carbon": patch
---

The node adapter (`adapters/node`) uses `@hono/node-server`, which declares `hono` as a peer dependency (`^4`). Without a minimum version floor on `hono` itself, consumers who don't have `hono` as a direct dependency may resolve to a version below `4.11.10`, which contains a timing comparison vulnerability in `basicAuth` ([GHSA-jmr7-xgp7-cmfj](https://github.com/advisories/GHSA-jmr7-xgp7-cmfj)).

`hono` is now declared as an optional dependency with `>=4.11.10` so that package managers resolve a safe version for consumers using the node adapter.

If you are using the node adapter and manage `hono` explicitly in your own `package.json`, ensure it is at `>=4.11.10`.
