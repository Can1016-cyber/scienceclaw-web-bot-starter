import type { BotReply, ChatAdapter } from './types';

export function createMockAdapter(): ChatAdapter {
  return {
    async send(request, signal) {
      await new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(resolve, 450);
        signal?.addEventListener('abort', () => {
          window.clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        }, { once: true });
      });

      if (/没有|火星|未知/.test(request.prompt) && request.strictGrounding) {
        return { text: '当前知识库中没有找到足够依据。', citations: [] };
      }

      return {
        text: '这是 Starter Kit 的本地模拟回答。接入后，这里应由你们自己的 OpenClaw 调用 MCP 工具，并返回结构化来源。',
        citations: request.knowledgeMode === 'mcp' ? [{ id: 'demo-1', title: '演示来源', excerpt: '替换为你们 MCP Server 返回的真实来源信息。' }] : [],
      };
    },
  };
}

export function createOpenClawAdapter(endpoint = '/api/scienceclaw/chat'): ChatAdapter {
  return {
    async send(request, signal): Promise<BotReply> {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request),
        signal,
      });
      if (!response.ok) throw new Error(`Bot API failed: ${response.status}`);
      return response.json() as Promise<BotReply>;
    },
  };
}
