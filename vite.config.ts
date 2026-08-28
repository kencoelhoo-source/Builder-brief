import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

const fallbackReply = (message: string, language: string) => {
  const isHindi = language === 'hi';
  const isSocial = /instagram|facebook|whatsapp|profile|photo|video|harass|abuse|blackmail|threat|तस्वीर|बदनाम|धमकी/i.test(message);

  if (isHindi) {
    if (isSocial) {
      return [
        '🛡️ **सोशल मीडिया उत्पीड़न / फेक प्रोफाइल सहायता:**',
        '1. संदिग्ध प्रोफाइल लिंक (URL) व चैट का स्क्रीनशॉट बिना एडिट किए रखें।',
        '2. Kavach में suspect URL डालकर एक प्रोटोटाइप ड्राफ्ट देखें।',
        '3. वास्तविक शिकायत के लिए आधिकारिक साइबर सेल या cybercrime.gov.in का उपयोग करें।',
        '📞 राष्ट्रीय साइबर हेल्पलाइन: 1930',
      ].join('\n');
    }
    return [
      '⚡ **वित्तीय धोखाधड़ी सहायता:**',
      '1. Google Pay/PhonePe/Paytm से 12 अंकों का UTR नंबर निकालें।',
        '2. Kavach में UTR दर्ज करके डेमो फ्रीज ड्राफ्ट देखें; यह लाइव बैंक अलर्ट नहीं भेजता।',
      '3. तुरंत 1930 पर कॉल करके वित्तीय शिकायत दर्ज कराएं।',
        '4. वास्तविक कार्रवाई के बाद ही कानूनी सलाह लेकर कोई कोर्ट ड्राफ्ट इस्तेमाल करें।',
      '📞 राष्ट्रीय साइबर हेल्पलाइन: 1930',
    ].join('\n');
  }

  if (isSocial) {
    return [
      '🛡️ **Social Media Incident / Harassment Guidance:**',
      '1. Take screenshots of abusive posts/messages and copy the exact profile URL.',
      '2. Use Kavach to preview a Sec 79 takedown draft; this build does not contact the platform.',
      '3. For a real complaint, use the platform’s official channel and your local cyber cell.',
      '📞 National Helpline: 1930',
    ].join('\n');
  }

  return [
    '⚡ **Financial cyber fraud guidance:**',
    '1. Locate the 12-digit UTR/Ref number from your payment receipt.',
    '2. Enter the UTR in Kavach to preview a simulated dual-bank freeze notice.',
    '3. Dial 1930 immediately to register the official NCRP incident.',
    '4. Use any legal petition only after real bank confirmation and professional legal review.',
    '📞 National Helpline: 1930',
  ].join('\n');
};

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
        let rawBody = '';
        for await (const chunk of req) {
          rawBody += chunk.toString();
          if (rawBody.length > 32_000) {
            res.statusCode = 413;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Request too large' }));
            return;
          }
        }

        const body = JSON.parse(rawBody || '{}') as {
          language?: unknown;
          messages?: unknown;
        };

        const messages = (Array.isArray(body.messages) ? body.messages : [])
          .filter((message): message is { role: 'user' | 'assistant'; content: string } => {
            if (!message || typeof message !== 'object') return false;
            const candidate = message as { role?: unknown; content?: unknown };
            return (candidate.role === 'user' || candidate.role === 'assistant') && typeof candidate.content === 'string';
          })
          .slice(-8)
          .map((message) => ({ ...message, content: message.content.trim().slice(0, 1000) }));
        const latest = messages[messages.length - 1]?.content || '';
        const language = body.language === 'hi' ? 'hi' : 'en';
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ reply: fallbackReply(latest, language) }));
          return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'You are Kavach’s prototype cyber-safety assistant. Provide concise general safety guidance in English or Hindi. Never claim that a report, bank freeze, takedown, FIR, or court filing was submitted. Clearly say when the user must use official channels such as 1930 or cybercrime.gov.in, and recommend legal or police verification for legal questions.',
              },
              ...messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
            ],
            temperature: 0.3,
            max_tokens: 400,
          }),
          signal: controller.signal,
        }).finally(() => clearTimeout(timeout));

        if (response.ok) {
          const data = (await response.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply }));
            return;
          }
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ reply: fallbackReply(latest, language) }));
      } catch (err) {
        console.error('Chat assistant proxy error:', err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ reply: fallbackReply('', 'en') }));
      }
    });
  },
});

export default defineConfig({
  plugins: [chatAssistantApi(), tailwindcss(), react()],
})
