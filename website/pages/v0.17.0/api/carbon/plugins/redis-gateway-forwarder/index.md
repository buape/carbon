---
title: "@buape/carbon API · Plugins / Redis Gateway Forwarder"
description: Auto-generated API documentation
sidebarTitle: "Redis Gateway Forwarder"
---

# @buape/carbon API · Plugins / Redis Gateway Forwarder

## Classes

| Name | Description |
|------|-------------|
| [`RedisStreamGatewayForwarderPlugin`](redisstreamgatewayforwarderplugin) | Forwards gateway events to a Redis Stream (one stream per client) instead of |
| [`RedisStreamGatewayReceiverPlugin`](redisstreamgatewayreceiverplugin) | Receives gateway events from Redis Streams (one stream per client), |
| [`ShardedRedisStreamGatewayForwarderPlugin`](shardedredisstreamgatewayforwarderplugin) |  |

## Interfaces

| Name | Description |
|------|-------------|
| [`RedisStreamDeliveryOptions`](redisstreamdeliveryoptions) |  |
| [`RedisStreamGatewayForwarderPluginOptions`](redisstreamgatewayforwarderpluginoptions) |  |
| [`RedisStreamGatewayReceiverPluginOptions`](redisstreamgatewayreceiverpluginoptions) |  |

## Types

| Name | Description |
|------|-------------|
| [`RedisStreamClient`](redisstreamclient) | Any ioredis client capable of running stream commands. Accepts a plain |
| [`ShardedRedisStreamGatewayForwarderPluginOptions`](shardedredisstreamgatewayforwarderpluginoptions) |  |
