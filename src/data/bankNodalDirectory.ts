import type { BankNodalOfficer } from '../types';

export const BANK_NODAL_DIRECTORY: Record<string, BankNodalOfficer> = {
  HDFC: {
    bankCode: 'HDFC',
    bankName: 'HDFC Bank Ltd.',
    nodalEmail: 'cybercell.nodal@hdfcbank.com',
    escalationEmail: 'ciso.escalations@hdfcbank.com',
    emergencyPhone: '+91-22-6846-1930',
    cyberCellHead: 'Shri R. Venkatraman (CISO Desk)',
    jurisdiction: 'National Cyber Command / Mumbai Nodal',
  },
  AXIS: {
    bankCode: 'AXIS',
    bankName: 'Axis Bank Ltd.',
    nodalEmail: 'nodal.cybersecurity@axisbank.com',
    escalationEmail: 'fraudrisk.desk@axisbank.com',
    emergencyPhone: '+91-22-2425-1930',
    cyberCellHead: 'Smt. Priya Nair (VP - Fraud Prevention)',
    jurisdiction: 'National Cyber Command / Mumbai Nodal',
  },
  ICICI: {
    bankCode: 'ICICI',
    bankName: 'ICICI Bank Ltd.',
    nodalEmail: 'cybercrime.reporting@icicibank.com',
    escalationEmail: 'emergency.freeze@icicibank.com',
    emergencyPhone: '+91-22-4008-1930',
    cyberCellHead: 'Shri Ananya Sharma (Chief Risk Officer)',
    jurisdiction: 'National Cyber Command / BKC Mumbai',
  },
  SBI: {
    bankCode: 'SBI',
    bankName: 'State Bank of India',
    nodalEmail: 'nodalofficer.cyber@sbi.co.in',
    escalationEmail: 'gm.fraudmonitoring@sbi.co.in',
    emergencyPhone: '+91-22-2274-1930',
    cyberCellHead: 'Shri S. K. Mahapatra (GM Cyber Security)',
    jurisdiction: 'National Cyber Command / Belapur Cyber Cell',
  },
  INDUSIND: {
    bankCode: 'INDUSIND',
    bankName: 'IndusInd Bank Ltd.',
    nodalEmail: 'cyberfrauds@indusind.com',
    escalationEmail: 'nodal.escalate@indusind.com',
    emergencyPhone: '+91-22-6772-1930',
    cyberCellHead: 'Shri Vikram Malhotra',
    jurisdiction: 'National Cyber Command / Pune Central Cell',
  },
  PNB: {
    bankCode: 'PNB',
    bankName: 'Punjab National Bank',
    nodalEmail: 'cybercell@pnb.co.in',
    escalationEmail: 'ciso@pnb.co.in',
    emergencyPhone: '+91-11-2804-1930',
    cyberCellHead: 'Shri Rajesh Gupta (DGM Risk)',
    jurisdiction: 'National Cyber Command / New Delhi Nodal',
  },
  PAYTM_PAYMENTS: {
    bankCode: 'PAYTM_PAYMENTS',
    bankName: 'Paytm Payments Bank / One97',
    nodalEmail: 'nodal.cyber@paytmbank.com',
    escalationEmail: 'emergency-freeze@paytm.com',
    emergencyPhone: '+91-120-4770-1930',
    cyberCellHead: 'Shri Aman Deep (Lead Incident Response)',
    jurisdiction: 'National Cyber Command / Noida Hub',
  },
  KOTAK: {
    bankCode: 'KOTAK',
    bankName: 'Kotak Mahindra Bank',
    nodalEmail: 'nodal.cybercell@kotak.com',
    escalationEmail: 'fraudops.head@kotak.com',
    emergencyPhone: '+91-22-6605-1930',
    cyberCellHead: 'Smt. Kavita Deshmukh',
    jurisdiction: 'National Cyber Command / Mumbai Cell',
  },
  YES: {
    bankCode: 'YES',
    bankName: 'YES Bank Ltd.',
    nodalEmail: 'cybercrime@yesbank.in',
    escalationEmail: 'ciso@yesbank.in',
    emergencyPhone: '+91-22-6121-1930',
    cyberCellHead: 'Shri Gaurav Mittal',
    jurisdiction: 'National Cyber Command / Mumbai Nodal',
  },
  BOB: {
    bankCode: 'BOB',
    bankName: 'Bank of Baroda',
    nodalEmail: 'cyberfraud.nodal@bankofbaroda.com',
    escalationEmail: 'ciso@bankofbaroda.com',
    emergencyPhone: '+91-22-6698-1930',
    cyberCellHead: 'Shri Alok Kumar',
    jurisdiction: 'National Cyber Command / Baroda Hub',
  },
  CANARA: {
    bankCode: 'CANARA',
    bankName: 'Canara Bank',
    nodalEmail: 'nodal.cyber@canarabank.com',
    escalationEmail: 'fraudrisk@canarabank.com',
    emergencyPhone: '+91-80-2222-1930',
    cyberCellHead: 'Shri M. Ramesh',
    jurisdiction: 'National Cyber Command / Bengaluru Cell',
  },
  UNION: {
    bankCode: 'UNION',
    bankName: 'Union Bank of India',
    nodalEmail: 'cybercell@unionbankofindia.bank',
    escalationEmail: 'ciso@unionbankofindia.bank',
    emergencyPhone: '+91-22-2289-1930',
    cyberCellHead: 'Smt. Sunita Rao',
    jurisdiction: 'National Cyber Command / Mumbai Cell',
  },
  GENERAL_NODAL: {
    bankCode: 'GENERAL_NODAL',
    bankName: 'Inter-Bank Nodal Clearing Cell (CFCFRMS Gateway)',
    nodalEmail: 'cfcfrms.nodal@cybercrime.gov.in',
    escalationEmail: 'interbank.escalations@ncrp.gov.in',
    emergencyPhone: '1930',
    cyberCellHead: 'CFCFRMS Designated Officer',
    jurisdiction: 'National Cyber Command / NCRP Gateway',
  },
};

export const detectBankFromVpa = (vpa?: string): string => {
  if (!vpa) return 'State Bank of India';
  const handle = vpa.toLowerCase().split('@')[1] || vpa.toLowerCase();

  if (handle.includes('sbi') || handle.includes('oksbi')) return 'State Bank of India';
  if (handle.includes('hdfc') || handle.includes('okhdfc')) return 'HDFC Bank Ltd.';
  if (handle.includes('icici') || handle.includes('okicici')) return 'ICICI Bank Ltd.';
  if (handle.includes('axis') || handle.includes('okaxis')) return 'Axis Bank Ltd.';
  if (handle.includes('paytm')) return 'Paytm Payments Bank / One97';
  if (handle.includes('kotak') || handle.includes('kmbl')) return 'Kotak Mahindra Bank';
  if (handle.includes('pnb')) return 'Punjab National Bank';
  if (handle.includes('indus')) return 'IndusInd Bank Ltd.';
  if (handle.includes('ybl') || handle.includes('ibl') || handle.includes('yes')) return 'YES Bank Ltd.';
  if (handle.includes('barodampay') || handle.includes('bob')) return 'Bank of Baroda';
  if (handle.includes('cnrb') || handle.includes('canara')) return 'Canara Bank';
  if (handle.includes('union') || handle.includes('uboi')) return 'Union Bank of India';

  return 'State Bank of India';
};

export const getBankNodalOfficer = (bankIdentifier?: string | null): BankNodalOfficer => {
  if (!bankIdentifier || !bankIdentifier.trim()) {
    return BANK_NODAL_DIRECTORY.SBI;
  }
  const upper = bankIdentifier.toUpperCase();

  for (const [key, officer] of Object.entries(BANK_NODAL_DIRECTORY)) {
    if (upper.includes(key) || officer.bankName.toUpperCase().includes(upper)) {
      return officer;
    }
  }

  // Check if it's a VPA handle
  if (bankIdentifier.includes('@')) {
    const detectedName = detectBankFromVpa(bankIdentifier);
    for (const officer of Object.values(BANK_NODAL_DIRECTORY)) {
      if (officer.bankName === detectedName) return officer;
    }
  }

  return BANK_NODAL_DIRECTORY.GENERAL_NODAL;
};

