# @buape/carbon

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
