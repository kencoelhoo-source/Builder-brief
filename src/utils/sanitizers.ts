export const isValidUTR = (utr: string): boolean => {
  // Indian Banking 12-digit numeric UPI/IMPS UTR format
  return /^\d{12}$/.test((utr || '').trim());
};

export const isValidVPA = (vpa: string): boolean => {
  // UPI VPA identifier (e.g. name@bank, merchant@upi)
  return /^[\w.-]+@[\w.-]+$/.test((vpa || '').trim());
};

export const isValidIFSC = (ifsc: string): boolean => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test((ifsc || '').trim().toUpperCase());
};

export const isValidSuspectUrl = (value: string): boolean => {
  try {
    const url = new URL((value || '').trim());
    return (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.hostname);
  } catch {
    return false;
  }
};

export const sanitizeLegalText = (text: string): string => {
  return text
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[^\x20-\x7E\u0900-\u097F\n]/g, '')
    .trim();
};
