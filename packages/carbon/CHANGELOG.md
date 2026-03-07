# @buape/carbon

## 0.15.0

### Minor Changes

- 5c08a35: feat(breaking): change listener registration method to Client#registerListener

### Patch Changes

- 51ffa8f: fix: reset gateway heartbeat ack state on reconnects
- ec9a41c: fix: change component registration to allow multiple handlers sharing a custom ID across component types.
- 074caae: chore(deps): update dependency @types/bun to v1.3.8
- 5c08a35: fix: add voice event forwarding
- c4cf6f0: fix: reset reconnect backoff counter on READY/RESUMED instead of WebSocket open to prevent connection storms
- 6eed6eb: fix: avoid crashing when reconnect is requested after socket is already closed

## 0.14.0

### Minor Changes

- f7a0f46: feat: misc performance improvements
- 888c240: feat: Changed BaseInteraction#replyAndWaitForComponent to return the message from the interaction reply
- b4c5614: feat: add a getMember method to the OptionsHandler to get the member data from a user option
- 888c240: feat: Added BaseInteraction#editAndWaitForComponent
- 20973ef: feat: checkbox and radio modal components
- eff69b9: feat: add voice plugin with gateway adapter
- 962f6ce: feat: Add Interaction#targetMessage and Interaction#targetUser for Message and User context menu commands
- 401ade3: feat: allow direct instantiation of certain components
- 3d09205: feat: add support for typing in DMs and group DMs
- deae588: feat: remove client.components in favor of client.componentHandler.findComponent
- 2f9d4ca: feat: Add better ratelimit handling and queue control for the RequestClient
- 3d09205: feat: more heartbeat and event tuning for cpu usage
- deae588: feat: allow globally registered Modals
- e45684b: feat: add Command#getMention method

### Patch Changes

- 095a41b: fix: Add handling to the component customIdParser so long numerical strings do not get casted to a Number
- 0ba80ae: fix: User#createDm took a userId parameter instead of using User#id
- 1406843: fix: Fixed memory leak in `GatewayForwarderPlugin` by properly consuming HTTP response bodies
- 660e2b9: chore: update dependencies
- 0319ad0: fix: Fixed memory leak in ClientManager by consuming request bodies before error responses
- 3d09205: fix: adjust heartbeat timing
- 931dfcb: fix: Adjust how the nextjs handler is created
- 3d09205: fix: handle per-route ratelimiting better
- ec12049: fix: support numbers in autocomplete responses

## 0.13.0

### Minor Changes

- f53e175: feat: remove the Webhook's dependency on the Client
- c143b31: feat: add GuildAvailable and GuildUnavailable events
  This prevents Carbon's gateway plugin from spamming GuildCreate events when it first connects
- f5604c4: feat: remove the guildId parameter from several functions in Role, instead adding it to the constructor that Carbon uses
- f5604c4: feat: add Guild#fetchRoleMemberCounts and Role#fetchMemberCount
- 515dd10: feat: add option to gateway plugin to automatically listen to gateway interactionCreate events
- 67fe8f5: feat: make gateway plugin options accessible to the user
- 2bf2522: feat: Add the file upload component for modals
- bb25fab: feat: add CDN URL methods with format and size support
- 0da2786: feat: add ClientManager plugin for managing multiple clients
- b955a5c: feat: add support for scheduled events

### Patch Changes

- ee937cb: chore(deps): update dependency @types/bun to v1.2.23
- db8230e: chore(deps): update dependencies
- b258984: fix: incorrect content type for commands route from command data plugin

## 0.12.0

### Minor Changes

- a25a9cf: feat: support more select menu types and text displays in modals
- a2d0b68: feat: add support for ephemeral shorthand in message payloads
- 2ed6026: feat: wildcard components and modals
- 74eb89c: feat: add clientId to every event payload
- c07806b: feat: add support for current member set banner/avatar/bio
- 0944494: feat: add support for application emojis and add a guildemoji class
- a25a9cf: feat: make some options/fields getters non-async
  Any getters for users, roles, or mentionables are no longer async, since Discord provides all the needed data already and we don't need to fetch it.
  Additionally, getChannelId/getChannelIds functions have been added to provide a synchronous option when you only need channel IDs, as Discord does not provide enough channel data to construct a full Channel in Carbon.

  This applies to both the FieldsHandler in Modals, and the OptionsHandler for chat interactions

- 9bddb60: feat: allow optional webhook headers for the forwarder plugins

### Patch Changes

- 217b94f: chore(deps): update dependency @types/bun to v1.2.22
- 7875a3c: fix: subcommand `serialize` missing properties

## 0.11.0

### Minor Changes

- acd2a9c: feat: new pinned messages routes
- e729515: feat: updated to new Label components in modals

  #### 🚨 Breaking Changes to Modals

  Carbon now uses Discord's new Label-based modal structure. The old Row-based approach is no longer supported. You can find out more info in [our migration guide](https://carbon.buape.com/even-more/migration-guide#v0110---modal-structure-changes)

- fc680c4: feat: allow functions to be passed to set ephemeral and defer capabilities
- b35008a: feat: allow option-specific autocomplete functions
- f2b3c0b: feat: allow readonly access to the rawData for all classes
- ecab49d: feat: add new ApplicationDeauthorizedEvent

### Patch Changes

- ecab49d: fix: remove `position` from thread channels

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
