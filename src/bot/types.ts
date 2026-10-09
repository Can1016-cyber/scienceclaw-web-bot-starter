export interface Citation {
  id: string;
  title: string;
  excerpt: string;
  url?: string;
}

export interface PageContext {
  title: string;
  url: string;
}

export interface BotReply {
  text: string;
  citations: Citation[];
}

export interface ChatRequest {
  conversationId?: string;
  prompt: string;
  pageContext?: PageContext;
  knowledgeMode: 'none' | 'mcp';
  strictGrounding: boolean;
}

export interface ChatAdapter {
  send(request: ChatRequest, signal?: AbortSignal): Promise<BotReply>;
}
