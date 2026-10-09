# Quickstart: Web Bot → OpenClaw → MCP

This guide runs the reference stack locally. It deliberately keeps model keys and the OpenClaw Gateway token out of browser code.

## 0. Prerequisites

- macOS, Linux, WSL2, or Windows PowerShell.
- OpenClaw installed and onboarded. See `../openclaw/INSTALL.md`.
- Node.js 24.16+ or 26.1+ for current OpenClaw compatibility. Node 26 is recommended by OpenClaw.
- A model Provider configured during `openclaw onboard`.

## 1. Install and verify OpenClaw

```bash
openclaw gateway status
openclaw dashboard
```

Enable the Gateway's OpenAI-compatible endpoint. It is disabled by default:

```bash
openclaw config set gateway.http.endpoints.chatCompletions.enabled true
openclaw gateway restart
```

Verify it from a trusted terminal. Keep the Gateway token server-side:

```bash
curl -sS http://127.0.0.1:18789/v1/models \
  -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN'
```

## 2. Build the reference MCP Server

```bash
cd examples/mcp-knowledge-server
npm install
npm run build
```

Register the local stdio server with OpenClaw. Replace `/ABSOLUTE/PATH/TO/STARTER` with this Starter Kit's absolute path:

```bash
openclaw mcp add scienceclaw-knowledge \
  --command node \
  --arg ./dist/server.js \
  --cwd /ABSOLUTE/PATH/TO/STARTER/examples/mcp-knowledge-server \
  --include 'search_knowledge,get_document,get_citation,get_page_context'
```

Probe the server before using it in an Agent turn:

```bash
openclaw mcp doctor scienceclaw-knowledge --probe
openclaw mcp tools scienceclaw-knowledge --include 'search_knowledge,get_document,get_citation,get_page_context'
```

The included MCP Server uses fabricated demo records. Replace `src/demo-data.ts` with your own repository adapter and enforce authorization inside the server.

## 3. Start the server-side Bot API proxy

```bash
cd examples/bot-api-proxy
cp .env.example .env
```

Edit `.env` and set `OPENCLAW_GATEWAY_TOKEN`. Never put this token in a `VITE_*` variable.

```bash
npm start
```

The reference proxy binds to `127.0.0.1:4310` and exposes:

- `GET /health`
- `POST /api/scienceclaw/chat`

It forwards chat to OpenClaw's `/v1/chat/completions` endpoint and asks the Agent for `{ text, citations }` JSON. Production code should authenticate the website user before forwarding anything.

## 4. Start the Web Bot

From the Starter Kit root:

```bash
npm install
npm run dev
```

In `src/App.tsx`, replace:

```ts
const adapter = createMockAdapter();
```

with:

```ts
const adapter = createOpenClawAdapter('http://127.0.0.1:4310/api/scienceclaw/chat');
```

For production, expose the Bot API on the same origin as your website and keep the adapter path relative: `/api/scienceclaw/chat`.

## 5. Verify the chain

Set the Gateway token in your terminal and run:

```bash
export OPENCLAW_GATEWAY_TOKEN='replace-me'
npm run verify:stack
```

The check verifies the Gateway health, model inventory, MCP server probe, and Bot API proxy health. It does not send a billable model request.

## Official references

- OpenClaw install: https://docs.openclaw.ai/
- OpenClaw onboarding: https://docs.openclaw.ai/start/wizard
- Connect MCP servers: https://docs.openclaw.ai/tools/mcp
- OpenAI-compatible Gateway API: https://github.com/openclaw/openclaw/blob/main/docs/gateway/openai-http-api.md
- Official MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
