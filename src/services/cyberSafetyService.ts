export type ScamRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type LinkRiskLevel = 'LOW RISK' | 'SUSPICIOUS' | 'HIGH RISK';

export interface ScamAnalysisResult {
  riskLevel: ScamRiskLevel;
  indicators: string[];
  recommendedActions: string[];
  disclaimer: string;
}

export interface LinkCheckResult {
  riskLevel: LinkRiskLevel;
  reasons: string[];
  normalizedUrl: string;
  disclaimer: string;
}

export interface CyberSafetyActivity {
  scamAnalyses: number;
  linksChecked: number;
  securityChecksCompleted: number;
  lastUpdated?: string;
}

const ACTIVITY_KEY = 'kavach_cyber_safety_activity';

const defaultActivity: CyberSafetyActivity = {
  scamAnalyses: 0,
  linksChecked: 0,
  securityChecksCompleted: 0,
};

const indicatorRules: { label: string; weight: number; patterns: RegExp[] }[] = [
  {
    label: 'Urgency or pressure tactics',
    weight: 2,
    patterns: [/urgent/i, /immediate/i, /within\s+\d+\s*(min|hour|hr|day)/i, /last chance/i, /जल्दी|तुरंत|फौरन/],
  },
  {
    label: 'Threats or account blocking claims',
    weight: 2,
    patterns: [/account.*(blocked|suspended|closed|locked)/i, /legal action/i, /arrest/i, /blocked|suspended/i, /बंद|ब्लॉक|गिरफ्तार/],
  },
  {
    label: 'Requests for OTPs, PINs, passwords, or codes',
    weight: 4,
    patterns: [/\botp\b/i, /\bpin\b/i, /password/i, /verification code/i, /one.?time password/i, /पासवर्ड|ओटीपी|पिन/],
  },
  {
    label: 'Requests for money or payment',
    weight: 3,
    patterns: [/send money/i, /pay now/i, /upi/i, /wallet/i, /transfer/i, /refund fee/i, /भुगतान|पैसे|रुपये|यूपीआई/],
  },
  {
    label: 'Suspicious links',
    weight: 3,
    patterns: [/https?:\/\/\S+/i, /\b[a-z0-9-]+\.(?:top|xyz|click|work|info|loan|online)\b/i, /bit\.ly|tinyurl|t\.co/i],
  },
  {
    label: 'Impersonation of a bank, government, courier, or support desk',
    weight: 2,
    patterns: [/bank/i, /rbi/i, /income tax/i, /govt|government/i, /police/i, /courier/i, /customer care/i, /बैंक|सरकार|पुलिस/],
  },
  {
    label: 'Fake KYC or document update claim',
    weight: 3,
    patterns: [/\bkyc\b/i, /aadhaar|pan card|passport/i, /document.*update/i, /केवाईसी|आधार|पैन/],
  },
  {
    label: 'Unrealistic reward, prize, job, or investment claim',
    weight: 2,
    patterns: [/winner|lottery|prize|reward/i, /guaranteed return/i, /double your money/i, /work from home/i, /इनाम|लॉटरी|नौकरी/],
  },
  {
    label: 'Requests to install software or remote access apps',
    weight: 4,
    patterns: [/install/i, /apk/i, /anydesk|teamviewer|remote access|screen share/i, /ऐप इंस्टॉल|स्क्रीन शेयर/],
  },
  {
    label: 'Requests for sensitive personal information',
    weight: 3,
    patterns: [/card number|cvv|expiry|netbanking|login/i, /account number|ifsc/i, /personal details/i, /सीवीवी|कार्ड नंबर/],
  },
];

const safeActions = [
  'Do not share OTPs, PINs, passwords, CVV, or account recovery codes.',
  'Do not click links or install software from the message.',
  'Contact the bank, government department, or platform through an official website or verified phone number.',
  'Preserve screenshots and report financial loss quickly through 1930 or cybercrime.gov.in.',
];

const classifyScamRisk = (score: number): ScamRiskLevel => {
  if (score >= 12) return 'CRITICAL';
  if (score >= 8) return 'HIGH';
  if (score >= 4) return 'MEDIUM';
  return 'LOW';
};

export const analyzeScamContent = (content: string): ScamAnalysisResult => {
  const text = content.trim().slice(0, 5000);
  const matches = indicatorRules
    .filter((rule) => rule.patterns.some((pattern) => pattern.test(text)))
    .map((rule) => rule.label);
  const score = indicatorRules
    .filter((rule) => rule.patterns.some((pattern) => pattern.test(text)))
    .reduce((total, rule) => total + rule.weight, 0);

  const indicators = matches.length > 0
    ? matches
    : ['No obvious scam indicators were detected in the text provided.'];

  return {
    riskLevel: classifyScamRisk(score),
    indicators,
    recommendedActions: score > 0
      ? safeActions
      : [
          'Still verify the sender through an official channel before acting.',
          'Avoid sharing sensitive information unless you initiated the contact.',
        ],
    disclaimer: 'This AI-style analysis is an assessment and can be wrong. It should not be treated as proof.',
  };
};

const suspiciousTlds = new Set(['zip', 'mov', 'xyz', 'top', 'click', 'loan', 'work', 'info', 'rest', 'support']);
const brandTerms = ['sbi', 'hdfc', 'icici', 'axis', 'rbi', 'upi', 'aadhaar', 'income-tax', 'passport', 'gov', 'police'];
const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly'];

const getHostnameParts = (hostname: string) => hostname.split('.').filter(Boolean);

export const checkSuspiciousLink = (input: string): LinkCheckResult => {
  const raw = input.trim().slice(0, 2048);
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  const reasons: string[] = [];
  let parsed: URL;

  try {
    parsed = new URL(withProtocol);
  } catch {
    return {
      riskLevel: 'HIGH RISK',
      reasons: ['The submitted text could not be parsed as a valid URL.'],
      normalizedUrl: raw,
      disclaimer: 'Treat submitted links as untrusted. This checker does not visit, log in to, submit to, or download from websites.',
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const parts = getHostnameParts(hostname);
  const tld = parts.at(-1) || '';
  const domainLabel = parts.at(-2) || '';
  const fullText = `${hostname}${parsed.pathname}${parsed.search}`.toLowerCase();

  if (parsed.protocol !== 'https:') reasons.push('The link does not use HTTPS.');
  if (shorteners.includes(hostname)) reasons.push('The domain is a URL shortener, which can hide the destination.');
  if (suspiciousTlds.has(tld)) reasons.push('The top-level domain is commonly abused in suspicious links.');
  if (parts.length >= 4) reasons.push('The URL has multiple subdomain levels that may obscure the real domain.');
  if (raw.length > 120 || parsed.search.length > 70) reasons.push('The URL is unusually long or complex.');
  if (/[^\w.-]/.test(hostname) || /@/.test(raw)) reasons.push('The URL contains characters that can mislead readers.');
  if (/\d+\.\d+\.\d+\.\d+/.test(hostname)) reasons.push('The link uses an IP address instead of a recognizable domain.');
  if (brandTerms.some((term) => fullText.includes(term)) && !hostname.endsWith('.gov.in') && domainLabel !== 'gov') {
    reasons.push('The URL uses government or brand-related terms outside an obvious official domain.');
  }
  if (/(0|1|rn|vv)/.test(domainLabel) && brandTerms.some((term) => domainLabel.includes(term.replaceAll('-', '')))) {
    reasons.push('The domain label may be trying to imitate a known organization.');
  }

  return {
    riskLevel: reasons.length >= 4 ? 'HIGH RISK' : reasons.length >= 1 ? 'SUSPICIOUS' : 'LOW RISK',
    reasons: reasons.length > 0 ? reasons : ['No obvious suspicious indicators were detected.'],
    normalizedUrl: parsed.href,
    disclaimer: 'This is a static URL assessment only. It does not prove that a website is safe.',
  };
};

export const getCyberSafetyActivity = (): CyberSafetyActivity => {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || 'null') as Partial<CyberSafetyActivity> | null;
    if (!parsed) return defaultActivity;
    return {
      scamAnalyses: Number(parsed.scamAnalyses) || 0,
      linksChecked: Number(parsed.linksChecked) || 0,
      securityChecksCompleted: Number(parsed.securityChecksCompleted) || 0,
      lastUpdated: typeof parsed.lastUpdated === 'string' ? parsed.lastUpdated : undefined,
    };
  } catch {
    return defaultActivity;
  }
};

export const updateCyberSafetyActivity = (field: keyof Omit<CyberSafetyActivity, 'lastUpdated'>) => {
  try {
    const current = getCyberSafetyActivity();
    const next = {
      ...current,
      [field]: current[field] + 1,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
    return next;
  } catch {
    return getCyberSafetyActivity();
  }
};

export const calculateCyberSafetyScore = (activity: CyberSafetyActivity) => {
  const activityPoints = Math.min(30, activity.scamAnalyses * 5 + activity.linksChecked * 5);
  const checkPoints = Math.min(30, activity.securityChecksCompleted * 10);
  const baseline = 40;
  return Math.min(100, baseline + activityPoints + checkPoints);
};
