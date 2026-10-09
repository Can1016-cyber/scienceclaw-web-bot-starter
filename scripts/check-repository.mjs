import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const rootPath = fileURLToPath(root);
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const required = [
  'README.md',
  'README.zh-CN.md',
  'LICENSE',
  'docs/EXISTING_OPENCLAW.md',
  'examples/mcp-knowledge-server/src/server.ts',
  'examples/bot-api-proxy/server.mjs',
];
const problems = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

for (const requiredPath of required) {
  try {
    await stat(join(rootPath, requiredPath));
  } catch {
    problems.push(`missing required file: ${requiredPath}`);
  }
}

for (const path of await walk(rootPath)) {
  const displayPath = relative(rootPath, path);
  if (displayPath.endsWith('/.env') || displayPath === '.env') problems.push(`environment file must not be committed: ${displayPath}`);
  const info = await stat(path);
  if (info.size > 1_000_000) continue;
  const content = await readFile(path, 'utf8').catch(() => '');
  if (/\/Users\/[A-Za-z0-9._-]+\//.test(content)) problems.push(`absolute user path found: ${displayPath}`);
  if (/(api[_-]?key|client[_-]?secret|private[_-]?token)\s*[:=]\s*['"][^'"\s]{8,}/i.test(content)) {
    problems.push(`credential-like value found: ${displayPath}`);
  }
}

if (problems.length) {
  for (const problem of problems) console.error(`✗ ${problem}`);
  process.exitCode = 1;
} else {
  console.log('Repository safety check passed.');
}
