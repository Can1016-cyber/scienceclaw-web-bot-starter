# MCP tools reference

These are suggested contracts, not a required MCP implementation. Rename, merge, or replace them to match your knowledge system.

## `search_knowledge`

Input: `{ query: string, scope?: string[], topK?: number }`

Output: `{ results: Array<{ documentId: string, chunkId: string, title: string, excerpt: string, score: number }> }`

Use it for retrieval. Every result should keep a stable document and chunk identifier so citations can be verified later.

## `get_document`

Input: `{ documentId: string }`

Output: `{ title: string, content: string, url?: string, updatedAt?: string, accessScope?: string[] }`

Use it when the Agent needs full context after retrieval. Enforce authorization in the MCP Server, not in the browser.

## `get_citation`

Input: `{ documentId: string, chunkId: string }`

Output: `{ title: string, excerpt: string, url?: string, locator?: string }`

Use it to build auditable source cards. Never generate a citation URL from model text alone.

## `get_page_context`

Input: `{ url: string, title?: string }`

Output: `{ matchedDocumentIds: string[], hints?: string[] }`

Treat current-page context as a retrieval hint. It must not expand the authenticated user's knowledge permissions.

## Strict grounding rule

Your OpenClaw policy should only claim a knowledge-backed answer when the turn returns verifiable evidence. Otherwise return a structured `insufficient_evidence` state and let the Web Bot display: `当前知识库中没有找到足够依据。`
