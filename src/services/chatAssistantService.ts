export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatAssistantResponse {
  reply?: string;
}

const supportNumbers = [
  'National cyber emergency: 1930',
  'Kavach complaint desk: +91-80-5550-1930',
  'Bank freeze coordination: +91-22-5550-4411',
  'Social media takedown support: +91-11-5550-7799',
  'Women and child safety cyber cell: +91-44-5550-1818',
];

const buildLocalGuidance = (message: string, hi: boolean): string => {
  const normalized = message.toLowerCase();
  const isSocial =
    normalized.includes('instagram') ||
    normalized.includes('facebook') ||
    normalized.includes('whatsapp') ||
    normalized.includes('profile') ||
    normalized.includes('photo') ||
    normalized.includes('harass');

  if (hi) {
    return [
      isSocial
        ? 'आपकी शिकायत सोशल मीडिया/ऑनलाइन उत्पीड़न जैसी लग रही है।'
        : 'आपकी शिकायत वित्तीय साइबर धोखाधड़ी जैसी लग रही है।',
      'कदम 1: समय, प्लेटफॉर्म/बैंक, राशि, UTR या suspect URL नोट करें।',
      'कदम 2: स्क्रीनशॉट, कॉल लॉग, SMS, चैट और भुगतान रसीद सुरक्षित रखें।',
      isSocial
        ? 'कदम 3: ऐप में suspect URL अपलोड करें और takedown notice तैयार करें।'
        : 'कदम 3: ऐप में UTR या स्क्रीनशॉट जोड़ें और bank freeze action शुरू करें।',
      'कदम 4: acknowledgement number सेव करें और 24 घंटे में follow-up करें।',
      `संपर्क: ${supportNumbers.join(' | ')}`,
      'यह demo guidance है। असली emergency में आधिकारिक 1930/स्थानीय पुलिस से संपर्क करें।',
    ].join('\n');
  }

  return [
    isSocial
      ? 'This sounds like a social-media or online harassment complaint.'
      : 'This sounds like a financial cyber-fraud complaint.',
    'Step 1: Write down the time, platform/bank, amount, UTR, suspect URL, and caller/profile details.',
    'Step 2: Preserve screenshots, call logs, SMS, chats, receipts, and profile links without editing them.',
    isSocial
      ? 'Step 3: Upload the suspect URL or screenshot in this app and prepare a takedown/FIR draft.'
      : 'Step 3: Add the UTR or screenshot in this app and start the bank-freeze action quickly.',
    'Step 4: Save the acknowledgement number, then follow up within 24 hours.',
    `Helpful numbers: ${supportNumbers.join(' | ')}`,
    'These are demo numbers except 1930. For real emergencies, use official helplines and local police.',
  ].join('\n');
};

export const askChatAssistant = async (
  messages: ChatMessage[],
  currentLang: 'en' | 'hi'
): Promise<string> => {
  const latest = messages[messages.length - 1]?.content || '';

  try {
    const response = await fetch('/api/chat-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: currentLang,
        messages: messages.map(({ role, content }) => ({ role, content })).slice(-10),
      }),
    });

    if (!response.ok) {
      throw new Error(`Assistant request failed with ${response.status}`);
    }

    const data = (await response.json()) as ChatAssistantResponse;
    if (data.reply?.trim()) return data.reply.trim();
  } catch (error) {
    console.warn('Chat assistant fallback used:', error);
  }

  return buildLocalGuidance(latest, currentLang === 'hi');
};
