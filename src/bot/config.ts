export interface BotConfig {
  assistantName: string;
  primaryColor: string;
  welcomeMessage: string;
  placeholder: string;
  knowledgeMode: 'none' | 'mcp';
  strictGrounding: boolean;
  showCitations: boolean;
  suggestedQuestions: string[];
}

// Website-facing configuration stays in one place. Model credentials do not belong here.
export const botConfig: BotConfig = {
  assistantName: 'Team Knowledge Bot',
  primaryColor: '#3157D7',
  welcomeMessage: '你好，我会依据你们的知识来源回答；证据不足时会明确说明。',
  placeholder: '向团队知识库提问…',
  knowledgeMode: 'mcp',
  strictGrounding: true,
  showCitations: true,
  suggestedQuestions: ['总结当前页面', '哪些来源支持这个结论？', '问一个知识库没有的问题'],
};
