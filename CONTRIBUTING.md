# Contributing

Issues and pull requests are welcome for reproducible bugs, documentation gaps, compatibility findings, and generally useful integration improvements.

## Before opening a pull request

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

Do not include real model credentials, Gateway tokens, internal addresses, private knowledge content, or user data. Keep example records clearly fabricated.

Changes to the MCP contracts should explain migration impact. Changes to strict grounding must include both a supported-question and an unsupported-question scenario.
