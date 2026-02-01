# Proxy Support Design

## Overview

Add HTTP proxy support for Carbon framework to enable routing Discord API requests and Gateway WebSocket connections through a proxy server.

## Requirements

- Support both HTTP API requests and WebSocket Gateway connections
- Use environment variable `DISCORD_HTTP_PROXY` for configuration
- Support programmatic configuration via `options.proxyUrl`
- Multiple runtime support: Node.js, Bun, Cloudflare Workers

## Environment Variables

### DISCORD_HTTP_PROXY

Sets the proxy server for all Discord requests (HTTP API + WebSocket).

**Format**: `http://[user:pass@]host:port`

**Examples**:
```bash
export DISCORD_HTTP_PROXY=http://127.0.0.1:7891
export DISCORD_HTTP_PROXY=http://user:pass@proxy.example.com:8080
```

### Priority (highest to lowest)

1. `options.proxyUrl` - Programmatic configuration
2. `DISCORD_HTTP_PROXY` - Discord-specific environment variable
3. `HTTP_PROXY` / `HTTPS_PROXY` - Generic proxy variables (fallback)
4. Direct connection (no proxy)

## Architecture

### New Module: `src/utils/proxy.ts`

**Functions**:
- `getProxyUrl(targetUrl?: string, configuredProxy?: string): string | null`
  - Reads environment variables in priority order
  - Returns proxy URL or null if no proxy configured

- `createProxyAgent(proxyUrl: string)`
  - Creates appropriate proxy agent for current runtime
  - Returns `HttpsProxyAgent` for Node.js
  - Returns null for unsupported runtimes (Cloudflare Workers)

**Runtime Support**:
- **Node.js**: Uses `https-proxy-agent` package
- **Bun**: Needs testing for proxy agent support
- **Cloudflare Workers**: Returns null (not supported)

### Modify: `RequestClient`

**Changes**:

1. Add to `RequestClientOptions`:
```typescript
proxyUrl?: string
```

2. Constructor:
- Store `this.proxyUrl` from options or environment variable
- Create proxy agent if configured

3. In `executeRequest()`:
- Use proxy agent when making fetch requests
- Handle unsupported runtimes gracefully

### Modify: `GatewayPlugin`

**Changes**:

1. Add to `GatewayPluginOptions`:
```typescript
proxyUrl?: string
```

2. Update `createWebSocket(url: string)`:
- Check for proxy configuration
- Pass proxy agent to WebSocket constructor if available

```typescript
protected createWebSocket(url: string): WebSocket {
  if (!url) throw new Error("Gateway URL is required")

  const proxyUrl = this.options.proxyUrl || getProxyUrl(url)
  if (proxyUrl) {
    const agent = createProxyAgent(proxyUrl)
    return new WebSocket(url, { agent })
  }

  return new WebSocket(url)
}
```

## Dependencies

**Add to `package.json`**:
```json
{
  "dependencies": {
    "https-proxy-agent": "^7.0.0"
  }
}
```

**Rationale**: `https-proxy-agent` supports both:
- HTTP fetch requests via undici (Node.js fetch implementation)
- WebSocket connections via ws library

## Error Handling

1. **Invalid proxy URL format**:
   - Log warning
   - Fall back to direct connection
   - Continue normal operation

2. **Proxy connection failure**:
   - Let original network error propagate
   - WebSocket: trigger reconnect mechanism

3. **Unsupported runtime**:
   - Cloudflare Workers: silently ignore proxy config
   - Dev mode: log warning for user awareness

## Testing

### Unit Tests

**`proxy.ts` tests**:
- Environment variable reading and priority
- Proxy URL parsing (with/without authentication)
- `getProxyUrl()` returns correct proxy for different scenarios

**RequestClient tests**:
- Proxy agent creation and usage
- Options override environment variables
- Proxy URL invalid format handling

**GatewayPlugin tests**:
- WebSocket receives correct agent option
- Proxy configuration propagation

### Manual Testing

1. Set up local proxy (Clash, v2ray, etc.)
2. Configure `DISCORD_HTTP_PROXY`
3. Verify HTTP API requests go through proxy
4. Verify WebSocket Gateway connection goes through proxy
5. Test on Node.js and Bun runtimes

## Documentation Updates

### Add to getting started guide:

```markdown
## Proxy Configuration

Carbon supports routing Discord requests through an HTTP proxy.

### Environment Variable

Set `DISCORD_HTTP_PROXY` to your proxy server URL:

\`\`\`bash
export DISCORD_HTTP_PROXY=http://127.0.0.1:7891
pnpm dev
\`\`\`

### Programmatic Configuration

\`\`\`typescript
const client = new Client({
  // ... other options
  proxyUrl: "http://127.0.0.1:7891"
})
\`\`\`

**Note**: Proxy support is not available in Cloudflare Workers environment.
```

### API Documentation

- Add `proxyUrl` to `RequestClientOptions` JSDoc
- Add `proxyUrl` to `GatewayPluginOptions` JSDoc
- Mark runtime support for each

## Implementation Checklist

- [ ] Add `https-proxy-agent` dependency
- [ ] Create `src/utils/proxy.ts` module
- [ ] Modify `RequestClient` class
- [ ] Modify `GatewayPlugin` class
- [ ] Add unit tests
- [ ] Update documentation
- [ ] Manual testing on multiple runtimes
