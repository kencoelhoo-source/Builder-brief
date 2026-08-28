export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatAssistantResponse {
  reply?: string;
  error?: string;
}

const officialHelp = 'National Cyber Crime Helpline: 1930 · cybercrime.gov.in';
const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES = 8;

const buildLocalGuidance = (message: string, isHindi: boolean): string => {
  const normalized = message.toLowerCase();
  const isSocial =
    normalized.includes('instagram') ||
    normalized.includes('facebook') ||
    normalized.includes('whatsapp') ||
    normalized.includes('profile') ||
    normalized.includes('photo') ||
    normalized.includes('video') ||
    normalized.includes('harass') ||
    normalized.includes('blackmail') ||
    normalized.includes('threat') ||
    normalized.includes('तस्वीर') ||
    normalized.includes('बदनाम') ||
    normalized.includes('धमकी');

  if (isHindi) {
    if (isSocial) {
      return [
        '🛡️ **सोशल मीडिया उत्पीड़न / फेक प्रोफाइल सहायता:**',
        '1. **साक्ष्य सुरक्षित रखें:** संदिग्ध प्रोफाइल लिंक (URL), चैट स्क्रीनशॉट और संदेशों का बिना एडिट किए रिकॉर्ड रखें।',
        '2. **प्लेटफॉर्म रिपोर्ट:** संबंधित ऐप पर रिपोर्ट दर्ज करें और इस पोर्टल में URL डालकर Sec 79 Takedown Notice तैयार करें।',
        '3. **FIR ड्राफ्ट:** Kavach के जरिए 154 CrPC / BNSS के तहत प्रोटोटाइप ड्राफ्ट देखें; इसे पुलिस के पास सत्यापित करके दर्ज कराएं।',
        '',
          '📞 हेल्पलाइन: ' + officialHelp,
      ].join('\n');
    }
    return [
      '⚡ **वित्तीय धोखाधड़ी सहायता:**',
      '1. **UTR / Ref No. नोट करें:** Google Pay/PhonePe/Paytm से 12 अंकों का UTR नंबर निकालें।',
      '2. **तत्काल कदम:** Kavach में UTR दर्ज करके डेमो नोटिस देखें; बैंक को खुद कॉल करके भुगतान रोकने का अनुरोध करें।',
      '3. **1930 हेल्पलाइन:** तुरंत 1930 पर कॉल करके शिकायत दर्ज कराएं।',
      '4. **रिफंड याचिका:** फ्रीज होने के बाद Sec 457 CrPC कोर्ट याचिका जनरेट करें।',
      '',
      '📞 हेल्पलाइन: ' + officialHelp,
    ].join('\n');
  }

  if (isSocial) {
    return [
      '🛡️ **Social Media Incident / Harassment Guidance:**',
      '1. **Preserve Evidence:** Take full screenshots of posts/DMs and copy the exact suspect profile URL.',
      '2. **Sec 79 Takedown Notice:** Use Kavach to preview a 36-hour takedown notice; submit it through the platform’s verified grievance channel.',
      '3. **FIR Draft:** Generate a formal police FIR draft (Sec 154 CrPC / BNSS) directly from this portal.',
      '',
      '📞 Official help: ' + officialHelp,
    ].join('\n');
  }

  return [
    '⚡ **Financial fraud guidance:**',
    '1. **Identify UTR Number:** Locate the 12-digit UPI / IMPS transaction reference number.',
      '2. **Preview Dual Freeze:** Enter the UTR in Kavach to simulate dual-bank lien directives (victim & beneficiary bank).',
    '3. **Dial 1930:** Report the incident to the National Cyber Financial Fraud hotline immediately.',
    '4. **Court Petition:** Generate the Sec 457 CrPC fund return petition once funds are frozen in the mule account.',
    '',
    '📞 Official help: ' + officialHelp,
  ].join('\n');
};

export const askChatAssistant = async (
  messages: ChatMessage[],
  currentLang: 'en' | 'hi'
): Promise<string> => {
  const safeMessages = messages
    .filter((message) => (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string')
    .slice(-MAX_MESSAGES)
    .map(({ role, content }) => ({ role, content: content.trim().slice(0, MAX_MESSAGE_LENGTH) }));
  const latestMessage = safeMessages[safeMessages.length - 1]?.content || '';
  if (!latestMessage) return buildLocalGuidance('', currentLang === 'hi');

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('/api/chat-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: currentLang,
        messages: safeMessages,
      }),
      signal: controller.signal,
    });

    if (response.ok) {
      const data = (await response.json()) as ChatAssistantResponse;
      if (data.reply && data.reply.trim()) {
        return data.reply.trim();
      }
    }
  } catch (error) {
    console.info('Using local Kavach guidance fallback:', error);
  } finally {
    window.clearTimeout(timeout);
  }

  return buildLocalGuidance(latestMessage, currentLang === 'hi');
};
