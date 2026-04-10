# Carbon

<div align="center">
<a href="https://go.buape.com/carbon"><img src="https://cdn.buape.com/carbon/wordmark.png" alt="Carbon Wordmark"></a>

<img alt="Discord" src="https://img.shields.io/discord/1280628625904894072?style=for-the-badge">
<img alt="NPM Version" src="https://img.shields.io/npm/v/@buape/carbon?style=for-the-badge">
<img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@buape/carbon?style=for-the-badge">
</div>

Carbon is a fully typed Discord bot framework for TypeScript that helps you ship quickly with HTTP interactions first, then scale into richer features through plugins, reusable classes, and optional Gateway support without rewriting your architecture later.

## Features

- Build every common interaction type in one place: slash commands, user/message commands, buttons, select menus, and modals.
- Start with simple HTTP interactions, then add Gateway or Gateway Forwarder only when your bot needs non-interaction events.
- Run the same bot across Node.js, Bun, and Fetch-style runtimes like Cloudflare Workers or Next.js.
- Components can register themselves automatically, and you can still register them globally or per command when you need persistence.
- For quick flows, you can parse custom IDs cleanly and wait for a single component click with `replyAndWaitForComponent`.
- Use prechecks and wildcard handlers to add safety rules and fallback behavior without turning command code into a mess.
- Host multiple Discord applications from one deployment with `ClientManager`.
- Grow through plugins like Linked Roles, Command Data, Paginator, Sharding, and Voice.
- Tune request/event processing with queue lanes, concurrency controls, and runtime metrics when traffic grows.

## Installation

To get started with Carbon, you can check out the [Getting Started](https://carbon.buape.com/carbon/getting-started) guides for your preferred platform.

## Useful Links

- [Documentation](https://carbon.buape.com/carbon)
- [Discord](https://go.buape.com/carbon)
- [NPM](https://www.npmjs.com/package/@buape/carbon)
- [Cloudflare Workers Demo](https://github.com/buape/carbon/tree/main/apps/cloudo)
- [Node.js Demo](https://github.com/buape/carbon/tree/main/apps/rocko)

## Contributing

We welcome contributions to Carbon! If you're interested in contributing, please check out the [Contributing Guide](https://carbon.buape.com/even-more/contributing) for more information, and join our [Discord](https://go.buape.com/carbon) to get involved!
