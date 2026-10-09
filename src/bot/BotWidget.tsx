import { useMemo, useRef, useState } from 'react';
import type { BotConfig } from './config';
import type { BotReply, ChatAdapter, PageContext } from './types';

export function BotWidget({ config, adapter, pageContext }: { config: BotConfig; adapter: ChatAdapter; pageContext?: PageContext }) {
  const [draft, setDraft] = useState('');
  const [turns, setTurns] = useState<{ prompt: string; reply: BotReply }[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const controller = useRef<AbortController | null>(null);
  const style = useMemo(() => ({ '--bot-color': config.primaryColor }) as React.CSSProperties, [config.primaryColor]);

  async function send(forced?: string) {
    const prompt = (forced ?? draft).trim();
    if (!prompt || loading) return;
    setDraft('');
    setLoading(true);
    controller.current = new AbortController();
    try {
      const reply = await adapter.send({ conversationId, prompt, pageContext, knowledgeMode: config.knowledgeMode, strictGrounding: config.strictGrounding }, controller.current.signal);
      setTurns((current) => [...current, { prompt, reply }]);
    } finally {
      setLoading(false);
      controller.current = null;
    }
  }

  return (
    <section className="web-bot" style={style} aria-label={config.assistantName}>
      <header><i>SC</i><span><strong>{config.assistantName}</strong><small>YOUR OPENCLAW · YOUR MCP</small></span></header>
      <div className="bot-body">
        {!turns.length ? <><p className="welcome">{config.welcomeMessage}</p><div className="suggestions">{config.suggestedQuestions.map((question) => <button key={question} onClick={() => void send(question)}>{question}</button>)}</div></> : null}
        {turns.map((turn, index) => <div className="turn" key={`${turn.prompt}-${index}`}><p className="user-message">{turn.prompt}</p><div className="bot-message">{turn.reply.text}{config.showCitations ? turn.reply.citations.map((citation) => <aside key={citation.id}><strong>{citation.title}</strong><small>{citation.excerpt}</small></aside>) : null}</div></div>)}
        {loading ? <p className="bot-message">正在等待你们的 Agent…</p> : null}
      </div>
      <form onSubmit={(event) => { event.preventDefault(); void send(); }}><input aria-label="聊天输入" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={config.placeholder} /><button aria-label="发送" type="submit">↑</button></form>
    </section>
  );
}
