# ScienceClaw Web Bot Starter

[![CI](https://github.com/Can1016-cyber/scienceclaw-web-bot-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/Can1016-cyber/scienceclaw-web-bot-starter/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

An editable, self-hosted Web Bot starter for teams that already run—or plan to run—OpenClaw and an MCP knowledge server.

> 中文说明：[README.zh-CN.md](README.zh-CN.md)

ScienceClaw supplies the website-facing Bot, reference contracts, a runnable demo MCP server, and a server-side Gateway proxy. Your team owns OpenClaw, model providers, identity, authorization, knowledge retrieval, and production operations.

## Why this repository exists

Knowledge teams should not have to rebuild streaming chat, citations, retry behavior, session UI, and the browser/server security boundary for every website. This repository provides a transparent starting point without turning ScienceClaw into a hosted model or knowledge platform.

The repository is useful when a team can:

1. Run the Bot locally without any external API.
2. Build and self-test the four reference MCP tools.
3. Connect the server-side proxy to a dedicated OpenClaw environment.
4. Replace fabricated records with an authorized repository adapter.
5. Prove grounded answers, visible citations, and refusal when evidence is absent.

## Choose your path

### I already have OpenClaw

Do not reinstall or replace your configuration. Start with the read-only compatibility check:

```bash
npm install
npm run preflight
```

Then follow [Using an existing OpenClaw installation](docs/EXISTING_OPENCLAW.md). The preflight command does not write OpenClaw configuration, print credentials, or restart services.

### I do not have OpenClaw yet

Review [OpenClaw installation notes](openclaw/INSTALL.md), then follow the complete [local quickstart](docs/QUICKSTART.md).

### I only want to preview the Web Bot

```bash
npm install
npm run dev
```

Open <http://127.0.0.1:4301>. The default adapter is deterministic and does not call a model.

## Included

- Reusable React + TypeScript `BotWidget` with centralized configuration.
- Deterministic local adapter for UI development.
- Same-origin OpenClaw adapter contract with no browser-side secret.
- Runnable stdio MCP server exposing four reference knowledge tools.
- Server-side Bot API proxy that keeps the Gateway token out of the browser.
- Strict-grounding Agent policy and structured citation guidance.
- Read-only preflight and non-billable stack verification commands.
- GitHub Actions for the Bot, MCP server, proxy, and repository-safety checks.

## Repository map

```text
src/                              Web Bot UI, config and adapters
examples/mcp-knowledge-server/    Runnable deterministic stdio MCP Server
examples/bot-api-proxy/           Server-only OpenClaw Gateway proxy
openclaw/                         Install, config and Agent policy references
docs/                             Quickstarts, validation and security guidance
scripts/preflight.mjs             Read-only existing-installation checks
scripts/verify.mjs                Non-billable connected-stack checks
```

## Validation commands

```bash
npm ci
npm run build
npm run check:repo

cd examples/mcp-knowledge-server
npm ci
npm test

cd ../bot-api-proxy
npm test
```

See [VALIDATION.md](docs/VALIDATION.md) for acceptance scenarios and the difference between CI validation and a real OpenClaw integration test.

## Security boundary

Never place model keys, MCP credentials, the OpenClaw Gateway token, or trusted user identifiers in browser code or `VITE_*` variables. Production knowledge authorization must be enforced inside trusted server boundaries. Review [SECURITY.md](docs/SECURITY.md) before connecting real data.

All bundled records and citations are fabricated demonstration data. This repository does not connect to PolyWiki, BioWiki, or any private knowledge source.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Changes are released under [Apache-2.0](LICENSE).
