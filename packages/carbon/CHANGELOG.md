# @buape/carbon

## 0.10.0

### Minor Changes

- ac7e683: feat: add support for subcommands alongside subcommand groups
- 1aa8613: feat: make Client#validateDiscordRequest protected so it can be overridden
- 4a2e54b: feat: Add support for sending gateway events
- 0a6ec9e: feat: add ping tracking to the gateway plugin
- e48999f: feat: add a Go To Page button for the Paginator
- 4031390: feat: add a isConnected to the gateway plugin

### Patch Changes

- 4818a7e: fix: make Interaction#update() register components automatically like the other methods
- d3a6f2c: chore(deps): update dependency @hono/node-server to v1.18.2
- 028b0d3: chore(deps): update dependency @types/bun to v1.2.18
- 2d28b80: chore(deps): update dependency @types/bun to v1.2.20
- 252dbfd: chore(deps): update dependency ws to v8.18.3
- 93641eb: fix: Made Message#edit, Message#forward, and Message#reply methods properly return a Message class
- f273125: feat: add a createPost function for forum channels
- 07a8385: fix: resolve TypeScript build errors in Web Crypto API usage

## 0.9.0

### Minor Changes

- 379b2b7: feat: Guild#fetchMembers method
- 4b4141d: feat: support commands only in specific guilds
- b5367f6: feat: add a Paginator class (implemented as a plugin)
- 891892a: feat: Poll support
- 7681111: fix: Clean up Listener types, provide raw data for overridden types
- e39de8e: feat: voice state for GuildMember
- 36ab053: feat: prechecks
- 1666d1d: feat: full command data route
- 6af69df: feat: name and description localizations
- 0852797: feat: OptionsHandler#getAttachment
- 8d01c89: feat: Fetch all channels in a guild
- 314b16f: feat: mount components when used, allowing for custom constructor setups
- 3cdcd07: feat: add new and improved global registering of components
- 4650235: feat: Caching
- 6b8c1b9: feat: add sharding to the forwarder plugin
- 314b16f: feat: implement a custom ID parser system for component data specific to each usage of a component
- 8f57795: feat: add fetchRole and fetchRoles methods on a guild
- 7b2b785: feat: Message#disableAllButtons
- 23ad89f: feat: more Guild properties
- 7b2b785: feat: one off components (e.g. confirmation prompts)
- e7e6da9: feat: add an error and docs page for missing components
- ebc7d8b: feat: add more validation for incoming options
- e0b6544: feat: command data plugin
- 7b2b785: feat: have Interaction#reply return a Message you can use
- 7681111: feat: ThreadMember structure
- 4b0dfff: feat: toString() methods to generate mention strings
- bebe424: feat: enforce the 25 choices limit with a console warning
- ed32210: feat: add a way to fetch a guildmember's permissions
- 6daed34: feat: Webhook support
- aeaa47a: feat: return a Message object when you use Channel#send

### Patch Changes

- 1a347b4: feat: add preferred locale to guild
- 4fa2e35: fix: ignore event filter on gateway plugins if not set
- 3591b56: fix(temp): add a patch workaround for https://github.com/buape/carbon/issues/247
- e2b2c69: Fixed gateway's reconnection system
- 8e80185: fix: don't assume that channels and members always exist
- c36a702: fix: update container id from 15 to 17
- bc4a36a: fix: allow description to be optional for commands
- 51df9d3: chore: bump dependencies
- fd678c2: fix: fixed sharding on createIdentifyPayload

## 0.8.0

### Minor Changes

- a095849: feat: components v2
- 98b165b: feat: support files in all MessagePayloads, not just interaction replies
- 50cc5c8: feat: return name and type for autocomplete's getFocused() options as well as value
- 4a1329f: feat: Gateway forwarder plugin to allow gateway events with a serverless http bot
- 4a1329f: feat: add gateway support for server runtimes

### Patch Changes

- cfacfd5: chore: update dependencies
- a095849: fix: make attachments work for standard interaction replies as well as channel sends
- cc80d95: feat: add better fetching for partials, allowing you to reassign with the full class data

## 0.7.0

### Minor Changes

- 4b8d474: feat: webhook events
- 29c323c: feat: command permissions
- 626f3c3: refactor: replace creating handle with new adapters

### Patch Changes

- 6d91c08: chore(deps): update dependency @types/bun to v1.1.18
- 137a2d9: chore: update dependencies
- e20d29c: fix: move base url option back
- c6c60a6: chore: remove beta tag for integrationTypes and contexts on commands
- d5d1488: fix: send allowedMentions to discord in correct format

## 0.6.1

### Patch Changes

- fix: invalid url for hono server
- 5d43f99: refactor: change env vars and options requirements

## 0.6.0

### Minor Changes

- 407d4d2: feat: Bump required node version to v20
- 6ab721f: refactor: move linked roles to core package
- 0802dc2: feat: add icon_url property to embed author object
- 8b489db: New Architecture

### Patch Changes

- c25cfac: fix: make embed data not required to create embed class
- f923485: fix: make ephemeral responses work properly
- Updated dependencies [407d4d2]
  - @buape/carbon-request@0.2.0

## 0.5.0

### Minor Changes

- 9e087a2: feat: add MessagePayload for replies and message sending
  This will allow you to pass just a string to reply with as the content, or the entire message payload.
- 40f797b: feat: add fetchers to client
- 63a6d07: feat: Add topic getter to all guild based text channels

### Patch Changes

- 3bf77fb: fix: `OptionsHandler#getMentionable` always returning user even when invalid
- d76feb7: fix: interaction#options should never be null
- 77b71ef: fix: don't require the user to cast types for button styles
- b29eefd: fix: correctly get options of subcommands and subcommandgroups
- a0074f0: refactor: add partial type parameters to structures to improve field types

## 0.4.2

### Patch Changes

- 6b73575: chore: readme cleanups
- Updated dependencies [6b73575]
  - @buape/carbon-request@0.1.1

## 0.4.1

### Patch Changes

- 5fdd006: fix: `ModalHandler` not awaiting modal run

## 0.4.0

### Minor Changes

- 28f252f: feat: wildcard command
- 50e360e: feat: new message properties and methods

### Patch Changes

- 558b73c: fix: `Client` constructor trying to use handlers being they have been initialized
- 4475a84: fix: set deferred to true in `acknowledge` methods
- 29f8493: fix: don't let new entry point commands block
- 5bc4b84: fix: actually pass `followUp` files to api
- 6239590: fix: component registering
- 0a22fa8: feat: add component interaction `update` method
- 9456bf0: fix: use defaultEphemeral for commands and components

## 0.3.2

### Patch Changes

- dcf5b44: feat: add support for interaction#acknowledge for modals
- c8e7c1c: feat: add followup messages for interactions

## 0.3.1

### Patch Changes

- c80ce0f: feat: embeds

## 0.3.0

### Minor Changes

- f8b608f: fix: new interaction verification
- 50c8200: feat: add ComponentInteraction#acknowledge
- a15bf55: feat: add fields handler
- 51d84c3: feat: add overloads for a required type for options and fields

## 0.2.0

### Minor Changes

- ad9666b: feat: Modal support

### Patch Changes

- 9e93027: feat: make components automatically registered

## 0.1.3

### Patch Changes

- fix: use Request instead of IRequestStrict for Client#handle

## 0.1.2

### Patch Changes

- 2bdc7f3: fix: OptionsHandler#getInteger was not typed correctly
- e79c435: feat: Allow users to use their own router instead of Carbon's router
- 917416a: deps: update dependency discord-api-types to v0.37.99

## 0.1.1

### Patch Changes

- 8438b8d: Add GuildMember structure

## 0.1.0

### Minor Changes

- 1a00131: Initial beta!

  Featuring interactions, commands, messages, subcommands, options, linked roles, and more!

### Patch Changes

- Updated dependencies [1a00131]
  - @buape/carbon-request@0.1.0
