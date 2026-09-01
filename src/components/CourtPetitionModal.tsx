import React, { useState } from 'react';
import {
  Scale,
  X,
  Download,
} from 'lucide-react';
import type { ExtractedTransaction, CFCFRMSPayload, Language } from '../types';
import { courtBankTitle, formatINR } from '../utils/formatters';
import { downloadElementPdf } from '../utils/pdfExport';

interface CourtPetitionModalProps {
  transaction: ExtractedTransaction;
  payload: CFCFRMSPayload;
  currentLang: Language;
  onClose: () => void;
}

export const CourtPetitionModal: React.FC<CourtPetitionModalProps> = ({
  transaction,
  payload,
  currentLang,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = async () => {
    const element = document.getElementById('petition-document-content');
    if (!element || isExporting) return;
    setIsExporting(true);
    try {
      const safeName = (transaction.victimName || 'Citizen').replace(/\s+/g, '_');
      await downloadElementPdf(element, `Court_Petition_Sec457_CrPC_${safeName}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const profile = transaction.personProfile;
  const sourceBank = courtBankTitle(transaction.remitterBank);
  const destBank = courtBankTitle(transaction.beneficiaryBank);
  const residence = profile
    ? `${profile.address}, ${profile.city}, ${profile.state} - ${profile.postalCode}`
    : '[Residential address]';

  const [isClosing, setIsClosing] = useState(false);

  const handleSmoothClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(onClose, 150);
  };

  return (
    <div
      className={`fir-modal fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain ${
        isClosing ? 'modal-backdrop-exit' : 'modal-backdrop-enter'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleSmoothClose();
      }}
    >
      <div
        className={`fir-modal-shell bg-card border border-line-strong rounded-2xl w-full max-w-3xl max-h-[94vh] flex flex-col p-0 shadow-2xl relative min-w-0 overflow-hidden overscroll-contain ${
          isClosing ? 'modal-content-exit' : 'modal-content-enter'
        }`}
      >
        <div className="flex items-start justify-between gap-3 p-3.5 sm:p-4 border-b border-line bg-soft/40 no-print">
          <div className="flex items-start gap-2 min-w-0">
            <Scale size={18} className="text-ink shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ink leading-snug">
                {currentLang === 'hi' ? 'अदालत याचिका का ड्राफ्ट' : 'Court petition draft'}
              </h3>
              <p className="text-[11px] text-muted mt-0.5 leading-snug">
                {currentLang === 'hi'
                  ? 'Sec 457 CrPC / 503 BNSS · डेमो · दाखिल नहीं'
                  : 'Sec 457 CrPC / 503 BNSS · demo · not filed'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSmoothClose}
            className="w-8 h-8 rounded-full bg-soft hover:bg-line border border-line flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="fir-modal-body p-3 sm:p-6 overflow-y-auto bg-[#f8fafc] dark:bg-[#0f172a] print-content flex items-start justify-center min-w-0">
          <div
            id="petition-document-content"
            className="fir-document w-full max-w-[720px] bg-white text-[#111827] p-5 sm:p-8 rounded-lg shadow-sm border border-[#e2e8f0] text-[12.5px] leading-relaxed text-left space-y-3 shrink-0 h-auto my-1 sm:my-2"
            style={{ fontFamily: '"Times New Roman", Times, serif', boxSizing: 'border-box' }}
          >
            {/* Court Header */}
            <div className="text-center pb-2 border-b border-[#cbd5e1]">
              <p className="text-[10px] font-black text-[#b91c1c] uppercase mb-1">PROTOTYPE TEMPLATE (NOT FILED WITH ANY COURT)</p>
              <p className="text-[13px] font-bold uppercase leading-snug">
                IN THE COURT OF LD. CHIEF JUDICIAL MAGISTRATE / DISTRICT MAGISTRATE AT [DISTRICT]
              </p>
              <p className="text-xs font-bold mt-1">
                MISC. CRIMINAL CASE NO. ________ / 2026
              </p>
              <p className="text-[11px] text-[#475569] mt-0.5">
                (Prototype reference {payload.ackNumber} / Cyber Crime PS)
              </p>
            </div>

            {/* Memo of Parties */}
            <div className="text-xs space-y-1">
              <p className="font-bold text-[13px]">IN THE MATTER OF:</p>
              <div className="pl-3">
                <p><strong>{transaction.victimName}</strong>, S/o / W/o _______________________</p>
                <p>R/o {residence}, Mobile: {transaction.victimMobile}</p>
                <p className="text-right font-bold text-[#1e293b]">... APPLICANT / PETITIONER</p>
              </div>
              <p className="text-center font-bold text-xs my-1">VERSUS</p>
              <div className="pl-3 space-y-0.5">
                <p>1. <strong>THE STATE (GOVT. OF NCT / STATE POLICE)</strong></p>
                <p className="pl-3 text-[#475569]">Through Station House Officer, Cyber Crime Police Station</p>
                <p>2. <strong>{sourceBank}</strong></p>
                <p className="pl-3 text-[#475569]">Through Branch Manager / Nodal Officer (Source Bank)</p>
                <p>3. <strong>{destBank}</strong></p>
                <p className="pl-3 text-[#475569]">Through Designated Nodal Officer / Fraud Risk Management (Beneficiary Bank)</p>
                <p className="text-right font-bold text-[#1e293b]">... RESPONDENTS</p>
              </div>
            </div>

            {/* Application Title */}
            <div className="py-1">
              <p className="text-center font-bold text-xs uppercase leading-snug">
                Prototype application under Section 457 CrPC, 1973 (Section 503 BNSS, 2023)
              </p>
              <p className="text-center text-[11px] leading-snug mt-1">
                For review of a possible fraudulent transfer of {formatINR(transaction.amount)} to VPA {transaction.beneficiaryVpa}
              </p>
            </div>

            <p className="font-bold text-xs">MOST RESPECTFULLY SHOWETH:</p>

            {/* Numbered Pleadings */}
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[#1e293b]">
              <li>
                That the Applicant is a law-abiding citizen residing at the address stated above and maintains Bank Account No. <strong>{transaction.remitterAccount}</strong> with <strong>{transaction.remitterBank}</strong>.
              </li>
              <li>
                That on <strong>{transaction.timestamp}</strong>, the Applicant fell victim to cyber fraud ({transaction.fraudCategoryLabel}), resulting in unauthorized debit of <strong>{formatINR(transaction.amount)}</strong> under Transaction UTR / Ref: <strong>{transaction.utr}</strong>.
              </li>
              <li>
                That this prototype generated a sample acknowledgment reference <strong>{payload.ackNumber}</strong> and CFCFRMS-shaped token <strong>{payload.cfcfrmsToken}</strong>. No NCRP complaint was submitted by this build.
              </li>
              <li>
                That this prototype models a possible statutory directive under Section 91 Cr.P.C. / Section 94 BNSS 2023. No bank has placed a freeze or lien through this build.
              </li>
              <li>
                That the said amount is case property under bank custody/lien. The Applicant is the sole, lawful, bonafide owner of the funds, and no other claimant has asserted any legitimate title or interest over the same.
              </li>
              <li>
                That continued retention of the siphoned amount causes severe financial hardship to the Applicant. The Applicant undertakes to execute an indemnity bond or abide by any terms this Hon'ble Court may deem fit.
              </li>
            </ol>

            {/* Prayer Clause */}
            <div className="pt-1 bg-[#f1f5f9] p-3 rounded border border-[#cbd5e1]">
              <p className="font-bold underline uppercase text-center text-xs">PRAYER</p>
              <p className="mt-1 text-xs leading-relaxed">
                WHEREFORE, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-[11.5px]">
                <li>
                  Direct Respondent No. 3 (<strong>{transaction.beneficiaryBank}</strong>) to immediately lift the lien and reverse/credit the frozen amount of <strong>{formatINR(transaction.amount)}</strong> into Applicant’s Account No. <strong>{transaction.remitterAccount}</strong> with <strong>{transaction.remitterBank}</strong>;
                </li>
                <li>
                  Direct Respondent No. 1 (Cyber Police Station) to submit compliance report on record; and
                </li>
                <li>
                  Pass any such further order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.
                </li>
              </ul>
            </div>

            {/* Verification & Signature Block */}
            <div className="pt-2 text-xs border-t border-[#cbd5e1] space-y-2">
              <p className="text-[11px] italic text-[#475569]">
                <strong>VERIFICATION:</strong> Verified at [City] on {currentDate} that the contents of paragraphs 1 to 6 are true and correct to the best of my knowledge, legal information, and belief.
              </p>
              <div className="flex flex-wrap justify-between items-end gap-4 pt-3">
                <div>
                  <p><strong>Place:</strong> ________________</p>
                  <p><strong>Date:</strong> {currentDate}</p>
                </div>
                <div className="text-center">
                  <p>__________________________________</p>
                  <p className="mt-1 font-bold text-xs">APPLICANT / ADVOCATE FOR APPLICANT</p>
                  <p className="text-[11px] text-[#475569]">({transaction.victimName})</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 border-t border-line bg-soft rounded-b-xl no-print gap-3">
          <span className="hidden sm:inline text-[11px] text-muted text-left">
            Prototype template for review; obtain legal advice before filing
          </span>
          <div className="btn-group w-full sm:w-auto sm:ml-auto">
            <button type="button" onClick={handleSmoothClose} className="btn-secondary">
              {currentLang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button onClick={handlePrint} className="btn-primary" disabled={isExporting}>
              <Download size={15} />
              <span>
                {isExporting
                  ? currentLang === 'hi' ? 'तैयार हो रहा है…' : 'Preparing…'
                  : currentLang === 'hi' ? 'PDF डाउनलोड' : 'Download Petition (PDF)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
