import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
<<<<<<< HEAD
import { defineConfig, type Plugin } from 'vite'

const demoNumbers = [
  'National cyber emergency: 1930',
  'Kavach complaint desk: +91-80-5550-1930',
  'Bank freeze coordination: +91-22-5550-4411',
  'Social media takedown support: +91-11-5550-7799',
  'Women and child safety cyber cell: +91-44-5550-1818',
];

const fallbackReply = (message: string, language: string) => {
  const hi = language === 'hi';
  const social = /instagram|facebook|whatsapp|profile|photo|harass|abuse|blackmail/i.test(message);

  if (hi) {
    return [
      social ? 'यह social-media complaint जैसी लगती है।' : 'यह financial cyber-fraud complaint जैसी लगती है।',
      'कदम 1: तारीख, समय, रकम/URL, suspect details और सारे screenshots सुरक्षित रखें।',
      social ? 'कदम 2: platform report करें और Kavach में takedown/FIR draft बनाएं।' : 'कदम 2: UTR दर्ज करें, bank freeze request भेजें और acknowledgement number सेव करें।',
      'कदम 3: 24 घंटे के अंदर status follow-up करें।',
      `संपर्क: ${demoNumbers.join(' | ')}`,
    ].join('\n');
  }

  return [
    social ? 'This looks like a social-media complaint.' : 'This looks like a financial cyber-fraud complaint.',
    'Step 1: Save the date, time, amount/URL, suspect details, and all screenshots.',
    social ? 'Step 2: Report it on the platform and use Kavach to prepare a takedown/FIR draft.' : 'Step 2: Enter the UTR, send a bank-freeze request, and save the acknowledgement number.',
    'Step 3: Follow up within 24 hours.',
    `Contacts: ${demoNumbers.join(' | ')}`,
  ].join('\n');
};

const readRequestBody = async (req: import('http').IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

const chatAssistantApi = (): Plugin => ({
  name: 'chat-assistant-api',
  configureServer(server) {
    server.middlewares.use('/api/chat-assistant', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      try {
        const rawBody = await readRequestBody(req);
        const body = JSON.parse(rawBody || '{}') as {
          language?: string;
          messages?: { role: 'user' | 'assistant'; content: string }[];
        };
        const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
        const latest = messages[messages.length - 1]?.content || '';
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ reply: fallbackReply(latest, body.language || 'en') }));
          return;
        }

        const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            input: [
              {
                role: 'system',
                content:
                  'You are Kavach Omni complaint assistant. Give practical, step-by-step cyber complaint filing guidance. Classify financial fraud versus social-media abuse. Always include the most relevant demo phone numbers from this list: National cyber emergency 1930, Kavach complaint desk +91-80-5550-1930, Bank freeze coordination +91-22-5550-4411, Social media takedown support +91-11-5550-7799, Women and child safety cyber cell +91-44-5550-1818. Keep replies concise, calm, and action-oriented. Do not claim demo numbers are official except 1930.',
              },
              ...messages.map((message) => ({
                role: message.role,
                content: message.content,
              })),
            ],
            temperature: 0.3,
            max_output_tokens: 420,
          }),
        });

        if (!openAiResponse.ok) {
          throw new Error(`OpenAI API returned ${openAiResponse.status}`);
        }

        const data = (await openAiResponse.json()) as {
          output_text?: string;
          output?: { content?: { text?: string }[] }[];
        };
        const nestedText = data.output
          ?.flatMap((item) => item.content || [])
          .map((item) => item.text)
          .filter(Boolean)
          .join('\n');
        const reply = data.output_text || nestedText || fallbackReply(latest, body.language || 'en');

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ reply }));
      } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ reply: fallbackReply('', 'en') }));
      }
    });
  },
});

export default defineConfig({
  plugins: [chatAssistantApi(), tailwindcss(), react()],
=======
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
>>>>>>> c35d628e34ce95338da8a5b5bc364803b8db1392
})
