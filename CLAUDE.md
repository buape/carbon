# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Primary Commands:**
- `pnpm build` - Build all packages except website
- `pnpm test` - Run tests using Vitest
- `pnpm lint` - Run Biome linter with auto-fix
- `pnpm dev` - Start development servers (excludes Cloudflare/socket demo apps)

**Package Management:**
- Uses `pnpm` with workspace configuration
- Requires Node.js >=20
- Uses Turbo for monorepo task running

**Pre-commit:**
- Lefthook runs `pnpm lint` automatically with stage_fixed

## Core Architecture

Carbon is a Discord bot framework built on these key architectural principles:

### Class-Based System
- Abstract base classes define contracts (`BaseCommand`, `BaseInteraction`, `BaseListener`, `BaseComponent`)
- Concrete implementations extend these abstractions
- Heavy use of TypeScript generics for type safety
- All components inherit from base classes with client reference

### Plugin Architecture
- Plugins extend `Plugin` abstract class with `id`, `registerClient()`, and `registerRoutes()` methods
- Core plugins: Gateway (WebSocket), CommandData, LinkedRoles, Sharding, GatewayForwarder
- Plugins can modify client behavior and add HTTP routes

### Multi-Runtime Adapter Pattern
- Separate adapters for Node.js, Cloudflare Workers, Bun, Next.js
- Each adapter exports runtime-specific server creation functions
- Common interface allows same bot code to run across platforms

### Handler System
- `CommandHandler` - Routes slash/user/message commands
- `ComponentHandler` - Manages buttons, select menus
- `ModalHandler` - Handles modal form submissions  
- `EventHandler` - Dispatches gateway events to listeners

### Component Registration
- Auto-registration: Components used in responses are automatically registered
- Global registration: Components registered directly with client
- Command-scoped: Components from command definitions auto-registered

## Directory Structure

### `/packages/carbon/src/` - Core Framework
- `abstracts/` - Abstract base classes defining contracts
- `classes/` - Concrete implementations (Client, Command, Embed, etc.)
- `internals/` - Framework internal handlers and interactions
- `plugins/` - Built-in plugin implementations
- `structures/` - Discord API data structures (Guild, User, Message, etc.)
- `adapters/` - Runtime-specific adapter implementations
- `types/` - TypeScript type definitions and interfaces
- `utils/` - Utility functions and helpers

### `/apps/` - Demo Applications
- `cloudo/` - Cloudflare Workers demo
- `rocko/` - Node.js demo  
- `socketo/` - Socket/gateway demo
- `pointo/` - Point/simple demo

### `/packages/create-carbon/` - CLI Generator
- Template-based project scaffolding
- Runtime-specific template variations

### `/website/` - Documentation Site
- Next.js-based documentation
- Auto-generated API docs from TypeDoc

## Key Patterns When Working With This Codebase

### Command Creation
Commands extend `BaseCommand` and must implement:
- `name: string` - Command name
- `type: ApplicationCommandType` - Command type
- `run()` - Command execution logic
- `serializeOptions()` - Discord API serialization

### Component Usage
Components auto-register when used in interaction replies:
```typescript
await interaction.reply({
  components: [new Row([new MyButton()])]  // Auto-registered
})
```

### Plugin Development  
Plugins should extend `Plugin` class and implement:
- `readonly id: string` - Unique plugin identifier
- `registerClient(client: Client)` - Client setup logic
- `registerRoutes(client: Client)` - Route registration (optional)

### Event Handling
Listeners extend specific event listener classes:
- Override `parseRawData()` to transform Discord data
- Implement `handle()` with typed event data
- Register with client to receive events

### Type Safety
- Use generic types for partial structures: `User<Partial extends boolean>`
- Leverage conditional types: `IfPartial<T, U, V>`
- All interactions and components are strongly typed

## Testing and Quality

- Tests use Vitest framework
- Biome handles linting and formatting with these settings:
  - Semicolons: "asNeeded"
  - Trailing commas: "none"
  - Unused variables: error
- Pre-commit hooks ensure code quality
- TypeScript strict mode enforced

## Important Implementation Notes

- The framework auto-discovers and registers components used in responses
- Plugin architecture allows extending functionality without modifying core
- Multi-runtime support requires adapter-specific testing
- Gateway events require both listener registration and data transformation
- All Discord API structures use Carbon's typed wrappers, not raw Discord types