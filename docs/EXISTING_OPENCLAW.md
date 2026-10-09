# Using an existing OpenClaw installation

This path is for teams that already operate OpenClaw. The Starter Kit must adapt to that installation; it must not reinstall OpenClaw, replace the team's Agent, or overwrite configuration.

## 1. Run the read-only preflight

```bash
npm install
npm run preflight
```

The check reports only capability status:

- whether the `openclaw` CLI is available;
- whether `openclaw gateway status` succeeds;
- whether the configured loopback Gateway responds;
- whether the server terminal has a Gateway token;
- whether the authenticated model inventory endpoint responds.

It does not write configuration, restart a service, print a token, or make a model request.

To probe an MCP registration that already exists:

```bash
npm run preflight -- --mcp-name scienceclaw-knowledge
```

The probe is read-only, but it can start the configured stdio MCP child process long enough to inspect it.

## 2. Compare capabilities, not files

Do not copy `openclaw/openclaw.example.json5` over an existing configuration. Treat it as a list of intended capabilities:

- the Gateway remains on loopback or protected private ingress;
- authentication is enabled;
- the website-facing Chat Completions endpoint is explicitly enabled;
- only the required knowledge tools are exposed to the website Agent;
- the MCP Server enforces document authorization.

Review the team's current configuration and apply only missing keys through the team's normal change process.

## 3. Use a dedicated website surface

Prefer a dedicated website Agent/policy profile over reusing an operator or personal Agent. Keep write tools, shell tools, and unrelated MCP servers outside the website tool allowlist.

Register the sample MCP Server under a unique name if `scienceclaw-knowledge` is already used. Pass the same name to preflight:

```bash
npm run preflight -- --mcp-name your-unique-name
```

## 4. Connect through a server boundary

The browser must call the host website's authenticated Bot API. That API calls OpenClaw. Do not expose the Gateway token or a trusted user ID to `src/bot/adapters.ts`.

Use `examples/bot-api-proxy` only as a local reference. Before production, add the host application's session validation, organization/user binding, rate limits, audit records, and cancellation.

## 5. Validate without disrupting the existing service

Run integration tests against a dedicated test Agent and fabricated knowledge records first. Do not point acceptance tests at a production knowledge index. The expected scenarios are listed in [VALIDATION.md](VALIDATION.md).
