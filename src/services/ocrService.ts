import Tesseract from 'tesseract.js';
import type { CyberIncident, SocialIncident, FraudCategory } from '../types';
import { MOCK_PERSONAS } from '../data/mockPersonas';

const BANK_HINTS: { match: RegExp; name: string }[] = [
  { match: /\bhdfc\b/i, name: 'HDFC Bank Ltd.' },
  { match: /\bicici\b/i, name: 'ICICI Bank Ltd.' },
  { match: /\baxis\b/i, name: 'Axis Bank Ltd.' },
  { match: /\bsbi\b|state bank/i, name: 'State Bank of India' },
  { match: /\bpaytm\b/i, name: 'Paytm Payments Bank' },
  { match: /\byes\s*bank\b/i, name: 'Yes Bank Ltd.' },
  { match: /\bkotak\b/i, name: 'Kotak Mahindra Bank' },
  { match: /\bindusind\b/i, name: 'IndusInd Bank' },
  { match: /\bpnb\b|punjab national/i, name: 'Punjab National Bank' },
  { match: /\bboi\b|bank of india\b/i, name: 'Bank of India' },
  { match: /\bcanara\b/i, name: 'Canara Bank' },
  { match: /\bunion bank\b/i, name: 'Union Bank of India' },
  { match: /\bidfc\b/i, name: 'IDFC FIRST Bank' },
  { match: /\bphonepe\b/i, name: 'PhonePe / Yes Bank' },
  { match: /\bgoogle pay\b|\bgpay\b/i, name: 'Google Pay' },
];

const VPA_RE = /\b[a-zA-Z0-9._-]{3,}@(?:oksbi|okhdfcbank|okaxis|okicici|ybl|ibl|axl|paytm|upi|apl|okbizaxis|waaxis|okkotak)\b/i;
const GENERIC_VPA_RE = /\b[a-zA-Z0-9._-]{3,}@[a-zA-Z]{2,18}\b/;
const UTR_LABELED_RE = /(?:utr|rrn|ref(?:erence)?(?:\s*(?:no|id|number))?|txn(?:\s*id)?|transaction(?:\s*id)?)\s*[:#.\-]*\s*([0-9]{12})/i;
const UTR_ANY_RE = /\b([0-9]{12})\b/;
const AMOUNT_RE = /(?:₹|rs\.?|inr)\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]+)(?:\.[0-9]{1,2})?/i;
const AMOUNT_BARE_RE = /\b([0-9]{1,3}(?:,[0-9]{3})+)(?:\.[0-9]{1,2})?\b/;
const URL_RE = /https?:\/\/[^\s]+|(?:www\.)?(?:instagram|facebook|fb|x|twitter|youtube|snapchat|whatsapp)\.com\/[^\s]+/i;
const ACCOUNT_RE = /\b(?:xx+[\s-]*\d{2,6}|\d{4}[\s-]*\d{4}[\s-]*\d{2,4})\b/i;

const SOCIAL_WORDS = [
  'instagram', 'facebook', 'fake profile', 'impersonat', 'harass',
  'blackmail', 'whatsapp', 'twitter', 'snapchat', 'reel', 'story',
  'फर्जी', 'इंस्टाग्राम', 'फेसबुक',
];

const guessBank = (text: string, fallback: string) => {
  const hit = BANK_HINTS.find((b) => b.match.test(text));
  return hit?.name || fallback;
};

const parseAmount = (text: string): number => {
  const labeled = text.match(AMOUNT_RE);
  const bare = text.match(AMOUNT_BARE_RE);
  const raw = (labeled?.[1] || bare?.[1] || '').replace(/,/g, '');
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const nowStamp = () =>
  new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

const personaToIncident = (id: string): CyberIncident | null => {
  const persona = MOCK_PERSONAS.find((p) => p.id === id);
  if (!persona) return null;
  if (persona.incidentType === 'SOCIAL') {
    return {
      incidentType: 'SOCIAL',
      platform: persona.platform || 'Unknown',
      suspectUrl: persona.suspectUrl || '',
      contentType: 'FAKE_PROFILE',
      fraudCategory: persona.category,
      fraudCategoryLabel: persona.categoryLabel,
      incidentSummary: persona.description,
      victimName: 'Citizen (Demo User)',
      victimMobile: '+91-98765-43210',
      confidenceScore: 92.5,
      extractedVia: 'VISION_OCR',
      timestamp: persona.timestamp,
    };
  }
  return {
    incidentType: 'FINANCIAL',
    utr: persona.utr || '',
    amount: persona.amount || 0,
    timestamp: persona.timestamp,
    remitterBank: persona.remitterBank || '',
    remitterAccount: persona.remitterAccountMasked || '',
    beneficiaryVpa: persona.fraudsterVpa || '',
    beneficiaryBank: persona.fraudsterBank || '',
    fraudCategory: persona.category,
    fraudCategoryLabel: persona.categoryLabel,
    incidentSummary: persona.description,
    victimName: 'Citizen (Demo User)',
    victimMobile: '+91-98765-43210',
    confidenceScore: 98.4,
    extractedVia: 'VISION_OCR',
  };
};

const readImageText = async (file: File): Promise<{ text: string; confidence: number }> => {
  const { data } = await Tesseract.recognize(file, 'eng', {
    logger: () => undefined,
  });
  return {
    text: (data.text || '').replace(/\u0000/g, '').trim(),
    confidence: typeof data.confidence === 'number' ? data.confidence : 0,
  };
};

const classifyAndBuild = (text: string, confidence: number): CyberIncident => {
  const lower = text.toLowerCase();
  const urlMatch = text.match(URL_RE);
  const vpaMatch = text.match(VPA_RE) || text.match(GENERIC_VPA_RE);
  const utr = (text.match(UTR_LABELED_RE)?.[1] || text.match(UTR_ANY_RE)?.[1] || '').trim();
  const amount = parseAmount(text);
  const hasMoneySignal = Boolean(vpaMatch || utr || amount > 0 || /upi|gpay|google pay|phonepe|paytm|neft|imps/i.test(lower));
  const hasSocialSignal =
    Boolean(urlMatch) || SOCIAL_WORDS.some((w) => lower.includes(w));

  if (hasSocialSignal && !hasMoneySignal) {
    let platform = 'Unknown';
    if (/instagram/i.test(lower)) platform = 'Instagram';
    else if (/facebook|\bfb\b/i.test(lower)) platform = 'Facebook';
    else if (/\bx\.com\b|twitter/i.test(lower)) platform = 'X';
    else if (/whatsapp/i.test(lower)) platform = 'WhatsApp';
    else if (/youtube/i.test(lower)) platform = 'YouTube';
    else if (/snapchat/i.test(lower)) platform = 'Snapchat';

    let contentType: SocialIncident['contentType'] = 'FAKE_PROFILE';
    if (/harass|threat|abuse|bully/i.test(lower)) contentType = 'HARASSING_POST';
    else if (/nude|private image|sextort/i.test(lower)) contentType = 'PRIVATE_IMAGES';
    else if (/hack|compromis/i.test(lower)) contentType = 'HACKED_ACCOUNT';

    const category: FraudCategory =
      contentType === 'HARASSING_POST' ? 'CYBERBULLYING_HARASSMENT' : 'SOCIAL_MEDIA_IMPERSONATION';

    return {
      incidentType: 'SOCIAL',
      platform,
      suspectUrl: urlMatch?.[0] || '',
      contentType,
      timestamp: nowStamp(),
      fraudCategory: category,
      fraudCategoryLabel:
        contentType === 'HARASSING_POST' ? 'Harassment / threatening content' : 'Social media impersonation',
      incidentSummary: text.slice(0, 600) || 'Social media screenshot — please confirm the profile URL.',
      victimName: 'Citizen (Demo User)',
      victimMobile: '+91-98765-43210',
      confidenceScore: Math.round(confidence * 10) / 10,
      extractedVia: 'VISION_OCR',
    };
  }

  const banks = BANK_HINTS.filter((b) => b.match.test(text)).map((b) => b.name);
  const remitterBank = banks[0] || guessBank(lower, 'Unknown bank — please edit');
  const beneficiaryBank = banks[1] || (vpaMatch
    ? guessBank(vpaMatch[0], remitterBank)
    : 'Unknown bank — please edit');

  let category: FraudCategory = 'OTHER';
  let categoryLabel = 'Screenshot report';
  if (/arrest|cbi|ed |police/i.test(lower)) {
    category = 'DIGITAL_ARREST_EXTORTION';
    categoryLabel = 'Digital arrest / impersonation';
  } else if (/refund|customer care|support/i.test(lower)) {
    category = 'UPI_PHISHING';
    categoryLabel = 'UPI phishing / fake support';
  } else if (/qr/i.test(lower)) {
    category = 'QR_CODE_REFUND_FRAUD';
    categoryLabel = 'QR code fraud';
  } else if (hasMoneySignal) {
    category = 'UPI_PHISHING';
    categoryLabel = 'UPI / payment fraud';
  }

  return {
    incidentType: 'FINANCIAL',
    utr,
    amount,
    timestamp: nowStamp(),
    remitterBank,
    remitterAccount: text.match(ACCOUNT_RE)?.[0]?.replace(/\s+/g, '-') || 'XXXX',
    beneficiaryVpa: vpaMatch?.[0] || '',
    beneficiaryBank,
    fraudCategory: category,
    fraudCategoryLabel: categoryLabel,
    incidentSummary:
      text.slice(0, 600) ||
      'Could not read much from this screenshot. Please fill in the details.',
    victimName: 'Citizen (Demo User)',
    victimMobile: '+91-98765-43210',
    confidenceScore: Math.round(confidence * 10) / 10,
    extractedVia: 'VISION_OCR',
  };
};

export const parseScreenshotOCR = async (
  fileOrPresetId: string | File
): Promise<CyberIncident> => {
  if (typeof fileOrPresetId === 'string') {
    const fromPersona = personaToIncident(fileOrPresetId);
    if (fromPersona) return fromPersona;
  }

  if (fileOrPresetId instanceof File) {
    const { text, confidence } = await readImageText(fileOrPresetId);
    return classifyAndBuild(text, confidence || 40);
  }

  return classifyAndBuild('', 0);
};

export const parseVoiceTranscription = async (
  rawTranscript: string
): Promise<CyberIncident> => {
  const text = rawTranscript.trim();
  const lower = text.toLowerCase();
  const social = SOCIAL_WORDS.some((kw) => lower.includes(kw));

  if (social) {
    let platform = 'Unknown Platform';
    if (lower.includes('instagram') || lower.includes('इंस्टाग्राम')) platform = 'Instagram';
    else if (lower.includes('facebook') || lower.includes('फेसबुक')) platform = 'Facebook';
    else if (lower.includes('twitter') || lower.includes(' x ')) platform = 'X';
    else if (lower.includes('whatsapp')) platform = 'WhatsApp';

    return {
      incidentType: 'SOCIAL',
      platform,
      suspectUrl: '',
      contentType: 'FAKE_PROFILE',
      timestamp: nowStamp(),
      fraudCategory: 'SOCIAL_MEDIA_IMPERSONATION',
      fraudCategoryLabel: 'Social media impersonation',
      incidentSummary: text,
      victimName: 'Spoken Voice Reporter',
      victimMobile: '+91-98765-43210',
      confidenceScore: 80,
      extractedVia: 'VOICE_TRANSCRIBE',
    };
  }

  const amount = parseAmount(text) || (() => {
    const m = text.match(/\b(\d{3,7})\b/);
    return m ? parseInt(m[1], 10) : 0;
  })();
  const vpa = text.match(VPA_RE)?.[0] || text.match(GENERIC_VPA_RE)?.[0] || '';
  const utr = text.match(UTR_LABELED_RE)?.[1] || text.match(UTR_ANY_RE)?.[1] || '';

  return {
    incidentType: 'FINANCIAL',
    utr,
    amount,
    timestamp: nowStamp(),
    remitterBank: guessBank(lower, 'Unknown bank — please edit'),
    remitterAccount: 'XXXX',
    beneficiaryVpa: vpa,
    beneficiaryBank: guessBank(vpa || lower, 'Unknown bank — please edit'),
    fraudCategory: 'UPI_PHISHING',
    fraudCategoryLabel: 'Spoken emergency report',
    incidentSummary: text,
    victimName: 'Spoken Voice Reporter',
    victimMobile: '+91-98765-43210',
    confidenceScore: 80,
    extractedVia: 'VOICE_TRANSCRIBE',
  };
};
