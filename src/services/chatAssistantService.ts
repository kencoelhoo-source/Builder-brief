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

const emergencyNumbers = [
  'National Cyber Crime Helpline: 1930',
  'Kavach Cyber Desk: +91-80-5550-1930',
  'Inter-Bank Freeze Coordination: +91-22-5550-4411',
  'Social Media & Takedown Node: +91-11-5550-7799',
  'Women & Child Safety Cyber Cell: +91-44-5550-1818',
];

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
        '3. **FIR ड्राफ्ट:** Kavach Omni के जरिए 154 CrPC / BNSS के तहत औपचारिक FIR ड्राफ्ट तैयार करें।',
        '',
        '📞 **हेल्पलाइन:** ' + emergencyNumbers.slice(0, 3).join(' | '),
      ].join('\n');
    }
    return [
      '⚡ **वित्तीय धोखाधड़ी (Golden Hour) सहायता:**',
      '1. **UTR / Ref No. नोट करें:** Google Pay/PhonePe/Paytm से 12 अंकों का UTR नंबर निकालें।',
      '2. **तत्काल फ्रीज नोटिस:** Kavach Omni में UTR दर्ज करें — दोनों बैंकों (भेजने वाले और प्राप्तकर्ता) को इंटर-बैंक फ्रीज अलर्ट जाएगा।',
      '3. **1930 हेल्पलाइन:** तुरंत 1930 पर कॉल करके शिकायत दर्ज कराएं।',
      '4. **रिफंड याचिका:** फ्रीज होने के बाद Sec 457 CrPC कोर्ट याचिका जनरेट करें।',
      '',
      '📞 **हेल्पलाइन:** ' + emergencyNumbers.slice(0, 3).join(' | '),
    ].join('\n');
  }

  if (isSocial) {
    return [
      '🛡️ **Social Media Incident / Harassment Guidance:**',
      '1. **Preserve Evidence:** Take full screenshots of posts/DMs and copy the exact suspect profile URL.',
      '2. **Sec 79 Takedown Notice:** Use Kavach Omni to dispatch a statutory 36-hour takedown directive to the platform Grievance Officer.',
      '3. **FIR Draft:** Generate a formal police FIR draft (Sec 154 CrPC / BNSS) directly from this portal.',
      '',
      '📞 **Emergency Helplines:** ' + emergencyNumbers.slice(0, 3).join(' | '),
    ].join('\n');
  }

  return [
    '⚡ **Financial Fraud (Golden Hour) Guidance:**',
    '1. **Identify UTR Number:** Locate the 12-digit UPI / IMPS transaction reference number.',
    '2. **Dispatch Dual Freeze:** Enter the UTR in Kavach Omni to simulate dual-bank lien directives (victim & beneficiary bank).',
    '3. **Dial 1930:** Report the incident to the National Cyber Financial Fraud hotline immediately.',
    '4. **Court Petition:** Generate the Sec 457 CrPC fund return petition once funds are frozen in the mule account.',
    '',
    '📞 **Emergency Helplines:** ' + emergencyNumbers.slice(0, 3).join(' | '),
  ].join('\n');
};

export const askChatAssistant = async (
  messages: ChatMessage[],
  currentLang: 'en' | 'hi'
): Promise<string> => {
  const latestMessage = messages[messages.length - 1]?.content || '';

  try {
    const response = await fetch('/api/chat-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: currentLang,
        messages: messages.map(({ role, content }) => ({ role, content })).slice(-8),
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as ChatAssistantResponse;
      if (data.reply && data.reply.trim()) {
        return data.reply.trim();
      }
    }
  } catch (error) {
    console.info('Using local Kavach guidance fallback:', error);
  }

  return buildLocalGuidance(latestMessage, currentLang === 'hi');
};
