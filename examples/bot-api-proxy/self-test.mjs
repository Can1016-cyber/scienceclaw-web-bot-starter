import { spawn } from 'node:child_process';

const port = '4317';
const child = spawn(process.execPath, ['server.mjs'], {
  cwd: new URL('.', import.meta.url),
  env: {
    ...process.env,
    OPENCLAW_GATEWAY_TOKEN: 'local-self-test-only',
    SCIENCECLAW_PROXY_PORT: port,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

async function waitForHealth() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      const body = await response.json();
      if (response.ok && body.ok === true) return body;
    } catch {
      // The child process may still be binding its loopback socket.
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('Reference Bot API did not become healthy');
}

try {
  const health = await waitForHealth();
  console.log(`Bot API self-test passed: ${health.service}`);
} finally {
  child.kill('SIGTERM');
}
