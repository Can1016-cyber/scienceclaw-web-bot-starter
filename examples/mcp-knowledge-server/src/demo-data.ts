export interface DemoChunk {
  id: string;
  text: string;
}

export interface DemoDocument {
  id: string;
  title: string;
  url: string;
  updatedAt: string;
  accessScope: string[];
  chunks: DemoChunk[];
}

// Fabricated records for local integration tests only.
// Replace this array with an authenticated repository adapter.
export const demoDocuments: DemoDocument[] = [
  {
    id: 'demo-aerogel-024',
    title: 'Silica aerogel thermal-control record (demo)',
    url: 'https://demo.invalid/materials/aerogel-024',
    updatedAt: '2026-10-01',
    accessScope: ['demo:public'],
    chunks: [
      {
        id: 'porous-network',
        text: 'The fabricated demo record associates low thermal conductivity with a nanoscale porous network that reduces gaseous conduction and interrupts continuous solid pathways.',
      },
      {
        id: 'boundary-note',
        text: 'The demo record warns that porosity, moisture, pressure, and processing conditions can change measured performance.',
      },
    ],
  },
  {
    id: 'demo-citation-policy',
    title: 'Knowledge citation policy (demo)',
    url: 'https://demo.invalid/policies/citations',
    updatedAt: '2026-10-01',
    accessScope: ['demo:public'],
    chunks: [
      {
        id: 'strict-grounding',
        text: 'In strict mode, an answer is knowledge-backed only when it includes a source returned by an approved retrieval tool. Otherwise the assistant must report insufficient evidence.',
      },
    ],
  },
];
