export type Language = 'en' | 'hi';

export type AppStep = 'intake' | 'review' | 'freeze' | 'radar' | 'petition';

export type FraudCategory = 
  | 'UPI_PHISHING'
  | 'FAKE_ELECTRICITY_APK'
  | 'DIGITAL_ARREST_EXTORTION'
  | 'TASK_JOB_SCAM'
  | 'QR_CODE_REFUND_FRAUD'
  | 'SOCIAL_MEDIA_IMPERSONATION'
  | 'CYBERBULLYING_HARASSMENT'
  | 'NCII_SEXTORTION'
  | 'HACKING_COMPROMISE'
  | 'OTHER';

export type CasePerspective = 'REPORTING_VICTIM' | 'WRONGLY_ACCUSED';

export interface MockPersonProfile {
  fullName: string;
  mobile: string;
  age: number;
  gender: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  occupation: string;
}

export interface RadarNode {
  id: string;
  label: string;
  subLabel: string;
  tier: number; // 0 = Victim, 1 = Scammer, 2 = Mule 1, 3 = Mule 2, 4 = ATM/Cashout
  amount: number;
  status: 'DISPATCHED' | 'LIEN_LOCKED' | 'INTERCEPTED' | 'BLOCKED' | 'PENDING';
  statusLabel: string;
  statusLabelHi: string;
  bankName: string;
  accountMasked: string;
  frozenAt?: string;
}

export interface FraudPersona {
  id: string;
  name: string;
  nameHi: string;
  incidentType: 'FINANCIAL' | 'SOCIAL';
  category: FraudCategory;
  categoryLabel: string;
  categoryLabelHi: string;
  // Fields for Financial:
  amount?: number;
  utr?: string;
  remitterBank?: string;
  remitterAccountMasked?: string;
  fraudsterVpa?: string;
  fraudsterBank?: string;
  mockNodes?: RadarNode[];
  // Fields for Social:
  platform?: string;
  suspectUrl?: string;
  // Common:
  timestamp: string;
  description: string;
  descriptionHi: string;
  screenshotTag: string;
  profile: MockPersonProfile;
  casePerspective: CasePerspective;
}

export interface BaseIncident {
  incidentType: 'FINANCIAL' | 'SOCIAL';
  timestamp: string;
  fraudCategory: FraudCategory;
  fraudCategoryLabel: string;
  incidentSummary: string;
  victimName: string;
  victimMobile: string;
  confidenceScore: number;
  extractedVia: 'VISION_OCR' | 'VOICE_TRANSCRIBE' | 'MANUAL';
  personProfile?: MockPersonProfile;
  casePerspective?: CasePerspective;
}

export interface FinancialIncident extends BaseIncident {
  incidentType: 'FINANCIAL';
  utr: string;
  amount: number;
  remitterBank: string;
  remitterAccount: string;
  beneficiaryVpa: string;
  beneficiaryBank: string;
}

export interface SocialIncident extends BaseIncident {
  incidentType: 'SOCIAL';
  platform: string; // e.g., "Instagram", "Facebook", "X"
  suspectUrl: string;
  contentType: 'FAKE_PROFILE' | 'HARASSING_POST' | 'PRIVATE_IMAGES' | 'HACKED_ACCOUNT';
}

export type CyberIncident = FinancialIncident | SocialIncident;

/** Alias used by financial-flow components */
export type ExtractedTransaction = FinancialIncident;

export interface BankNodalOfficer {
  bankCode: string;
  bankName: string;
  nodalEmail: string;
  escalationEmail: string;
  emergencyPhone: string;
  cyberCellHead: string;
  jurisdiction: string;
}

export interface CFCFRMSPayload {
  ackNumber: string;
  cfcfrmsToken: string;
  incidentTimestamp: string;
  dispatchedAt: string;
  remitterBank: string;
  beneficiaryBank: string;
  utr: string;
  amount: number;
  beneficiaryVpa: string;
  legalSection: string;
  priorityScore: 'P0_CRITICAL_GOLDEN_HOUR' | 'P1_HIGH' | 'P2_STANDARD';
  status: 'DISPATCHED_TO_NODAL_DESK' | 'HOLD_REQUESTED' | 'LIEN_CONFIRMED';
}

// Payload for Social Media Takedown Request (Section 79)
export interface Sec79Payload {
  ackNumber: string;
  takedownToken: string;
  incidentTimestamp: string;
  dispatchedAt: string;
  platform: string;
  suspectUrl: string;
  legalSection: 'Section 79 IT Act, 2000';
  priorityScore: 'P0_CRITICAL_SAFETY' | 'P1_HIGH' | 'P2_STANDARD';
  status: 'NOTICE_SERVED' | 'REVIEW_PENDING' | 'CONTENT_REMOVED';
  grievanceOfficerEmail: string;
}

export interface CourtPetitionDetails {
  caseNumber: string;
  policeStation: string;
  cjmCourt: string;
  applicantName: string;
  applicantAddress: string;
  applicantPhone: string;
  fraudAmount: number;
  utrNumber: string;
  remitterBank: string;
  beneficiaryBank: string;
  lienAmount: number;
  lienAccountNo: string;
  legalSection: 'Section 457 Cr.P.C / Section 503 BNSS, 2023';
  generatedDate: string;
}
