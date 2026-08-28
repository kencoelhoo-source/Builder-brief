import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const distDir = join(process.cwd(), 'dist');

const demoNumbers = [
  'National cyber emergency: 1930',
  'Kavach complaint desk: +91-80-5550-1930',
  'Bank freeze coordination: +91-22-5550-4411',
  'Social media takedown support: +91-11-5550-7799',
  'Women and child safety cyber cell: +91-44-5550-1818',
];

const fallbackReply = (message = '', language = 'en') => {
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

const readBody = (req) =>
  new Promise((resolve, reject) => {
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

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const handleChat = async (req, res) => {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = JSON.parse((await readBody(req)) || '{}');
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const latest = messages[messages.length - 1]?.content || '';
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      sendJson(res, 200, { reply: fallbackReply(latest, body.language || 'en') });
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
          ...messages.map((message) => ({ role: message.role, content: message.content })),
        ],
        temperature: 0.3,
        max_output_tokens: 420,
      }),
    });

    if (!openAiResponse.ok) {
      throw new Error(`OpenAI API returned ${openAiResponse.status}`);
    }

    const data = await openAiResponse.json();
    const nestedText = data.output
      ?.flatMap((item) => item.content || [])
      .map((item) => item.text)
      .filter(Boolean)
      .join('\n');

    sendJson(res, 200, { reply: data.output_text || nestedText || fallbackReply(latest, body.language || 'en') });
  } catch (error) {
    console.error(error);
    sendJson(res, 200, { reply: fallbackReply('', 'en') });
  }
};

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const serveStatic = async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(distDir, safePath);

  try {
    const file = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream' });
    res.end(file);
  } catch {
    const index = await readFile(join(distDir, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
  }
};

createServer((req, res) => {
  if (req.url?.startsWith('/api/chat-assistant')) {
    void handleChat(req, res);
    return;
  }
  void serveStatic(req, res);
}).listen(port, () => {
  console.log(`Kavach Omni server running on http://localhost:${port}`);
});
