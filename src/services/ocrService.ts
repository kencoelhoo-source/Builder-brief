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
const UTR_LABELED_RE = /(?:utr|rrn|ref(?:erence)?(?:\s*(?:no|id|number))?|txn(?:\s*id)?|transaction(?:\s*id)?)\s*[:#.-]*\s*([0-9]{12})/i;
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
      victimName: persona.profile.fullName,
      victimMobile: persona.profile.mobile,
      confidenceScore: 92.5,
      extractedVia: 'VISION_OCR',
      timestamp: persona.timestamp,
      personProfile: persona.profile,
      casePerspective: persona.casePerspective,
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
    victimName: persona.profile.fullName,
    victimMobile: persona.profile.mobile,
    confidenceScore: 98.4,
    extractedVia: 'VISION_OCR',
    personProfile: persona.profile,
    casePerspective: persona.casePerspective,
  };
};

const ocrCache = new Map<string, { text: string; confidence: number }>();
const MAX_OCR_EDGE = 1600;
const OCR_TIMEOUT_MS = 28000;

export class OcrReadError extends Error {
  code: 'HEIC_UNSUPPORTED' | 'DECODE_FAILED' | 'OCR_TIMEOUT' | 'OCR_FAILED';
  constructor(code: OcrReadError['code'], message: string) {
    super(message);
    this.name = 'OcrReadError';
    this.code = code;
  }
}

const isHeicLike = (file: File) => {
  const type = (file.type || '').toLowerCase();
  const name = file.name.toLowerCase();
  return type.includes('heic') || type.includes('heif') || name.endsWith('.heic') || name.endsWith('.heif');
};

const withTimeout = <T,>(promise: Promise<T>, ms: number, code: OcrReadError['code']): Promise<T> =>
  new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new OcrReadError(code, 'OCR timed out')), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      }
    );
  });

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('decode'));
    img.src = src;
  });

const rasterizeForOcr = async (file: File): Promise<Blob> => {
  const objectUrl = URL.createObjectURL(file);
  try {
    let img: HTMLImageElement;
    try {
      img = await loadImageElement(objectUrl);
    } catch {
      throw new OcrReadError(
        isHeicLike(file) ? 'HEIC_UNSUPPORTED' : 'DECODE_FAILED',
        isHeicLike(file)
          ? 'This device could not read a HEIC photo. Save or export as JPG or PNG.'
          : 'Could not decode that image.'
      );
    }

    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    if (!width || !height) {
      throw new OcrReadError('DECODE_FAILED', 'Could not decode that image.');
    }

    const scale = Math.min(1, MAX_OCR_EDGE / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new OcrReadError('DECODE_FAILED', 'Could not prepare that image.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.85);
    });
    if (!blob) throw new OcrReadError('DECODE_FAILED', 'Could not prepare that image.');
    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const readImageText = async (file: File): Promise<{ text: string; confidence: number }> => {
  const cacheKey = `${file.name}:${file.size}:${file.lastModified}`;
  const cached = ocrCache.get(cacheKey);
  if (cached) return cached;

  const raster = await rasterizeForOcr(file);
  const [{ createWorker }, workerAsset] = await Promise.all([
    import('tesseract.js'),
    import('tesseract.js/dist/worker.min.js?url'),
  ]);
  const worker = await withTimeout(
    createWorker('eng', 1, {
      logger: () => undefined,
      workerPath: workerAsset.default,
      workerBlobURL: false,
    }),
    OCR_TIMEOUT_MS,
    'OCR_TIMEOUT'
  );
  try {
    const { data } = await withTimeout(worker.recognize(raster), OCR_TIMEOUT_MS, 'OCR_TIMEOUT');
    const result = {
      text: (data.text || '').replace(/\u0000/g, '').trim(),
      confidence: typeof data.confidence === 'number' ? data.confidence : 0,
    };
    if (ocrCache.size >= 20) ocrCache.delete(ocrCache.keys().next().value as string);
    ocrCache.set(cacheKey, result);
    return result;
  } catch (err) {
    if (err instanceof OcrReadError) throw err;
    throw new OcrReadError('OCR_FAILED', 'Could not read that screenshot.');
  } finally {
    try {
      await worker.terminate();
    } catch {
      /* ignore */
    }
  }
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
