import React, { useState } from 'react';
import {
  Scale,
  X,
  Download,
} from 'lucide-react';
import type { SocialIncident, Sec79Payload, Language } from '../types';
import { downloadElementPdf } from '../utils/pdfExport';

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
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = async () => {
    const element = document.getElementById('fir-document-content');
    if (!element || isExporting) return;
    setIsExporting(true);
    try {
      const safeName = (transaction.victimName || 'Citizen').replace(/\s+/g, '_');
      await downloadElementPdf(element, `FIR_Draft_CyberCrime_${safeName}.pdf`);
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
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3 p-3.5 sm:p-4 border-b border-line bg-soft/40 no-print">
          <div className="flex items-start gap-2 min-w-0">
            <Scale size={18} className="text-ink shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ink leading-snug">
                {currentLang === 'hi' ? 'FIR शिकायत ड्राफ्ट' : 'FIR complaint draft'}
              </h3>
              <p className="text-[11px] text-muted mt-0.5 leading-snug">
                {currentLang === 'hi'
                  ? 'Sec 154 CrPC / 173 BNSS · डेमो · दाखिल नहीं'
                  : 'Sec 154 CrPC / 173 BNSS · demo · not filed'}
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

        {/* Printable Legal Document Body */}
        <div className="fir-modal-body p-3 sm:p-6 overflow-y-auto bg-[#f8fafc] dark:bg-[#0f172a] print-content flex items-start justify-center min-w-0">
          <div
            id="fir-document-content"
            className="fir-document w-full max-w-[720px] bg-white text-[#111827] p-5 sm:p-8 rounded-lg shadow-sm border border-[#e2e8f0] text-[12.5px] leading-relaxed text-left space-y-3 shrink-0 h-auto my-1 sm:my-2"
            style={{ fontFamily: '"Times New Roman", Times, serif', boxSizing: 'border-box' }}
          >
            <div className="text-center pb-2 border-b border-[#cbd5e1]">
              <p className="text-[10px] font-black text-[#b91c1c] uppercase mb-1">PROTOTYPE TEMPLATE (NOT A FILED FIR)</p>
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
                <p><strong>Address:</strong> {profile ? `${profile.address}, ${profile.city}, ${profile.state} - ${profile.postalCode}` : '[Permanent / Residential Address of Complainant]'}</p>
                <p><strong>Age / Gender:</strong> {profile ? `${profile.age} / ${profile.gender}` : '[Age / Gender]'} | <strong>Occupation:</strong> {profile?.occupation || '[Occupation]'}</p>
                <p><strong>Subject:</strong> Formal criminal complaint regarding cyber impersonation, privacy violation, and defamation on <strong>{transaction.platform}</strong> (Sec 66C, 66D, 67 IT Act, 2000 &amp; BNS 2023).</p>
              </div>
            </div>

            <p className="font-bold text-xs">RESPECTED SIR / MADAM,</p>
            <p className="text-xs">
              I most respectfully submit the following facts for immediate registration of an FIR and prompt investigation:
            </p>

            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[#1e293b]">
              <li>
                That on <strong>{transaction.timestamp}</strong>, it came to my knowledge that an unknown accused created/circulated unauthorized and malicious material ({(transaction.contentType || 'CONTENT').replace(/_/g, ' ')}) on <strong>{transaction.platform || 'the platform'}</strong> targeting my personal identity.
              </li>
              <li>
                That the offending URL / Profile handle is: <strong className="break-all">{transaction.suspectUrl}</strong>.
              </li>
              <li>
                That this prototype generated a sample Section 79(3)(b) notice reference under Token: <strong>{payload.takedownToken}</strong> on {new Date(payload.dispatchedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}. No notice was transmitted by this build.
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
                  : currentLang === 'hi' ? 'FIR डाउनलोड' : 'Download FIR Draft (PDF)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
