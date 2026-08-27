import React from 'react';
import {
  ShieldCheck,
  Printer,
  Lock,
  X,
} from 'lucide-react';
import type { ExtractedTransaction, CFCFRMSPayload, Language } from '../types';
import { formatINR, formatDateTimeIN } from '../utils/formatters';

import html2pdf from 'html2pdf.js';

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
  const handlePrint = () => {
    const element = document.getElementById('receipt-document-content');
    if (!element) return;
    
    const opt = {
      margin:       12,
      filename:     `Official_Receipt_${payload.ackNumber}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, windowWidth: 800 },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-card border border-line rounded-lg w-full max-w-xl max-h-[92vh] flex flex-col p-0 shadow-2xl relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-line bg-soft rounded-t-lg no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#15803d]" />
            <h3 className="text-sm font-bold text-ink">
              {currentLang === 'hi'
                ? 'राष्ट्रीय साइबर अपराध पावती रसीद'
                : 'Official NCRP Intercept Acknowledgment'}
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

        {/* Printable Official Slip Body */}
        <div className="p-5 overflow-y-auto bg-white print-content">
          <div
            id="receipt-document-content"
            className="flex flex-col gap-4 bg-white"
            style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
          >
            <div className="p-5 rounded-md border border-[#9ca3af] bg-white flex flex-col gap-4 text-[#111827]">
              {/* Government Title Header */}
              <div className="text-center border-b border-[#e5e7eb] pb-4">
                <span className="badge badge-info text-[10px] uppercase tracking-wider mb-2 border-[#bfdbfe]">
                  Citizen Financial Cyber Fraud Reporting Management System (CFCFRMS)
                </span>
                <h2 className="text-base font-black text-[#111827] tracking-tight uppercase mt-1">
                  Emergency Intercept & Lien Acknowledgment
                </h2>
                <p className="text-[11px] text-[#4b5563] mt-1 font-semibold">
                  Indian Cyber Crime Coordination Centre (I4C) · Ministry of Home Affairs (MHA)
                </p>
              </div>

              {/* Acknowledgment Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb]">
                  <span className="text-[10px] text-[#6b7280] block font-bold mb-1">ACKNOWLEDGMENT NO.</span>
                  <span className="text-sm font-mono font-black text-[#1e3a8a]">{payload.ackNumber}</span>
                </div>
                <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb]">
                  <span className="text-[10px] text-[#6b7280] block font-bold mb-1">CFCFRMS TOKEN</span>
                  <span className="text-sm font-mono font-bold text-[#4b5563]">{payload.cfcfrmsToken}</span>
                </div>
                <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb]">
                  <span className="text-[10px] text-[#6b7280] block font-bold mb-1">TRANSACTION UTR</span>
                  <span className="text-xs font-mono font-bold text-[#111827]">{transaction.utr}</span>
                </div>
                <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb]">
                  <span className="text-[10px] text-[#6b7280] block font-bold mb-1">FRAUD AMOUNT</span>
                  <span className="text-xs font-mono font-black text-[#b91c1c]">{formatINR(transaction.amount)}</span>
                </div>
              </div>

              {/* Transaction Flow Details */}
              <div className="flex flex-col gap-3 text-xs border-t border-[#e5e7eb] pt-4">
                <div className="flex justify-between items-center border-b border-[#f3f4f6] pb-2">
                  <span className="text-[#4b5563] font-semibold">Victim Account / Bank:</span>
                  <span className="font-bold text-[#111827]">{transaction.victimName} · {transaction.remitterBank}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#f3f4f6] pb-2">
                  <span className="text-[#4b5563] font-semibold">Suspect Beneficiary VPA:</span>
                  <span className="font-mono text-[#b91c1c] font-bold">{transaction.beneficiaryVpa}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#f3f4f6] pb-2">
                  <span className="text-[#4b5563] font-semibold">Target Bank Desk:</span>
                  <span className="font-bold text-[#111827]">{transaction.beneficiaryBank}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#f3f4f6] pb-2">
                  <span className="text-[#4b5563] font-semibold">Dispatched At:</span>
                  <span className="font-mono text-[#111827]">{formatDateTimeIN(payload.dispatchedAt)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#4b5563] font-semibold">Statutory Authority:</span>
                  <span className="text-[#15803d] font-bold">Sec 91 Cr.P.C / Sec 94 BNSS 2023</span>
                </div>
              </div>

              {/* Confirmed Lien Seal */}
              <div className="bg-[#f0fdf4] border-2 border-[#15803d] p-3 rounded mt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold shrink-0">
                  <Lock size={20} />
                </div>
                <div className="text-xs">
                  <span className="font-black text-[#15803d] block uppercase tracking-wide">
                    STATUTORY LIEN CONFIRMED & REGISTERED
                  </span>
                  <span className="text-[11px] text-[#15803d] font-medium block mt-1">
                    Target account debit operations restricted. Funds are preserved for court restoration.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 border-t border-line bg-soft rounded-b-lg no-print gap-3">
          <span className="hidden sm:inline text-[11px] text-muted text-left">
            Helpline: <strong className="text-ink">1930</strong> (Toll-Free National)
          </span>
          <div className="btn-group w-full sm:w-auto sm:ml-auto">
            <button onClick={onClose} className="btn-secondary">
              {currentLang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button onClick={handlePrint} className="btn-primary">
              <Printer size={16} />
              <span>{currentLang === 'hi' ? 'रसीद डाउनलोड' : 'Download Receipt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
