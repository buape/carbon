import type { Cluster, Redis } from "ioredis"

/**
 * Any ioredis client capable of running stream commands. Accepts a plain
 * `Redis` connection or a `Cluster` client interchangeably.
 */
export type RedisStreamClient = Redis | Cluster
