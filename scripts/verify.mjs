import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL ?? 'http://127.0.0.1:18789';
const proxyUrl = process.env.SCIENCECLAW_PROXY_URL ?? 'http://127.0.0.1:4310';
const token = process.env.OPENCLAW_GATEWAY_TOKEN;

let failed = false;

async function check(name, task) {
  try {
    await task();
    console.log(`✓ ${name}`);
  } catch (error) {
    failed = true;
    console.error(`✗ ${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

await check('OpenClaw Gateway health', async () => {
  const response = await fetch(`${gatewayUrl}/health`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
});

await check('OpenClaw model inventory', async () => {
  if (!token) throw new Error('set OPENCLAW_GATEWAY_TOKEN in the server terminal');
  const response = await fetch(`${gatewayUrl}/v1/models`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload.data)) throw new Error('unexpected /v1/models response');
});

await check('MCP knowledge server', async () => {
  await execFileAsync('openclaw', ['mcp', 'doctor', 'scienceclaw-knowledge', '--probe']);
});

await check('Bot API proxy', async () => {
  const response = await fetch(`${proxyUrl}/health`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
});

if (failed) process.exitCode = 1;
