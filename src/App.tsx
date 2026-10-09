import { BotWidget } from './bot/BotWidget';
import { botConfig } from './bot/config';
import { createMockAdapter } from './bot/adapters';

const adapter = createMockAdapter();

export function App() {
  return (
    <main className="demo-site">
      <nav><strong>YOUR / KNOWLEDGE</strong><span>Documents&nbsp;&nbsp; Topics&nbsp;&nbsp; About</span></nav>
      <article>
        <p>DEMO KNOWLEDGE ENTRY</p>
        <h1>Your knowledge,<br />inside your website.</h1>
        <span>Replace this host page with your own site. Edit the centralized Bot config, then connect the adapter to your server-side OpenClaw endpoint.</span>
      </article>
      <BotWidget
        config={botConfig}
        adapter={adapter}
        pageContext={{ title: 'Demo knowledge entry', url: '/demo-entry' }}
      />
    </main>
  );
}
