import type { CyberIncident, CFCFRMSPayload, Sec79Payload, Language, AppStep } from '../types';

const DRAFT_KEY = 'kavach60_emergency_draft';
const LANG_KEY = 'kavach60_user_lang';
const ACK_KEY = 'kavach60_last_ack';

export interface SavedDraft {
  transaction: CyberIncident | null;
  payload: CFCFRMSPayload | Sec79Payload | null;
  step?: AppStep;
  updatedAt: string;
}

export const saveDraftToStorage = (
  transaction: CyberIncident | null,
  payload: CFCFRMSPayload | Sec79Payload | null,
  step?: AppStep
) => {
  try {
    const draft: SavedDraft = {
      transaction,
      payload,
      step,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

export const getDraftFromStorage = (): SavedDraft | null => {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return null;
  }
};

export const clearDraftFromStorage = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.error('LocalStorage clear error:', e);
  }
};

export const saveLanguagePreference = (lang: Language) => {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    console.error('LocalStorage lang write error:', e);
  }
};

export const getLanguagePreference = (): Language => {
  try {
    const lang = localStorage.getItem(LANG_KEY);
    return lang === 'hi' ? 'hi' : 'en';
  } catch (e) {
    return 'en';
  }
};

export const saveLastAcknowledgment = (ack: string) => {
  try {
    localStorage.setItem(ACK_KEY, ack);
  } catch (e) {
    console.error('LocalStorage ack write error:', e);
  }
};
