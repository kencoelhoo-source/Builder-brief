import React from 'react';
import {
  Scale,
  X,
  Download,
} from 'lucide-react';
import type { ExtractedTransaction, CFCFRMSPayload, Language } from '../types';
import { formatINR } from '../utils/formatters';

import html2pdf from 'html2pdf.js';

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
  const handlePrint = () => {
    const element = document.getElementById('petition-document-content');
    if (!element) return;
    
    const opt = {
      margin:       [10, 12, 10, 12] as [number, number, number, number],
      filename:     `Court_Petition_Sec457_CrPC_${transaction.victimName.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, windowWidth: 794 },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-card border border-line rounded-xl w-full max-w-3xl max-h-[94vh] flex flex-col p-0 shadow-2xl relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-line bg-soft rounded-t-xl no-print">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-ink" />
            <h3 className="text-sm font-bold text-ink">
              {currentLang === 'hi'
                ? 'न्यायालय बहाली याचिका (Sec 457 CrPC / 503 BNSS)'
                : 'Magistrate Court Restoration Petition (Sec 457 CrPC / 503 BNSS)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-icon !w-8 !h-8"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Legal Document Body */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-[#f8fafc] dark:bg-[#0f172a] print-content flex justify-center">
          <div
            id="petition-document-content"
            className="w-full max-w-[720px] bg-white text-[#111827] p-6 sm:p-8 rounded-lg shadow-sm border border-[#e2e8f0] text-[12.5px] leading-relaxed text-justify space-y-3"
            style={{ fontFamily: '"Times New Roman", Times, serif', boxSizing: 'border-box' }}
          >
            {/* Court Header */}
            <div className="text-center pb-2 border-b border-[#cbd5e1]">
              <p className="text-[14px] font-bold uppercase tracking-wide">
                IN THE COURT OF LD. CHIEF JUDICIAL MAGISTRATE / DISTRICT MAGISTRATE AT [DISTRICT]
              </p>
              <p className="text-xs font-bold mt-1">
                MISC. CRIMINAL CASE NO. ________ / 2026
              </p>
              <p className="text-[11px] text-[#475569] mt-0.5">
                (Arising out of NCRP Acknowledgment No. {payload.ackNumber} / Cyber Crime PS)
              </p>
            </div>

            {/* Memo of Parties */}
            <div className="text-xs space-y-1">
              <p className="font-bold text-[13px]">IN THE MATTER OF:</p>
              <div className="pl-3">
                <p><strong>{transaction.victimName}</strong>, S/o / W/o _______________________</p>
                <p>R/o [Residential Address], Mobile: {transaction.victimMobile}</p>
                <p className="text-right font-bold text-[#1e293b]">... APPLICANT / PETITIONER</p>
              </div>
              <p className="text-center font-bold text-xs my-1">VERSUS</p>
              <div className="pl-3 space-y-0.5">
                <p>1. <strong>THE STATE (GOVT. OF NCT / STATE POLICE)</strong></p>
                <p className="pl-3 text-[#475569]">Through Station House Officer, Cyber Crime Police Station</p>
                <p>2. <strong>{transaction.remitterBank.toUpperCase()} LTD.</strong></p>
                <p className="pl-3 text-[#475569]">Through Branch Manager / Nodal Officer (Source Bank)</p>
                <p>3. <strong>{transaction.beneficiaryBank.toUpperCase()} LTD.</strong></p>
                <p className="pl-3 text-[#475569]">Through Designated Nodal Officer / Fraud Risk Management (Beneficiary Bank)</p>
                <p className="text-right font-bold text-[#1e293b]">... RESPONDENTS</p>
              </div>
            </div>

            {/* Application Title */}
            <div className="py-1">
              <p className="text-center font-bold text-xs uppercase underline tracking-tight leading-snug">
                APPLICATION UNDER SECTION 457 OF THE CODE OF CRIMINAL PROCEDURE, 1973 (CORRESPONDING TO SECTION 503 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023) FOR RETURN OF PROPERTY / DE-FREEZING &amp; RESTORATION OF FRAUDULENTLY TRANSFERRED AMOUNT OF {formatINR(transaction.amount)} LYING LIEN-LOCKED IN BENEFICIARY ACCOUNT / VPA {transaction.beneficiaryVpa}
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
                That the Applicant immediately reported the incident on the National Cyber Crime Reporting Portal (NCRP) via Helpline 1930, registered under Acknowledgment Token <strong>{payload.ackNumber}</strong> and CFCFRMS Token <strong>{payload.cfcfrmsToken}</strong>.
              </li>
              <li>
                That pursuant to statutory directive issued under Section 91 Cr.P.C. / Section 94 BNSS 2023, Respondent No. 3 (<strong>{transaction.beneficiaryBank}</strong>) has placed a statutory debit freeze and marked an interim lien over suspect Account / VPA <strong>{transaction.beneficiaryVpa}</strong> for the sum of <strong>{formatINR(transaction.amount)}</strong>.
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
              <div className="flex justify-between items-end pt-3">
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
            Standard Format compliant with Section 457 Cr.P.C. &amp; Section 503 BNSS 2023
          </span>
          <div className="btn-group w-full sm:w-auto sm:ml-auto">
            <button onClick={onClose} className="btn-secondary">
              {currentLang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button onClick={handlePrint} className="btn-primary">
              <Download size={15} />
              <span>{currentLang === 'hi' ? 'PDF डाउनलोड' : 'Download Petition (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
