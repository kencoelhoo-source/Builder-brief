export const formatUTR = (utr: string): string => {
  const digits = (utr || '').replace(/\s+/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

/** Bank name for a court caption — no doubled "Ltd." */
export const courtBankTitle = (name: string): string => {
  const raw = (name || 'the concerned bank').trim().replace(/\.+$/, '');
  return raw.toUpperCase().replace(/\s+LTD\.?\s+LTD\.?/g, ' LTD.');
};

export const formatINR = (amount: number): string => {
  const value = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value}`;
  }
};

export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return '00:00 (EXPIRED)';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDateTimeIN = (dateStr?: string): string => {
  const date = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(date.getTime())) return dateStr || '';
  try {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return date.toISOString();
  }
};
