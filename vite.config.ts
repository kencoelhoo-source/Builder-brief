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
        '2. Kavach Omni में suspect URL डालें और Sec 79 Takedown Notice तैयार करें।',
        '3. 154 CrPC / BNSS के तहत औपचारिक पुलिस FIR ड्राफ्ट डाउनलोड करें।',
        '📞 राष्ट्रीय साइबर हेल्पलाइन: 1930',
      ].join('\n');
    }
    return [
      '⚡ **वित्तीय धोखाधड़ी (Golden Hour) सहायता:**',
      '1. Google Pay/PhonePe/Paytm से 12 अंकों का UTR नंबर निकालें।',
      '2. Kavach Omni में UTR दर्ज करें — दोनों बैंकों को इंटर-बैंक फ्रीज अलर्ट जाएगा।',
      '3. तुरंत 1930 पर कॉल करके वित्तीय शिकायत दर्ज कराएं।',
      '4. फंड फ्रीज होने के बाद Sec 457 CrPC कोर्ट याचिका जनरेट करें।',
      '📞 राष्ट्रीय साइबर हेल्पलाइन: 1930',
    ].join('\n');
  }

  if (isSocial) {
    return [
      '🛡️ **Social Media Incident / Harassment Guidance:**',
      '1. Take screenshots of abusive posts/messages and copy the exact profile URL.',
      '2. Use Kavach Omni to dispatch a 36-hour Sec 79 Takedown Notice to the platform.',
      '3. Generate a formal police FIR draft (Sec 154 CrPC / BNSS) from this portal.',
      '📞 National Helpline: 1930',
    ].join('\n');
  }

  return [
    '⚡ **Financial Cyber Fraud (Golden Hour) Guidance:**',
    '1. Locate the 12-digit UTR/Ref number from your payment receipt.',
    '2. Enter the UTR in Kavach Omni to trigger statutory dual-bank freeze notices.',
    '3. Dial 1930 immediately to register the official NCRP incident.',
    '4. Generate the Sec 457 CrPC court refund petition once funds are secured.',
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
          rawBody += chunk;
        }

        const body = JSON.parse(rawBody || '{}') as {
          language?: string;
          messages?: { role: 'user' | 'assistant'; content: string }[];
        };

        const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
        const latest = messages[messages.length - 1]?.content || '';
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ reply: fallbackReply(latest, body.language || 'en') }));
          return;
        }

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
                  'You are Kavach Omni AI Cyber Crime Assistant. Provide concise, actionable, and legally sound advice for Indian citizens facing cybercrimes (UPI fraud, extortion, fake profile harassment). Reference National Cyber Helpline 1930, Bank Freezes (CFCFRMS), IT Act Sec 79 takedowns, and CrPC Sec 457 refund petitions. Reply in the user language (English or Hindi).',
              },
              ...messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
            ],
            temperature: 0.3,
            max_tokens: 400,
          }),
        });

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
        res.end(JSON.stringify({ reply: fallbackReply(latest, body.language || 'en') }));
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
