import React from 'react';
import {
  Scale,
  X,
  Download,
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
      margin:       [10, 12, 10, 12] as [number, number, number, number],
      filename:     `FIR_Draft_CyberCrime_${transaction.victimName.replace(/\s+/g, '_')}.pdf`,
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
                ? 'प्रथम सूचना रिपोर्ट (FIR) ड्राफ्ट (Sec 154 CrPC / 173 BNSS)'
                : 'Police FIR Complaint Draft (Sec 154 CrPC / 173 BNSS)'}
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
            id="fir-document-content"
            className="w-full max-w-[720px] bg-white text-[#111827] p-6 sm:p-8 rounded-lg shadow-sm border border-[#e2e8f0] text-[12.5px] leading-relaxed text-justify space-y-3"
            style={{ fontFamily: '"Times New Roman", Times, serif', boxSizing: 'border-box' }}
          >
            <div className="text-center pb-2 border-b border-[#cbd5e1]">
              <h1 className="text-[14px] font-bold uppercase tracking-wide">
                FORMAL POLICE COMPLAINT / FIRST INFORMATION REPORT (FIR) - CYBER CRIME
              </h1>
              <p className="text-xs font-bold mt-1">
                (Under Section 154 of Cr.P.C., 1973 / Section 173 of Bharatiya Nagarik Suraksha Sanhita, 2023)
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <p className="font-bold text-[13px]">TO,</p>
                <p className="font-bold">THE STATION HOUSE OFFICER (SHO),</p>
                <p className="text-[#475569]">Cyber Crime Police Station, [District / Commissionerate]</p>
              </div>

              <div className="bg-[#f8fafc] p-2.5 rounded border border-[#cbd5e1] space-y-1">
                <p><strong>Complainant:</strong> {transaction.victimName} | <strong>Mobile:</strong> {transaction.victimMobile}</p>
                <p><strong>Address:</strong> [Permanent / Residential Address of Complainant]</p>
                <p><strong>Subject:</strong> Formal criminal complaint regarding cyber impersonation, privacy violation, and defamation on <strong>{transaction.platform}</strong> (Sec 66C, 66D, 67 IT Act, 2000 &amp; BNS 2023).</p>
              </div>
            </div>

            <p className="font-bold text-xs">RESPECTED SIR / MADAM,</p>
            <p className="text-xs">
              I most respectfully submit the following facts for immediate registration of an FIR and prompt investigation:
            </p>

            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[#1e293b]">
              <li>
                That on <strong>{transaction.timestamp}</strong>, it came to my knowledge that an unknown accused created/circulated unauthorized and malicious material ({transaction.contentType.replace(/_/g, ' ')}) on <strong>{transaction.platform}</strong> targeting my personal identity.
              </li>
              <li>
                That the offending URL / Profile handle is: <strong className="break-all">{transaction.suspectUrl}</strong>.
              </li>
              <li>
                That an emergency statutory Notice under Section 79(3)(b) of the Information Technology Act, 2000 was transmitted to the Grievance Officer under Token: <strong>{payload.takedownToken}</strong> on {new Date(payload.dispatchedAt).toLocaleString('en-IN')}.
              </li>
              <li>
                That the acts committed attract cognizable offenses under Section 66C (Identity Theft), Section 66D (Cheating by Personation), Section 67 of the IT Act, 2000, and corresponding provisions of the Bharatiya Nyaya Sanhita, 2023.
              </li>
            </ol>

            <div className="bg-[#f1f5f9] p-3 rounded border border-[#cbd5e1]">
              <p className="font-bold underline uppercase text-center text-xs">PRAYER / RELIEF SOUGHT</p>
              <p className="mt-1 text-xs">
                In view of the grave cyber offense, it is respectfully prayed that:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-0.5 text-[11.5px]">
                <li>An FIR be registered under relevant sections of the IT Act &amp; BNS 2023;</li>
                <li>Statutory requisition under Section 91 Cr.P.C. be issued to <strong>{transaction.platform}</strong> for IP logs, registration device IDs, and subscriber details of the accused profile; and</li>
                <li>Strict criminal proceedings be initiated to apprehend the perpetrators.</li>
              </ul>
            </div>

            <div className="pt-3 text-xs border-t border-[#cbd5e1] flex justify-between items-end">
              <div>
                <p><strong>Place:</strong> ________________</p>
                <p><strong>Date:</strong> {currentDate}</p>
              </div>
              <div className="text-center">
                <p>__________________________________</p>
                <p className="mt-1 font-bold text-xs">SIGNATURE OF COMPLAINANT</p>
                <p className="text-[11px] text-[#475569]">({transaction.victimName})</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 border-t border-line bg-soft rounded-b-xl no-print gap-3">
          <span className="hidden sm:inline text-[11px] text-muted text-left">
            Standard Format compliant with Section 154 Cr.P.C. &amp; Section 173 BNSS 2023
          </span>
          <div className="btn-group w-full sm:w-auto sm:ml-auto">
            <button onClick={onClose} className="btn-secondary">
              {currentLang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button onClick={handlePrint} className="btn-primary">
              <Download size={15} />
              <span>{currentLang === 'hi' ? 'FIR डाउनलोड' : 'Download FIR Draft (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
