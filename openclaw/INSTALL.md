# Install OpenClaw

These commands were checked against the official OpenClaw documentation on 2026-10-08. Always review the official documentation before production installation because installer behavior and runtime requirements can change.

## macOS / Linux / WSL2

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

The official installer detects the OS, provisions a supported Node.js runtime when needed, installs OpenClaw, and starts onboarding.

## Windows PowerShell

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

## npm alternative

If your team already manages Node.js, OpenClaw currently requires Node.js 24.16+ or 26.1+ and recommends Node 26:

```bash
npm install -g openclaw@latest --allow-scripts=openclaw
openclaw onboard --install-daemon
```

For npm 11.15 and earlier, the official repository says to omit `--allow-scripts=openclaw`.

## Verify the installation

```bash
openclaw --version
openclaw gateway status
openclaw dashboard
```

Onboarding verifies model access, creates the workspace, and configures the Gateway. Do not copy model credentials into this Starter Kit.

## Enable the website-facing server API

OpenClaw's OpenAI-compatible Chat Completions endpoint is disabled by default. Enable it explicitly:

```bash
openclaw config set gateway.http.endpoints.chatCompletions.enabled true
openclaw gateway restart
```

Smoke test the endpoint from a trusted terminal:

```bash
curl -sS http://127.0.0.1:18789/v1/models \
  -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN'
```

Treat this endpoint as operator-level access. Keep the Gateway bound to loopback or protected private ingress, keep its token only in the server-side Bot API proxy, and never expose it directly to browser code.

## Official references

- https://docs.openclaw.ai/
- https://github.com/openclaw/openclaw
- https://docs.openclaw.ai/cli
- https://docs.openclaw.ai/start/wizard
- https://docs.openclaw.ai/tools/mcp
