import type { CyberIncident, CFCFRMSPayload, Sec79Payload, Language, AppStep } from '../types';

const DRAFT_KEY = 'kavach60_emergency_draft';
const LANG_KEY = 'kavach60_user_lang';
const ACK_KEY = 'kavach60_last_ack';
const STORAGE_VERSION = 1;
const DRAFT_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MANUAL_UTR_KEY = 'kavach_manual_utr';
const MANUAL_AMOUNT_KEY = 'kavach_manual_amt';
const MANUAL_VPA_KEY = 'kavach_manual_vpa';
const FLOW_DEADLINE_PREFIX = 'kavach_demo_deadline_';

export interface SavedDraft {
  version: number;
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
      version: STORAGE_VERSION,
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
    const parsed = JSON.parse(data) as Partial<SavedDraft> | null;
    if (
      !parsed ||
      parsed.version !== STORAGE_VERSION ||
      typeof parsed.updatedAt !== 'string' ||
      !Number.isFinite(Date.parse(parsed.updatedAt)) ||
      Date.now() - Date.parse(parsed.updatedAt) > DRAFT_TTL_MS ||
      !('transaction' in parsed) ||
      (parsed.transaction !== null && typeof parsed.transaction !== 'object')
    ) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return parsed as SavedDraft;
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

export const clearSessionFlowState = () => {
  try {
    sessionStorage.removeItem(MANUAL_UTR_KEY);
    sessionStorage.removeItem(MANUAL_AMOUNT_KEY);
    sessionStorage.removeItem(MANUAL_VPA_KEY);
    const keysToRemove: string[] = [];
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index);
      if (key?.startsWith(FLOW_DEADLINE_PREFIX)) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    /* ignore unavailable session storage */
  }
};

export const getOrCreateSessionDeadline = (name: string, durationSeconds: number): number => {
  const key = `${FLOW_DEADLINE_PREFIX}${name}`;
  try {
    const stored = Number(sessionStorage.getItem(key));
    if (Number.isFinite(stored) && stored > Date.now()) return stored;
    const deadline = Date.now() + durationSeconds * 1000;
    sessionStorage.setItem(key, String(deadline));
    return deadline;
  } catch {
    return Date.now() + durationSeconds * 1000;
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
  } catch {
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
