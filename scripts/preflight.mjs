import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL ?? 'http://127.0.0.1:18789';
const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
const mcpNameIndex = process.argv.indexOf('--mcp-name');
const mcpName = mcpNameIndex >= 0 ? process.argv[mcpNameIndex + 1] : undefined;
const results = [];

function add(level, name, detail) {
  results.push({ level, name, detail });
}

async function run(command, args, timeout = 7000) {
  return execFileAsync(command, args, { timeout, windowsHide: true });
}

try {
  const { stdout, stderr } = await run('openclaw', ['--version']);
  const version = `${stdout}${stderr}`.trim().split(/\r?\n/)[0] || 'version reported';
  add('PASS', 'OpenClaw CLI', version);
} catch (error) {
  if (error?.code === 'ENOENT') {
    add('FAIL', 'OpenClaw CLI', 'not found; use openclaw/INSTALL.md only if this machine should host OpenClaw');
  } else {
    add('FAIL', 'OpenClaw CLI', 'installed but version check failed');
  }
}

try {
  await run('openclaw', ['gateway', 'status']);
  add('PASS', 'Gateway status', 'the existing CLI reports a running Gateway');
} catch {
  add('WARN', 'Gateway status', 'unavailable; inspect with `openclaw gateway status` before changing configuration');
}

try {
  const response = await fetch(`${gatewayUrl}/health`, { signal: AbortSignal.timeout(2500) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  add('PASS', 'Gateway health', 'the configured endpoint responds');
} catch {
  add('WARN', 'Gateway health', 'the configured endpoint did not answer on its health route');
}

if (!gatewayToken) {
  add('WARN', 'Gateway authentication', 'OPENCLAW_GATEWAY_TOKEN is not set in this server terminal; no authenticated request was attempted');
} else {
  try {
    const response = await fetch(`${gatewayUrl}/v1/models`, {
      headers: { authorization: `Bearer ${gatewayToken}` },
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.data)) throw new Error('unexpected response');
    add('PASS', 'Authenticated model inventory', `${payload.data.length} model entries returned; token value was not printed`);
  } catch {
    add('WARN', 'Authenticated model inventory', 'request failed; confirm the token and website-facing endpoint without exposing the token to the browser');
  }
}

if (mcpName) {
  try {
    await run('openclaw', ['mcp', 'doctor', mcpName, '--probe'], 15000);
    add('PASS', 'MCP registration', `${mcpName} passed the OpenClaw probe`);
  } catch {
    add('WARN', 'MCP registration', `${mcpName} did not pass the OpenClaw probe`);
  }
} else {
  add('INFO', 'MCP registration', 'not probed; pass `--mcp-name NAME` to inspect an existing registration');
}

const symbols = { PASS: '✓', WARN: '!', FAIL: '✗', INFO: '·' };
for (const result of results) {
  console.log(`${symbols[result.level]} ${result.level.padEnd(4)} ${result.name}: ${result.detail}`);
}

console.log('\nRead-only check complete. No OpenClaw configuration was written and no service was restarted.');
if (results.some((result) => result.level === 'FAIL')) process.exitCode = 1;
