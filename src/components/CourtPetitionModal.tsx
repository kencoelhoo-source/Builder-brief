import React from 'react';
import {
  Printer,
  Scale,
  X,
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
      margin:       12,
      filename:     `Court_Petition_${transaction.victimName.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, windowWidth: 800 },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const currentDate = new Date().toLocaleDateString('en-IN');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-card border border-line rounded-lg w-full max-w-2xl max-h-[92vh] flex flex-col p-0 shadow-2xl relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-line bg-soft rounded-t-lg no-print">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-ink" />
            <h3 className="text-sm font-bold text-ink">
              {currentLang === 'hi'
                ? 'न्यायालय याचिका तैयार (Restoration Petition)'
                : 'Generated Restoration Petition'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Legal Document Body */}
        <div className="p-5 sm:p-8 overflow-y-auto bg-white print-content">
          <div
            id="petition-document-content"
            className="flex flex-col gap-4 text-[#111827] bg-white text-[13.5px] leading-relaxed max-w-[650px] mx-auto"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <div className="text-center pb-1">
              <h1 className="text-[15px] font-bold uppercase underline tracking-wide">
                IN THE COURT OF THE CHIEF JUDICIAL MAGISTRATE
              </h1>
              <p className="text-xs mt-1 font-bold">
                CRIMINAL MISCELLANEOUS PETITION NO. _______ OF 2026
              </p>
            </div>

            <div className="space-y-3 text-justify">
              <div>
                <p className="font-bold">IN THE MATTER OF:</p>
                <p className="mt-0.5">
                  An application under Section 457 of the Code of Criminal Procedure, 1973 (Now Section 503 of Bharatiya Nagarik Suraksha Sanhita, 2023) for the release of frozen funds intercepted via the Citizen Financial Cyber Fraud Reporting Management System (CFCFRMS).
                </p>
              </div>

              <div className="py-1">
                <p className="font-bold">BETWEEN:</p>
                <p className="pl-4">
                  {transaction.victimName} ... <strong>APPLICANT / VICTIM</strong> (Mob: {transaction.victimMobile})
                </p>
                <p className="text-center font-bold text-xs my-1">AND</p>
                <p className="pl-4">
                  The State (Through Cyber Crime Cell) &amp; {transaction.beneficiaryBank} ... <strong>RESPONDENTS</strong>
                </p>
              </div>

              <p className="font-bold pt-1">MOST RESPECTFULLY SHOWETH:</p>
              
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  That the applicant holds bank account <strong>{transaction.remitterAccount}</strong> with <strong>{transaction.remitterBank}</strong>.
                </li>
                <li>
                  That on <strong>{transaction.timestamp}</strong>, an amount of <strong>{formatINR(transaction.amount)}</strong> was fraudulently debited ({transaction.fraudCategoryLabel}).
                </li>
                <li>
                  That the applicant immediately reported the fraud via National Helpline 1930 / NCRP (Acknowledgment No: <strong>{payload.ackNumber}</strong>).
                </li>
                <li>
                  That Cyber Cell issued CFCFRMS Token <strong>{payload.cfcfrmsToken}</strong>, successfully intercepting the funds at the suspect beneficiary bank.
                </li>
                <li>
                  That suspect VPA <strong>{transaction.beneficiaryVpa}</strong> at <strong>{transaction.beneficiaryBank}</strong> was placed under statutory debit freeze / lien.
                </li>
                <li>
                  That the frozen amount of {formatINR(transaction.amount)} legally belongs to the applicant, with no third-party claim.
                </li>
              </ol>

              <div className="pt-2">
                <p className="font-bold underline uppercase text-center text-xs">PRAYER</p>
                <p className="mt-1">
                  It is respectfully prayed that this Hon'ble Court be pleased to direct the Station House Officer / Nodal Officer of <strong>{transaction.beneficiaryBank}</strong> to de-freeze the lien amount of <strong>{formatINR(transaction.amount)}</strong> and restore/credit the same back to the applicant's source account with <strong>{transaction.remitterBank}</strong>, in the interest of justice.
                </p>
              </div>

              <div
                className="flex justify-between items-end mt-8 pt-4 border-t border-[#d1d5db]"
                style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
              >
                <div>
                  <p><strong>Place:</strong> ________________</p>
                  <p className="mt-1"><strong>Date:</strong> {currentDate}</p>
                </div>
                <div className="text-center">
                  <p>__________________________________</p>
                  <p className="mt-1 font-bold text-xs">SIGNATURE OF APPLICANT</p>
                  <p className="text-xs text-[#4b5563]">({transaction.victimName})</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 border-t border-line bg-soft rounded-b-lg no-print gap-3">
          <span className="hidden sm:inline text-[11px] text-muted text-left">
            Format compliant with Sec 457 CrPC / 503 BNSS
          </span>
          <div className="btn-group w-full sm:w-auto sm:ml-auto">
            <button onClick={onClose} className="btn-secondary">
              {currentLang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button onClick={handlePrint} className="btn-primary">
              <Printer size={16} />
              <span>{currentLang === 'hi' ? 'याचिका डाउनलोड' : 'Download Petition'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
