import React, { useRef, useState, useEffect } from 'react';
import type { ExtractedTransaction, Language, CFCFRMSPayload } from '../types';
import { BANK_NODAL_DIRECTORY, detectBankFromVpa, getBankNodalOfficer } from '../data/bankNodalDirectory';
import { formatINR, formatTimeRemaining } from '../utils/formatters';
import { getOrCreateSessionDeadline } from '../services/storageService';
import { CustomSelect } from './CustomSelect';

interface DualBankFreezeCardProps {
  transaction: ExtractedTransaction;
  currentLang: Language;
  onDispatchComplete: (payload: CFCFRMSPayload) => void;
  onBack: () => void;
  existingPayload?: CFCFRMSPayload | null;
  onViewLiveTracker?: () => void;
}

export const DualBankFreezeCard: React.FC<DualBankFreezeCardProps> = ({
  transaction,
  currentLang,
  onDispatchComplete,
  onBack,
  existingPayload,
  onViewLiveTracker,
}) => {
  const [deadlineAt] = useState(() => getOrCreateSessionDeadline('freeze', 30 * 60));
  const [now, setNow] = useState(() => Date.now());
  const [isDispatching, setIsDispatching] = useState(false);
  const [showJsonPayload, setShowJsonPayload] = useState(false);

  const bankOptions = Object.values(BANK_NODAL_DIRECTORY).map((bank) => ({
    value: bank.bankName,
    label: bank.bankName,
  }));
  
  // Bank selection state with smart auto-detection
  const [remitterBank, setRemitterBank] = useState(() => {
    if (transaction.remitterBank && !transaction.remitterBank.toLowerCase().includes('unknown')) {
      return transaction.remitterBank;
    }
    return 'HDFC Bank Ltd.';
  });

  const [beneficiaryBank, setBeneficiaryBank] = useState(() => {
    if (transaction.beneficiaryBank && !transaction.beneficiaryBank.toLowerCase().includes('unknown')) {
      return transaction.beneficiaryBank;
    }
    return detectBankFromVpa(transaction.beneficiaryVpa);
  });

  const mountedRef = useRef(true);
  const hi = currentLang === 'hi';

  const remitterOfficer = getBankNodalOfficer(remitterBank);
  const beneficiaryOfficer = getBankNodalOfficer(beneficiaryBank);
  const canDispatch = Boolean(transaction.utr && (transaction.amount > 0 || Number(transaction.amount) > 0));
  const secondsLeft = Math.max(0, Math.ceil((deadlineAt - now) / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleExecuteDispatch = async () => {
    if (existingPayload && onViewLiveTracker) {
      onViewLiveTracker();
      return;
    }
    if (!canDispatch) return;
    setIsDispatching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (!mountedRef.current) return;
      onDispatchComplete({
        ackNumber: `DEMO-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
        cfcfrmsToken: `CFCFRMS-${Date.now().toString().slice(-8)}`,
        incidentTimestamp: transaction.timestamp,
        dispatchedAt: new Date().toISOString(),
        remitterBank: remitterOfficer.bankName,
        beneficiaryBank: beneficiaryOfficer.bankName,
        utr: transaction.utr,
        amount: transaction.amount,
        beneficiaryVpa: transaction.beneficiaryVpa,
        legalSection: 'Section 91 Cr.P.C / Section 94 BNSS 2023',
        priorityScore: 'P0_CRITICAL_GOLDEN_HOUR',
        status: 'DISPATCHED_TO_NODAL_DESK',
      });
    } finally {
      if (mountedRef.current) setIsDispatching(false);
    }
  };

  return (
    <div className="page-wrap page-stack flow-page">
      <p className="crumb">
        <button type="button" onClick={onBack}>{hi ? 'जाँच' : 'Check'}</button>
        <span className="crumb-sep" aria-hidden="true">/</span>
        <span>{hi ? 'डेमो नोटिस' : 'Demo notice'}</span>
      </p>

      {existingPayload && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="anim-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate">
              {hi
                ? `बैंक फ्रीज नोटिस प्रेषित हो चुका है (Ref: ${existingPayload.ackNumber})`
                : `Bank freeze notice already dispatched (Ref: ${existingPayload.ackNumber})`}
            </span>
          </div>
          {onViewLiveTracker && (
            <button
              type="button"
              onClick={onViewLiveTracker}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline shrink-0 cursor-pointer"
            >
              {hi ? 'लाइव ट्रैकर खोलें →' : 'Open Live Tracker →'}
            </button>
          )}
        </div>
      )}

      <div className="dossier-head">
        <header>
          <h1>{hi ? 'डेमो फ्रीज नोटिस।' : 'Demo freeze notice.'}</h1>
          <p className="lede">
            {hi
              ? `${formatTimeRemaining(secondsLeft)} · ${formatINR(transaction.amount)} · यह बैंक को नहीं भेजा जाता।`
              : `${formatTimeRemaining(secondsLeft)} · ${formatINR(transaction.amount)} · This is not sent to a bank.`}
          </p>
        </header>
      </div>

      <div className="action-split">
        {/* Panel 1: Your Bank */}
        <article className="action-panel">
          <div className="flex items-center justify-between gap-2">
            <p className="field-label">{hi ? '1. आपका बैंक' : '1. Your bank'}</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              {hi ? 'सत्यापित' : 'Verified'}
            </span>
          </div>

          <p className="detail-value font-bold text-ink">{remitterOfficer.bankName}</p>
          <p className="detail-meta font-mono text-xs">{transaction.remitterAccount || 'XXXX-XXXX-4012'}</p>
          <p className="detail-meta font-mono text-xs text-muted truncate">{remitterOfficer.nodalEmail}</p>

          <div className="mt-2.5 pt-2 border-t border-line/60">
            <label htmlFor="remitter-bank-select" className="text-[10px] font-bold text-muted block mb-1 uppercase tracking-wider">
              {hi ? 'बैंक बदलें' : 'Change Bank'}
            </label>
            <CustomSelect
              id="remitter-bank-select"
              value={remitterBank}
              onChange={setRemitterBank}
              options={bankOptions}
              ariaLabel={hi ? 'बैंक बदलें' : 'Change Bank'}
            />
          </div>

          <p className="detail-meta text-[11px] text-muted mt-2">
            {hi
              ? 'बैंक से बात करते समय यह UTR बताएं। यह डेमो चार्जबैक शुरू नहीं करता।'
              : 'Quote this UTR to your bank. This demo does not start a chargeback.'}
          </p>
        </article>

        {/* Panel 2: Suspect Bank */}
        <article className="action-panel">
          <div className="flex items-center justify-between gap-2">
            <p className="field-label">{hi ? '2. संदिग्ध का बैंक' : '2. Suspect bank'}</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {hi ? 'नोडल संपर्क तैयार' : 'Nodal Ready'}
            </span>
          </div>

          <p className="detail-value font-bold text-ink">{beneficiaryOfficer.bankName}</p>
          <p className="detail-meta font-mono text-xs text-ink/80">{transaction.beneficiaryVpa || 'UPI / VPA'}</p>
          <p className="detail-meta font-mono text-xs text-muted truncate">{beneficiaryOfficer.nodalEmail}</p>

          <div className="mt-2.5 pt-2 border-t border-line/60">
            <label htmlFor="beneficiary-bank-select" className="text-[10px] font-bold text-muted block mb-1 uppercase tracking-wider">
              {hi ? 'बैंक चुनें / बदलें' : 'Select / Change Bank'}
            </label>
            <CustomSelect
              id="beneficiary-bank-select"
              value={beneficiaryBank}
              onChange={setBeneficiaryBank}
              options={bankOptions}
              ariaLabel={hi ? 'बैंक चुनें / बदलें' : 'Select / Change Bank'}
            />
          </div>

          <p className="detail-meta text-[11px] text-muted mt-2">
            {hi
              ? `${formatINR(transaction.amount)} के लिए बैंक अनुरोध कैसा दिख सकता है।`
              : `What a bank request for ${formatINR(transaction.amount)} could contain.`}
          </p>
        </article>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl border border-line bg-card mt-8 space-y-5">
        <div>
          <p className="font-semibold text-sm text-ink">
            {hi ? 'डेमो कार्रवाई कैसे काम करती है?' : 'How this demo action works:'}
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
            {hi
              ? 'यह प्रोटोटाइप दिखाता है कि धारा 91 CrPC / 94 BNSS आधारित अनुरोध दोनों बैंकों तक कैसे पहुँच सकता है। इस बिल्ड में कोई वास्तविक बैंक कॉल नहीं होती।'
              : 'This prototype shows how a Section 91 Cr.P.C / Section 94 BNSS request could be routed to both banks. This build does not contact a live bank system.'}
          </p>
          <p className="mt-2 text-xs text-subtle">
            {hi ? 'प्रोटोटाइप नोट: बैंकिंग गेटवे प्रेषण सिमुलेटेड है।' : 'Prototype note: Banking gateway dispatch is simulated for demonstration.'}
          </p>
        </div>

        <div className="btn-group pt-1">
          <button
            type="button"
            onClick={handleExecuteDispatch}
            disabled={isDispatching || (!existingPayload && !canDispatch)}
            className="btn-emergency"
          >
            {existingPayload
              ? (hi ? 'लाइव ट्रैकर देखें' : 'View Live Tracker')
              : isDispatching
              ? (hi ? 'भेजा जा रहा है…' : 'Sending…')
              : (hi ? 'डेमो फ्रीज नोटिस तैयार करें' : 'Prepare demo freeze notice')}
          </button>
          <button type="button" onClick={onBack} className="btn-secondary" disabled={isDispatching}>
            {hi ? 'पीछे' : 'Back'}
          </button>
        </div>
      </div>

      <p className="mt-6">
        <button type="button" className="btn-link" onClick={() => setShowJsonPayload(!showJsonPayload)}>
          {showJsonPayload
            ? hi
              ? 'पेलोड छिपाएँ'
              : 'Hide payload'
            : hi
            ? 'तकनीकी पेलोड देखें'
            : 'View technical payload'}
        </button>
      </p>
      {showJsonPayload && (
        <pre className="mt-4 p-4 text-sm overflow-x-auto border border-line">
          {JSON.stringify(
            {
              protocol: 'CFCFRMS_V2_INTERCEPT',
              priority: 'P0_DEMO',
              transaction: {
                utr: transaction.utr,
                amount_inr: transaction.amount,
                remitter_bank: remitterOfficer.bankName,
                beneficiary_vpa: transaction.beneficiaryVpa,
                beneficiary_bank: beneficiaryOfficer.bankName,
              },
              statutory_act: 'Sec 91 CrPC / 94 BNSS 2023',
              nodal_recipients: [remitterOfficer.nodalEmail, beneficiaryOfficer.nodalEmail].filter(Boolean),
            },
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
};

