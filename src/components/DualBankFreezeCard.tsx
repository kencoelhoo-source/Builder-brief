import React, { useRef, useState, useEffect } from 'react';
import type { ExtractedTransaction, Language, CFCFRMSPayload } from '../types';
import { getBankNodalOfficer } from '../data/bankNodalDirectory';
import { formatINR, formatTimeRemaining } from '../utils/formatters';
import { getOrCreateSessionDeadline } from '../services/storageService';

interface DualBankFreezeCardProps {
  transaction: ExtractedTransaction;
  currentLang: Language;
  onDispatchComplete: (payload: CFCFRMSPayload) => void;
  onBack: () => void;
}

export const DualBankFreezeCard: React.FC<DualBankFreezeCardProps> = ({
  transaction,
  currentLang,
  onDispatchComplete,
  onBack,
}) => {
  const [deadlineAt] = useState(() => getOrCreateSessionDeadline('freeze', 30 * 60));
  const [now, setNow] = useState(() => Date.now());
  const [isDispatching, setIsDispatching] = useState(false);
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const mountedRef = useRef(true);
  const hi = currentLang === 'hi';
  const remitterOfficer = getBankNodalOfficer(transaction.remitterBank);
  const beneficiaryOfficer = getBankNodalOfficer(transaction.beneficiaryBank);
  const canDispatch = Boolean(remitterOfficer && beneficiaryOfficer && transaction.utr && transaction.amount > 0);
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
    if (!canDispatch) return;
    setIsDispatching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      if (!mountedRef.current) return;
      onDispatchComplete({
        ackNumber: `DEMO-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
        cfcfrmsToken: `DEMO-CFCFRMS-${Date.now().toString().slice(-8)}`,
        incidentTimestamp: transaction.timestamp,
        dispatchedAt: new Date().toISOString(),
        remitterBank: transaction.remitterBank,
        beneficiaryBank: transaction.beneficiaryBank,
        utr: transaction.utr,
        amount: transaction.amount,
        beneficiaryVpa: transaction.beneficiaryVpa,
        legalSection: 'Section 91 Cr.P.C / Section 94 BNSS, 2023',
        priorityScore: 'P0_CRITICAL_GOLDEN_HOUR',
        status: 'LIEN_CONFIRMED',
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
        <article className="action-panel">
          <p className="field-label">{hi ? '1. आपका बैंक' : '1. Your bank'}</p>
          <p className="detail-value">{remitterOfficer?.bankName || 'Verified bank contact unavailable'}</p>
          <p className="detail-meta">{transaction.remitterAccount}</p>
          <p className="detail-meta">{remitterOfficer?.nodalEmail || 'Select a verified bank before dispatch'}</p>
          <p className="detail-meta">
            {hi
              ? 'बैंक से बात करते समय यह UTR बताएं। यह डेमो चार्जबैक शुरू नहीं करता।'
              : 'Quote this UTR to your bank. This demo does not start a chargeback.'}
          </p>
        </article>
        <article className="action-panel">
          <p className="field-label">{hi ? '2. संदिग्ध का बैंक' : '2. Suspect bank'}</p>
          <p className="detail-value">{beneficiaryOfficer?.bankName || 'Verified bank contact unavailable'}</p>
          <p className="detail-meta">{transaction.beneficiaryVpa}</p>
          <p className="detail-meta">{beneficiaryOfficer?.nodalEmail || 'Select a verified bank before dispatch'}</p>
          <p className="detail-meta">
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
            disabled={isDispatching || !canDispatch}
            className="btn-emergency"
          >
            {isDispatching
              ? hi
                ? 'भेजा जा रहा है…'
                : 'Sending…'
              : hi
              ? 'डेमो फ्रीज नोटिस तैयार करें'
              : 'Prepare demo freeze notice'}
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
                remitter_bank: transaction.remitterBank,
                beneficiary_vpa: transaction.beneficiaryVpa,
                beneficiary_bank: transaction.beneficiaryBank,
              },
              statutory_act: 'Sec 91 CrPC / 94 BNSS 2023',
              nodal_recipients: [remitterOfficer?.nodalEmail, beneficiaryOfficer?.nodalEmail].filter(Boolean),
            },
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
};
