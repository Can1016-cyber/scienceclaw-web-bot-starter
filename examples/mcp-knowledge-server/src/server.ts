import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

import { demoDocuments } from './demo-data.js';

function jsonResult(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] };
}

function errorResult(message: string) {
  return { isError: true, content: [{ type: 'text' as const, text: message }] };
}

function createServer() {
  const server = new McpServer({
    name: 'scienceclaw-reference-knowledge',
    version: '0.1.0',
  });

  server.registerTool(
    'search_knowledge',
    {
      description: 'Search authorized team knowledge and return stable document/chunk identifiers.',
      inputSchema: z.object({
        query: z.string().min(1),
        scope: z.array(z.string()).optional(),
        topK: z.number().int().min(1).max(10).default(5),
      }),
    },
    async ({ query, scope, topK }) => {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      const allowed = new Set(scope ?? ['demo:public']);
      const results = demoDocuments
        .filter((document) => document.accessScope.some((item) => allowed.has(item)))
        .flatMap((document) => document.chunks.map((chunk) => {
          const haystack = `${document.title} ${chunk.text}`.toLowerCase();
          const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
          return {
            documentId: document.id,
            chunkId: chunk.id,
            title: document.title,
            excerpt: chunk.text,
            score,
          };
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

      return jsonResult({ results });
    },
  );

  server.registerTool(
    'get_document',
    {
      description: 'Read one authorized document after retrieval.',
      inputSchema: z.object({ documentId: z.string().min(1) }),
    },
    async ({ documentId }) => {
      const document = demoDocuments.find((item) => item.id === documentId);
      if (!document) return errorResult('Document not found or not authorized.');
      return jsonResult({
        documentId: document.id,
        title: document.title,
        content: document.chunks.map((chunk) => chunk.text).join('\n\n'),
        url: document.url,
        updatedAt: document.updatedAt,
        accessScope: document.accessScope,
      });
    },
  );

  server.registerTool(
    'get_citation',
    {
      description: 'Resolve a retrieved document/chunk pair into a verifiable citation card.',
      inputSchema: z.object({
        documentId: z.string().min(1),
        chunkId: z.string().min(1),
      }),
    },
    async ({ documentId, chunkId }) => {
      const document = demoDocuments.find((item) => item.id === documentId);
      const chunk = document?.chunks.find((item) => item.id === chunkId);
      if (!document || !chunk) return errorResult('Citation not found or not authorized.');
      return jsonResult({
        id: `${document.id}:${chunk.id}`,
        title: document.title,
        excerpt: chunk.text,
        url: document.url,
        locator: chunk.id,
      });
    },
  );

  server.registerTool(
    'get_page_context',
    {
      description: 'Map the current website page to retrieval hints without expanding permissions.',
      inputSchema: z.object({
        url: z.string().min(1),
        title: z.string().optional(),
      }),
    },
    async ({ url, title }) => {
      const input = `${url} ${title ?? ''}`.toLowerCase();
      const matchedDocumentIds = demoDocuments
        .filter((document) => input.split(/[^a-z0-9]+/).some((term) => term.length > 3 && document.url.toLowerCase().includes(term)))
        .map((document) => document.id);
      return jsonResult({ matchedDocumentIds, hints: ['Page context is a retrieval hint, not an authorization grant.'] });
    },
  );

  return server;
}

void serveStdio(createServer);
console.error('ScienceClaw reference MCP knowledge server is listening on stdio.');
