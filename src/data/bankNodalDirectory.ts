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
};

export const getBankNodalOfficer = (bankIdentifier: string): BankNodalOfficer | null => {
  const upper = bankIdentifier.toUpperCase();
  for (const [key, officer] of Object.entries(BANK_NODAL_DIRECTORY)) {
    if (upper.includes(key) || officer.bankName.toUpperCase().includes(upper)) {
      return officer;
    }
  }
  return null;
};
