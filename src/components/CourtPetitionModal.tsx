import React from 'react';
import {
  Printer,
  Scale,
  X,
} from 'lucide-react';
import type { ExtractedTransaction, CFCFRMSPayload, Language } from '../types';
import { formatINR, formatDateTimeIN } from '../utils/formatters';

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
      margin:       15,
      filename:     `Court_Petition_${transaction.victimName.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const currentDate = new Date().toLocaleDateString('en-IN');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-[#e5e7eb] rounded-lg w-full max-w-2xl max-h-[92vh] flex flex-col p-0 shadow-2xl relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb] bg-[#f9fafb] rounded-t-lg no-print">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-[#1e3a8a]" />
            <h3 className="text-sm font-bold text-[#111827]">
              {currentLang === 'hi'
                ? 'न्यायालय याचिका तैयार (Restoration Petition)'
                : 'Generated Restoration Petition'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#6b7280] hover:text-[#111827] p-1 rounded-lg hover:bg-[#e5e7eb] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Legal Document Body */}
        <div className="p-5 sm:p-8 overflow-y-auto bg-white print-content">
          <div id="petition-document-content" className="flex flex-col gap-6 text-[#111827] bg-white" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            
            <div className="text-center">
              <h1 className="text-lg font-bold uppercase underline">
                IN THE COURT OF THE CHIEF JUDICIAL MAGISTRATE
              </h1>
              <p className="text-sm mt-2 font-bold">
                CRIMINAL MISCELLANEOUS PETITION NO. _______ OF 2026
              </p>
            </div>

            <div className="text-sm leading-relaxed text-justify space-y-4">
              <p className="font-bold">IN THE MATTER OF:</p>
              <p>
                An application under Section 457 of the Code of Criminal Procedure, 1973 (Now Section 503 of Bharatiya Nagarik Suraksha Sanhita, 2023) for the release of frozen funds intercepted via the Citizen Financial Cyber Fraud Reporting Management System (CFCFRMS).
              </p>

              <p className="font-bold mt-4">BETWEEN:</p>
              <p className="pl-4">
                {transaction.victimName} ... <strong>APPLICANT / VICTIM</strong><br/>
                Phone: {transaction.victimMobile}
              </p>
              <p className="text-center font-bold">AND</p>
              <p className="pl-4">
                The State (Through Cyber Crime Cell) ... <strong>RESPONDENT</strong>
              </p>

              <p className="font-bold mt-6">MOST RESPECTFULLY SHOWETH:</p>
              
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  That the applicant is a law-abiding citizen and holds a bank account with <strong>{transaction.remitterBank}</strong> (A/c No: {transaction.remitterAccount}).
                </li>
                <li>
                  That on <strong>{transaction.timestamp}</strong>, a fraudulent transaction of <strong>{formatINR(transaction.amount)}</strong> was unlawfully debited from the applicant's account under the modus operandi of {transaction.fraudCategoryLabel}.
                </li>
                <li>
                  That the applicant immediately reported the fraud via the National Cyber Crime Helpline (1930) / NCRP Portal, which was assigned Acknowledgment Number <strong>{payload.ackNumber}</strong>.
                </li>
                <li>
                  That the cyber cell, via CFCFRMS Token <strong>{payload.cfcfrmsToken}</strong> dispatched on {formatDateTimeIN(payload.dispatchedAt)}, successfully intercepted the funds at the suspect beneficiary bank.
                </li>
                <li>
                  That the suspect account bearing VPA <strong>{transaction.beneficiaryVpa}</strong> at <strong>{transaction.beneficiaryBank}</strong> has been placed under statutory debit freeze / lien.
                </li>
                <li>
                  That the intercepted amount of {formatINR(transaction.amount)} legally belongs to the applicant, and no other person has a legitimate claim over it.
                </li>
              </ol>

              <p className="font-bold mt-6 underline uppercase text-center">PRAYER</p>
              <p>
                In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to pass an order directing the Station House Officer / Investigating Officer / Nodal Officer of <strong>{transaction.beneficiaryBank}</strong> to de-freeze the lien amount of <strong>{formatINR(transaction.amount)}</strong> and restore/credit the same back to the applicant's source account with <strong>{transaction.remitterBank}</strong>, in the interest of justice.
              </p>

              <div className="flex justify-between items-end mt-12 pt-8">
                <div>
                  <p><strong>Place:</strong> ________________</p>
                  <p className="mt-2"><strong>Date:</strong> {currentDate}</p>
                </div>
                <div className="text-center">
                  <p>__________________________________</p>
                  <p className="mt-1 font-bold">SIGNATURE OF APPLICANT</p>
                  <p className="text-xs">({transaction.victimName})</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-[#e5e7eb] bg-[#f9fafb] rounded-b-lg no-print gap-4">
          <span className="text-[11px] text-[#6b7280] text-center sm:text-left">
            Format compliant with Sec 457 CrPC / 503 BNSS
          </span>
          <div className="btn-group sm:ml-auto">
            <button onClick={onClose} className="btn-secondary">
              {currentLang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button onClick={handlePrint} className="btn-primary">
              <Printer size={18} />
              <span>{currentLang === 'hi' ? 'याचिका डाउनलोड करें' : 'Download Petition'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
