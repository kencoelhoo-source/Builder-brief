import React from 'react';
import {
  Printer,
  Scale,
  X,
} from 'lucide-react';
import type { SocialIncident, Sec79Payload, Language } from '../types';

import html2pdf from 'html2pdf.js';

interface FIRDraftModalProps {
  transaction: SocialIncident;
  payload: Sec79Payload;
  currentLang: Language;
  onClose: () => void;
}

export const FIRDraftModal: React.FC<FIRDraftModalProps> = ({
  transaction,
  payload,
  currentLang,
  onClose,
}) => {
  const handlePrint = () => {
    const element = document.getElementById('fir-document-content');
    if (!element) return;
    
    const opt = {
      margin:       12,
      filename:     `FIR_Draft_${transaction.victimName.replace(/\s+/g, '_')}.pdf`,
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
                ? 'प्रथम सूचना रिपोर्ट (FIR) ड्राफ्ट'
                : 'Generated First Information Report (FIR) Draft'}
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
            id="fir-document-content"
            className="flex flex-col gap-4 text-[#111827] bg-white text-[13.5px] leading-relaxed max-w-[650px] mx-auto"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <div className="text-center pb-1">
              <h1 className="text-[15px] font-bold uppercase underline tracking-wide">
                FIRST INFORMATION REPORT (FIR) - CYBER CRIME
              </h1>
              <p className="text-xs mt-1 font-bold">
                (Under Section 154 Cr.P.C / Section 173 BNSS 2023)
              </p>
            </div>

            <div className="space-y-3 text-justify">
              <div>
                <p className="font-bold">TO THE STATION HOUSE OFFICER (SHO),</p>
                <p className="mt-0.5">
                  Cyber Crime Police Station, [City/District]
                </p>
              </div>

              <div className="py-1">
                <p className="font-bold">COMPLAINANT DETAILS:</p>
                <p className="pl-4">
                  <strong>Name:</strong> {transaction.victimName} | <strong>Mobile:</strong> {transaction.victimMobile}
                </p>
              </div>

              <div className="py-0.5">
                <p className="font-bold">SUBJECT:</p>
                <p className="pl-4 font-semibold uppercase text-xs">
                  Complaint regarding {transaction.fraudCategoryLabel} on {transaction.platform}.
                </p>
              </div>

              <p className="font-bold pt-1">RESPECTED SIR/MADAM,</p>
              <p>
                I bring to your attention that on {transaction.timestamp}, a cybercrime incident was discovered involving {transaction.contentType.replace(/_/g, ' ')}.
              </p>
              
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  That an unknown suspect engaged in unlawful activities on <strong>{transaction.platform}</strong>.
                </li>
                <li>
                  That suspect URL: <strong>{transaction.suspectUrl}</strong>
                </li>
                <li>
                  Emergency takedown token: <strong>{payload.takedownToken}</strong> (Dispatched: {new Date(payload.dispatchedAt).toLocaleString('en-IN')}).
                </li>
                <li>
                  Incident statement: <em>"{transaction.incidentSummary}"</em>
                </li>
                <li>
                  Offenses attracted: Information Technology Act, 2000 (Sec 66C, 66D, 67) &amp; Bharatiya Nyaya Sanhita (BNS) 2023.
                </li>
              </ol>

              <div className="pt-2">
                <p className="font-bold underline uppercase text-center text-xs">PRAYER</p>
                <p className="mt-1">
                  It is requested that an FIR be registered immediately and strict legal action be initiated against the culprit(s). Kindly requisition IP and server logs from {transaction.platform} to identify the suspect.
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
                  <p className="mt-1 font-bold text-xs">SIGNATURE OF COMPLAINANT</p>
                  <p className="text-xs text-[#4b5563]">({transaction.victimName})</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 border-t border-line bg-soft rounded-b-lg no-print gap-3">
          <span className="hidden sm:inline text-[11px] text-muted text-left">
            Format compliant with Sec 154 CrPC / 173 BNSS
          </span>
          <div className="btn-group w-full sm:w-auto sm:ml-auto">
            <button onClick={onClose} className="btn-secondary">
              {currentLang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button onClick={handlePrint} className="btn-primary">
              <Printer size={16} />
              <span>{currentLang === 'hi' ? 'FIR डाउनलोड' : 'Download FIR Draft'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
