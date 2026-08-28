export interface SampleScreenshot {
  id: string;
  title: string;
  titleHi: string;
  appBadge: 'Google Pay' | 'SBI Yono' | 'ICICI Mobile' | 'PhonePe';
  accentColor: string;
  amount: string;
  utr: string;
  date: string;
  recipientVpa: string;
  recipientName: string;
}

export const SAMPLE_SCREENSHOTS: Record<string, SampleScreenshot> = {
  'gpay-phishing': {
    id: 'gpay-phishing',
    title: 'Google Pay ₹48,500 Debit',
    titleHi: 'गूगल पे ₹४८,५०० डेबिट',
    appBadge: 'Google Pay',
    accentColor: '#1a73e8',
    amount: '₹48,500.00',
    utr: '423891029384',
    date: '27 Aug 2026, 10:42 PM',
    recipientVpa: 'refund.support99@okaxis',
    recipientName: 'Air Support Services Desk',
  },
  'electricity-apk': {
    id: 'electricity-apk',
    title: 'SBI Yono ₹92,000 Transfer',
    titleHi: 'एसबीआई योनो ₹९२,००० ट्रांसफर',
    appBadge: 'SBI Yono',
    accentColor: '#0083ca',
    amount: '₹92,000.00',
    utr: '423984102941',
    date: '27 Aug 2026, 08:15 PM',
    recipientVpa: 'billdesk.pay91@ybl',
    recipientName: 'Bijli Board Payment Gateway',
  },
  'digital-arrest': {
    id: 'digital-arrest',
    title: 'ICICI ₹1,50,000 IMPS',
    titleHi: 'आईसीआईसीआई ₹१,५०,००० आईएमपीएस',
    appBadge: 'ICICI Mobile',
    accentColor: '#b02a30',
    amount: '₹1,50,000.00',
    utr: '423102938471',
    date: '27 Aug 2026, 06:30 PM',
    recipientVpa: 'cbi.verification@ibl',
    recipientName: 'CBI Cyber Escrow Verification',
  },
  'task-job-scam': {
    id: 'task-job-scam',
    title: 'PhonePe ₹25,000 Task Deposit',
    titleHi: 'फोनपे ₹२५,००० टास्क डिपॉजिट',
    appBadge: 'PhonePe',
    accentColor: '#5f259f',
    amount: '₹25,000.00',
    utr: '423771920391',
    date: '27 Aug 2026, 04:20 PM',
    recipientVpa: 'task.settlement@paytm',
    recipientName: 'Global Media Task Payouts',
  },
};
