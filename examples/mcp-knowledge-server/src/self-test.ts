import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { fileURLToPath } from 'node:url';

const serverPath = fileURLToPath(new URL('../dist/server.js', import.meta.url));
const client = new Client({ name: 'scienceclaw-reference-self-test', version: '0.1.0' });
const transport = new StdioClientTransport({ command: process.execPath, args: [serverPath] });

await client.connect(transport);

const expectedTools = ['search_knowledge', 'get_document', 'get_citation', 'get_page_context'];
const { tools } = await client.listTools();
for (const name of expectedTools) {
  if (!tools.some((tool) => tool.name === name)) throw new Error(`Missing MCP tool: ${name}`);
}

const result = await client.callTool({
  name: 'search_knowledge',
  arguments: { query: 'thermal conductivity', topK: 2 },
});
if (!JSON.stringify(result).includes('demo-aerogel-024')) {
  throw new Error('search_knowledge did not return the deterministic demo record');
}

await client.close();
console.log(`MCP self-test passed: ${expectedTools.join(', ')}`);
