# Security boundary checklist

The Starter Kit is intentionally not an identity or authorization product. Before production deployment:

## Browser

- Never expose model keys, MCP credentials, or the OpenClaw Gateway token.
- Treat `botId`, page URL, and browser-provided user IDs as untrusted public input.
- Keep current-page context to a title/URL hint; do not let it expand access.

## Bot API proxy

- Authenticate the website user using the host application's existing session.
- Bind every conversation to `(app_id, organization_id, user_id)` on the server.
- Apply rate limits, body limits, timeouts, cancellation, and audit records.
- Keep OpenClaw on loopback or protected private ingress.
- Store `OPENCLAW_GATEWAY_TOKEN` in a server-side secret store.

## OpenClaw

- Use a dedicated Agent or policy profile for the website surface.
- Allow only the MCP tools required by the Bot.
- Review tool approvals and keep write tools out of a read-only knowledge assistant.
- Treat the Gateway's Chat Completions endpoint as operator-level access.

## MCP Server

- Authenticate every request or inherit a verified identity from a trusted server boundary.
- Enforce document authorization before retrieval and again before returning citations.
- Return stable document/chunk identifiers; never accept a model-generated source URL as proof.
- Log tool name, principal, document IDs, policy decision, latency, and error state without logging secrets or unnecessary content.

## Strict grounding

Prompt rules improve behavior but do not establish trust. The server should mark whether evidence was actually returned and render `当前知识库中没有找到足够依据。` when strict mode has no verifiable evidence.
