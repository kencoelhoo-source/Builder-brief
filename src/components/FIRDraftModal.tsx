import React from 'react';
import {
  Printer,
  Scale,
  X,
} from 'lucide-react';
import type { SocialIncident, Sec79Payload, Language } from '../types';

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
    window.print();
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
                ? 'प्रथम सूचना रिपोर्ट (FIR) ड्राफ्ट'
                : 'Generated First Information Report (FIR) Draft'}
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
        <div className="p-5 sm:p-8 overflow-y-auto bg-white flex flex-col gap-6 text-[#111827] print-content" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          
          <div className="text-center">
            <h1 className="text-lg font-bold uppercase underline">
              FIRST INFORMATION REPORT (FIR) - CYBER CRIME
            </h1>
            <p className="text-sm mt-2 font-bold">
              (Under Section 154 Cr.P.C / Section 173 BNSS 2023)
            </p>
          </div>

          <div className="text-sm leading-relaxed text-justify space-y-4">
            <p className="font-bold">TO THE STATION HOUSE OFFICER (SHO),</p>
            <p>
              Cyber Crime Police Station, <br/>
              [Your City/District]
            </p>

            <p className="font-bold mt-4">COMPLAINANT DETAILS:</p>
            <p className="pl-4">
              <strong>Name:</strong> {transaction.victimName}<br/>
              <strong>Mobile:</strong> {transaction.victimMobile}
            </p>

            <p className="font-bold mt-6">SUBJECT:</p>
            <p className="pl-4 font-semibold uppercase">
              Complaint regarding {transaction.fraudCategoryLabel} on {transaction.platform}.
            </p>

            <p className="font-bold mt-6">RESPECTED SIR/MADAM,</p>
            <p>
              I would like to bring to your attention that on {transaction.timestamp}, I discovered a cybercrime incident against me involving {transaction.contentType.replace(/_/g, ' ')}.
            </p>
            
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                That an unknown suspect has engaged in unlawful activities on the platform <strong>{transaction.platform}</strong>.
              </li>
              <li>
                That the suspect profile/URL is located at: <br/>
                <strong>{transaction.suspectUrl}</strong>
              </li>
              <li>
                That I have already initiated an emergency takedown request via the NCRP Omni-Crime Portal (Token: <strong>{payload.takedownToken}</strong>) dispatched on {new Date(payload.dispatchedAt).toLocaleString('en-IN')}.
              </li>
              <li>
                That the specific details of the incident are as follows:<br/>
                <em>"{transaction.incidentSummary}"</em>
              </li>
              <li>
                That this act constitutes offenses under the Information Technology Act, 2000 (including Sec 66C, 66D, or 67 depending on investigation) and the Bharatiya Nyaya Sanhita (BNS) 2023.
              </li>
            </ol>

            <p className="font-bold mt-6 underline uppercase text-center">PRAYER</p>
            <p>
              It is therefore requested that an FIR be registered immediately and strict legal action be taken against the culprit(s). I request the police to requisition IP logs and user details from {transaction.platform} to identify the suspect.
            </p>

            <div className="flex justify-between items-end mt-12 pt-8">
              <div>
                <p><strong>Place:</strong> ________________</p>
                <p className="mt-2"><strong>Date:</strong> {currentDate}</p>
              </div>
              <div className="text-center">
                <p>__________________________________</p>
                <p className="mt-1 font-bold">SIGNATURE OF COMPLAINANT</p>
                <p className="text-xs">({transaction.victimName})</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-[#e5e7eb] bg-[#f9fafb] rounded-b-lg no-print">
          <span className="text-[11px] text-[#6b7280]">
            Format compliant with Sec 154 CrPC / 173 BNSS
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold"
            >
              <Printer size={14} />
              <span>{currentLang === 'hi' ? 'FIR प्रिंट / डाउनलोड करें' : 'Print / Download FIR'}</span>
            </button>
            <button
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-3.5"
            >
              {currentLang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
