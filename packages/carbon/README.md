# Carbon

<div align="center">
<a href="https://go.buape.com/Discord"><img src="https://cdn.buape.com/CarbonWordmark.png" alt="Carbon Wordmark"></a>

<img alt="Discord" src="https://img.shields.io/discord/744282929684938844?style=for-the-badge">
<img alt="NPM Version" src="https://img.shields.io/npm/v/@buape/carbon?style=for-the-badge">
<img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@buape/carbon?style=for-the-badge">
</div>

> WHAT IS CARBON???????????

## Features

> CARBON FEATURES?????

## Why Carbon?

> CARBON UPSELL?????

## Installation

To get started with Carbon, you can install it via your package manager of choice:

```bash
npm install @buape/carbon
```

To begin with a simple HTTP application that exists to scaffold a new project, showcasing usage of Carbon:

```bash
npx create-carbon-app my-carbon-app
```
## Useful Links

- [Website](https://carbon.buape.com) ([Source](https://github.com/buape/carbon))
- [Documentation](https://carbon.buape.com/docs)
- [Discord](https://go.buape.com/Discord)
- [NPM](https://www.npmjs.com/package/@buape/carbon)


## Examples

### Cloudflare

```ts
import { Client } from "carbon"

const client = new Client()

export default {...client.router}
```

### NodeJS

```ts
import { Client } from "carbon"
import { serve } from "@carbonjs/nodejs"

const client = new Client(
	{
		clientId: process.env.CLIENT_ID!,
		publicKey: process.env.PUBLIC_KEY!,
		token: process.env.DISCORD_TOKEN!
	},
	[new PingCommand()]
)

serve(client, { port: 3000 })
```