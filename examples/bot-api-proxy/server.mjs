import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';

const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL ?? 'http://127.0.0.1:18789';
const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
const port = Number.parseInt(process.env.SCIENCECLAW_PROXY_PORT ?? '4310', 10);
const allowedOrigin = process.env.SCIENCECLAW_ALLOWED_ORIGIN ?? 'http://127.0.0.1:4301';

if (!gatewayToken) {
  console.error('OPENCLAW_GATEWAY_TOKEN is required. Copy .env.example to .env and set a server-side token.');
  process.exit(1);
}

function sendJson(response, status, payload, origin) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-origin': origin === allowedOrigin ? origin : allowedOrigin,
    'vary': 'origin',
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > 1_000_000) throw new Error('request body too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function normalizeAgentReply(content) {
  const text = typeof content === 'string' ? content : JSON.stringify(content ?? '');
  const candidate = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  try {
    const parsed = JSON.parse(candidate);
    const citations = Array.isArray(parsed.citations)
      ? parsed.citations.slice(0, 10).filter((item) => item && typeof item.title === 'string').map((item) => ({
          id: typeof item.id === 'string' ? item.id : randomUUID(),
          title: item.title,
          excerpt: typeof item.excerpt === 'string' ? item.excerpt : '',
          ...(typeof item.url === 'string' ? { url: item.url } : {}),
        }))
      : [];
    return { text: typeof parsed.text === 'string' ? parsed.text : text, citations };
  } catch {
    return { text, citations: [] };
  }
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin ?? '';

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'access-control-allow-origin': origin === allowedOrigin ? origin : allowedOrigin,
      'access-control-allow-methods': 'POST, GET, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '600',
      'vary': 'origin',
    });
    response.end();
    return;
  }

  if (request.method === 'GET' && request.url === '/health') {
    sendJson(response, 200, { ok: true, service: 'scienceclaw-reference-bot-api' }, origin);
    return;
  }

  if (request.method !== 'POST' || request.url !== '/api/scienceclaw/chat') {
    sendJson(response, 404, { error: 'not_found' }, origin);
    return;
  }

  if (origin && origin !== allowedOrigin) {
    sendJson(response, 403, { error: 'origin_not_allowed' }, origin);
    return;
  }

  try {
    const body = await readJson(request);
    if (!body || typeof body.prompt !== 'string' || !body.prompt.trim()) {
      sendJson(response, 400, { error: 'prompt_required' }, origin);
      return;
    }

    const conversationId = typeof body.conversationId === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(body.conversationId)
      ? body.conversationId
      : randomUUID();
    const pageHint = body.pageContext && typeof body.pageContext.title === 'string'
      ? `Current page hint: ${body.pageContext.title} (${String(body.pageContext.url ?? '')}).`
      : 'No current-page hint was supplied.';
    const strictRule = body.strictGrounding
      ? 'Use approved MCP knowledge tools before knowledge claims. If evidence is insufficient, say exactly: 当前知识库中没有找到足够依据。'
      : 'Use approved MCP knowledge tools when they are relevant.';

    const gatewayResponse = await fetch(`${gatewayUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${gatewayToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openclaw/default',
        user: `web:${conversationId}`,
        messages: [
          {
            role: 'system',
            content: `${strictRule} ${pageHint} Return JSON only: {"text":"answer","citations":[{"id":"document:chunk","title":"source title","excerpt":"verified excerpt","url":"optional url"}]}. Never invent citations.`,
          },
          { role: 'user', content: body.prompt.trim() },
        ],
      }),
    });

    if (!gatewayResponse.ok) {
      const detail = await gatewayResponse.text();
      throw new Error(`OpenClaw Gateway HTTP ${gatewayResponse.status}: ${detail.slice(0, 300)}`);
    }

    const payload = await gatewayResponse.json();
    const content = payload?.choices?.[0]?.message?.content;
    sendJson(response, 200, normalizeAgentReply(content), origin);
  } catch (error) {
    console.error(error);
    sendJson(response, 502, { error: 'openclaw_unavailable' }, origin);
  }
});

server.listen(port, '127.0.0.1', () => {
  console.error(`ScienceClaw reference Bot API listening on http://127.0.0.1:${port}`);
});
