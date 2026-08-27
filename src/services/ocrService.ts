import type { CyberIncident, FinancialIncident, SocialIncident } from '../types';
import { MOCK_PERSONAS } from '../data/mockPersonas';

export const parseScreenshotOCR = async (
  fileOrPresetId: string | File
): Promise<CyberIncident> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (typeof fileOrPresetId === 'string') {
    const persona = MOCK_PERSONAS.find((p) => p.id === fileOrPresetId);
    if (persona) {
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
        } as SocialIncident;
      } else {
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
          victimName: 'Ramesh K. Sharma (Demo Citizen)',
          victimMobile: '+91-98765-43210',
          confidenceScore: 98.4,
          extractedVia: 'VISION_OCR',
        } as FinancialIncident;
      }
    }
  }

  // Fallback for an actual uploaded image (default to financial for now)
  return {
    incidentType: 'FINANCIAL',
    utr: '4238' + Math.floor(10000000 + Math.random() * 90000000).toString(),
    amount: 35000,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    remitterBank: 'HDFC Bank Ltd.',
    remitterAccount: 'XXXX-XXXX-4012',
    beneficiaryVpa: 'suspect.payment88@okaxis',
    beneficiaryBank: 'Axis Bank Ltd.',
    fraudCategory: 'UPI_PHISHING',
    fraudCategoryLabel: 'UPI Impersonation / Phishing',
    incidentSummary: 'Payment made to a fraudulent UPI handle following a deceptive customer support call.',
    victimName: 'Citizen (Demo User)',
    victimMobile: '+91-98765-43210',
    confidenceScore: 96.2,
    extractedVia: 'VISION_OCR',
  } as FinancialIncident;
};

export const parseVoiceTranscription = async (
  rawTranscript: string
): Promise<CyberIncident> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerTranscript = rawTranscript.toLowerCase();
  
  // Basic Intent Classification
  const socialKeywords = ['instagram', 'facebook', 'fake profile', 'photo', 'picture', 'blackmail', 'harass', 'social media', 'impersonat', 'फर्जी प्रोफ़ाइल', 'इंस्टाग्राम', 'फोटो'];
  const isSocial = socialKeywords.some(kw => lowerTranscript.includes(kw));

  if (isSocial) {
    let platform = 'Unknown Platform';
    if (lowerTranscript.includes('instagram') || lowerTranscript.includes('इंस्टाग्राम')) platform = 'Instagram';
    else if (lowerTranscript.includes('facebook') || lowerTranscript.includes('फेसबुक')) platform = 'Facebook';
    else if (lowerTranscript.includes('x ') || lowerTranscript.includes('twitter')) platform = 'X (Twitter)';

    return {
      incidentType: 'SOCIAL',
      platform,
      suspectUrl: `https://${platform.toLowerCase()}.com/fake_account_${Math.floor(Math.random() * 1000)}`,
      contentType: 'FAKE_PROFILE',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      fraudCategory: 'SOCIAL_MEDIA_IMPERSONATION',
      fraudCategoryLabel: 'Social Media Impersonation',
      incidentSummary: rawTranscript,
      victimName: 'Spoken Voice Reporter',
      victimMobile: '+91-98765-43210',
      confidenceScore: 89.4,
      extractedVia: 'VOICE_TRANSCRIBE',
    } as SocialIncident;
  }

  // Fallback to Financial Incident
  let amount = 48500;
  const numMatch = rawTranscript.match(/(\d{2,6})/);
  if (numMatch) {
    amount = parseInt(numMatch[1], 10);
  }

  return {
    incidentType: 'FINANCIAL',
    utr: '423984102941',
    amount: amount,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    remitterBank: 'State Bank of India',
    remitterAccount: 'XXXX-XXXX-9182',
    beneficiaryVpa: 'fraudster.vpa@ybl',
    beneficiaryBank: 'Yes Bank Ltd.',
    fraudCategory: 'UPI_PHISHING',
    fraudCategoryLabel: 'Spoken Emergency Voice Report',
    incidentSummary: rawTranscript,
    victimName: 'Spoken Voice Reporter',
    victimMobile: '+91-98765-43210',
    confidenceScore: 94.8,
    extractedVia: 'VOICE_TRANSCRIBE',
  } as FinancialIncident;
};
