import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  X,
  Download,
  QrCode,
} from 'lucide-react';
import type { ExtractedTransaction, CFCFRMSPayload, Language } from '../types';
import { formatINR, formatDateTimeIN } from '../utils/formatters';
import { downloadElementPdf } from '../utils/pdfExport';

interface OfficialReceiptProps {
  transaction: ExtractedTransaction;
  payload: CFCFRMSPayload;
  currentLang: Language;
  onClose: () => void;
}

export const OfficialReceipt: React.FC<OfficialReceiptProps> = ({
  transaction,
  payload,
  currentLang,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = async () => {
    const element = document.getElementById('receipt-document-content');
    if (!element || isExporting) return;
    setIsExporting(true);
    try {
      await downloadElementPdf(element, `Kavach_Demo_Receipt_${payload.ackNumber || 'DEMO'}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-card border border-line rounded-xl w-full max-w-2xl max-h-[94vh] flex flex-col p-0 shadow-2xl relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-line bg-soft rounded-t-xl no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#15803d]" />
            <h3 className="text-sm font-bold text-ink">
              {currentLang === 'hi'
                ? 'कवच प्रोटोटाइप डेमो रसीद'
                : 'Kavach Prototype Demo Receipt'}
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

            {/* Printable prototype summary */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-[#f8fafc] dark:bg-[#0f172a] print-content flex justify-center">
          <div
            id="receipt-document-content"
            className="w-full max-w-[680px] bg-white text-[#111827] p-5 sm:p-7 rounded-lg border-2 border-[#1e3a8a] shadow-sm flex flex-col gap-3.5"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Prototype header */}
            <div className="text-center border-b-2 border-[#1e3a8a] pb-3 relative">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-wider">
                    KAVACH PROTOTYPE
                  </p>
                  <p className="text-[9px] text-[#475569] font-semibold">
                    NOT AN OFFICIAL GOVERNMENT SERVICE
                  </p>
                </div>
                <div className="text-center px-2">
                  <p className="text-[12px] font-black text-[#1e3a8a] uppercase tracking-wide">
                    DEMONSTRATION DOCUMENT
                  </p>
                  <p className="text-[10px] font-bold text-[#0f172a] uppercase">
                    NO LIVE BANK OR POLICE SYSTEM CONNECTION
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f1f5f9] border border-[#cbd5e1] text-[#334155] font-bold">
                    DEMO ONLY
                  </span>
                </div>
              </div>
              <p className="text-[13px] font-black text-[#111827] uppercase tracking-tight mt-2 bg-[#f8fafc] py-1 border-y border-[#e2e8f0]">
                PROTOTYPE EMERGENCY REPORT SUMMARY
              </p>
            </div>

            {/* Acknowledgment & Token Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-[#f8fafc] p-2.5 rounded border border-[#cbd5e1]">
                <span className="text-[9px] text-[#64748b] block font-bold uppercase">NCRP ACK NO.</span>
                <span className="text-xs font-mono font-black text-[#1e3a8a]">{payload.ackNumber}</span>
              </div>
              <div className="bg-[#f8fafc] p-2.5 rounded border border-[#cbd5e1]">
                <span className="text-[9px] text-[#64748b] block font-bold uppercase">CFCFRMS TOKEN</span>
                <span className="text-xs font-mono font-bold text-[#334155]">{payload.cfcfrmsToken}</span>
              </div>
              <div className="bg-[#f8fafc] p-2.5 rounded border border-[#cbd5e1]">
                <span className="text-[9px] text-[#64748b] block font-bold uppercase">TRANSACTION UTR</span>
                <span className="text-xs font-mono font-bold text-[#0f172a]">{transaction.utr}</span>
              </div>
              <div className="bg-[#fef2f2] p-2.5 rounded border border-[#fecaca]">
                <span className="text-[9px] text-[#991b1b] block font-bold uppercase">DISPUTED AMOUNT</span>
                <span className="text-xs font-mono font-black text-[#b91c1c]">{formatINR(transaction.amount)}</span>
              </div>
            </div>

            {/* Case & Participant Details Table */}
            <div className="border border-[#e2e8f0] rounded overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                    <td className="p-2 font-bold text-[#475569] w-1/3">Complainant / Victim:</td>
                    <td className="p-2 font-semibold text-[#0f172a]">{transaction.victimName} (Mobile: {transaction.victimMobile})</td>
                  </tr>
                  <tr className="border-b border-[#e2e8f0]">
                    <td className="p-2 font-bold text-[#475569]">Source Bank &amp; Account:</td>
                    <td className="p-2 font-mono text-[#0f172a]">{transaction.remitterBank} · {transaction.remitterAccount}</td>
                  </tr>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                    <td className="p-2 font-bold text-[#475569]">Suspect Account / VPA:</td>
                    <td className="p-2 font-mono text-[#b91c1c] font-bold">{transaction.beneficiaryVpa} ({transaction.beneficiaryBank})</td>
                  </tr>
                  <tr className="border-b border-[#e2e8f0]">
                    <td className="p-2 font-bold text-[#475569]">Incident Category:</td>
                    <td className="p-2 text-[#0f172a] font-medium">{transaction.fraudCategoryLabel}</td>
                  </tr>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                    <td className="p-2 font-bold text-[#475569]">Dispatched Timestamp:</td>
                    <td className="p-2 font-mono text-[#0f172a]">{formatDateTimeIN(payload.dispatchedAt)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-[#475569]">Statutory Directive:</td>
                    <td className="p-2 text-[#15803d] font-bold">Section 91 Cr.P.C. / Section 94 BNSS 2023</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Confirmed Statutory Lien Stamp */}
            <div className="bg-[#f0fdf4] border-2 border-[#15803d] p-3 rounded-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold shrink-0">
                  <Lock size={18} />
                </div>
                <div className="text-xs">
                  <span className="font-black text-[#15803d] block uppercase tracking-wide text-[11px]">
                    SIMULATED RESPONSE · NO LIVE LIEN
                  </span>
                  <span className="text-[10.5px] text-[#166534] font-medium block mt-0.5">
                    This visual is a prototype response only. No account was frozen and no funds were preserved by this build.
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-center justify-center p-1.5 bg-white border border-[#bbf7d0] rounded shrink-0">
                <QrCode size={28} className="text-[#15803d]" />
                    <span className="text-[8px] font-mono text-[#15803d] font-bold mt-0.5">DEMO PREVIEW</span>
              </div>
            </div>

            {/* Prototype footer */}
            <div className="border-t border-[#cbd5e1] pt-2 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#64748b] gap-2">
              <p>
                National Cyber Crime Helpline: <strong>1930</strong> (24x7 Citizen Assistance) | <strong>cybercrime.gov.in</strong>
              </p>
              <p className="font-mono text-[9px] text-right">
                Prototype-generated record · not digitally authenticated
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 border-t border-line bg-soft rounded-b-xl no-print gap-3">
          <span className="hidden sm:inline text-[11px] text-muted text-left">
            Prototype-generated demo copy; not an official acknowledgment
          </span>
          <div className="btn-group w-full sm:w-auto sm:ml-auto">
            <button onClick={onClose} className="btn-secondary">
              {currentLang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button onClick={handlePrint} className="btn-primary" disabled={isExporting}>
              <Download size={15} />
              <span>
                {isExporting
                  ? currentLang === 'hi' ? 'तैयार हो रहा है…' : 'Preparing…'
                  : currentLang === 'hi' ? 'रसीद डाउनलोड' : 'Download Receipt (PDF)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
