import React, { useState, useEffect } from 'react';
import type { ExtractedTransaction, Language, CFCFRMSPayload } from '../types';
import { getBankNodalOfficer } from '../data/bankNodalDirectory';
import { formatINR, formatTimeRemaining } from '../utils/formatters';

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
  const [secondsLeft, setSecondsLeft] = useState(1724);
  const [isDispatching, setIsDispatching] = useState(false);
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const hi = currentLang === 'hi';
  const remitterOfficer = getBankNodalOfficer(transaction.remitterBank);
  const beneficiaryOfficer = getBankNodalOfficer(transaction.beneficiaryBank);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExecuteDispatch = async () => {
    setIsDispatching(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    onDispatchComplete({
      ackNumber: `NCRP-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
      cfcfrmsToken: `CFCFRMS-P0-${Date.now().toString().slice(-8)}`,
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
  };

  return (
    <div className="page-wrap page-stack max-w-3xl">
      <p className="mb-6">
        <button type="button" className="btn-link" onClick={onBack}>
          ← {hi ? 'विवरण जाँच पर लौटें' : 'Back to check'}
        </button>
      </p>
      <h1 className="text-3xl md:text-4xl font-bold">
        {hi ? 'फ्रीज नोटिस भेजें' : 'Send the freeze notice'}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {hi
          ? `${formatTimeRemaining(secondsLeft)} गोल्डन ऑवर समय शेष · ${formatINR(transaction.amount)} · धारा 91 CrPC`
          : `${formatTimeRemaining(secondsLeft)} golden hour window remaining · ${formatINR(transaction.amount)} · Section 91 CrPC`}
      </p>

      <div className="mt-8 py-5 border-t border-line">
        <p className="field-label">{hi ? '1. आपका बैंक' : '1. Your bank'}</p>
        <p className="text-lg font-bold">{remitterOfficer.bankName}</p>
        <p className="text-muted mt-1">{transaction.remitterAccount}</p>
        <p className="mt-2">{remitterOfficer.nodalEmail}</p>
        <p className="text-muted mt-1">
          {hi
            ? 'विवादित UTR दर्ज करें और चार्जबैक शुरू करें।'
            : 'Register the disputed UTR and start a chargeback.'}
        </p>
      </div>

      <div className="py-5 border-t border-line">
        <p className="field-label">{hi ? '2. संदिग्ध का बैंक' : '2. Suspect bank'}</p>
        <p className="text-lg font-bold">{beneficiaryOfficer.bankName}</p>
        <p className="text-muted mt-1 break-all">{transaction.beneficiaryVpa}</p>
        <p className="mt-2">{beneficiaryOfficer.nodalEmail}</p>
        <p className="text-muted mt-1">
          {hi
            ? `${formatINR(transaction.amount)} पर तत्काल डेबिट फ्रीज और लियन।`
            : `Place an immediate debit freeze and lien for ${formatINR(transaction.amount)}.`}
        </p>
      </div>

      <div className="notice mt-6 text-sm text-muted">
        <p className="font-semibold text-ink">
          {hi ? 'कार्रवाई कैसे काम करती है?' : 'How this freeze action works:'}
        </p>
        <p className="mt-1">
          {hi
            ? 'धारा 91 CrPC / 94 BNSS के तहत दोनों बैंकों के नोडल अधिकारियों को आधिकारिक निर्देश भेजा जाता है ताकि संदिग्ध खाते से किसी भी प्रकार की निकासी (ATM / ट्रांसफर) तत्काल रोकी जा सके।'
            : 'An official statutory directive under Section 91 Cr.P.C / Section 94 BNSS is transmitted simultaneously to the designated Nodal Officers of both banks to enforce an immediate debit freeze & lien before funds are cashed out.'}
        </p>
        <p className="mt-2 text-xs text-subtle">
          {hi ? 'प्रोटोटाइप नोट: बैंकिंग गेटवे प्रेषण सिमुलेटेड है।' : 'Prototype note: Banking gateway dispatch is simulated for demonstration.'}
        </p>
      </div>

      <div className="btn-group mt-8">
        <button
          type="button"
          onClick={handleExecuteDispatch}
          disabled={isDispatching}
          className="btn-emergency"
        >
          {isDispatching
            ? hi
              ? 'भेजा जा रहा है…'
              : 'Sending…'
            : hi
            ? 'फ्रीज आदेश जारी करें'
            : 'Issue freeze directive'}
        </button>
        <button type="button" onClick={onBack} className="btn-secondary">
          {hi ? 'पीछे' : 'Back'}
        </button>
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
              priority: 'P0_GOLDEN_HOUR',
              transaction: {
                utr: transaction.utr,
                amount_inr: transaction.amount,
                remitter_bank: transaction.remitterBank,
                beneficiary_vpa: transaction.beneficiaryVpa,
                beneficiary_bank: transaction.beneficiaryBank,
              },
              statutory_act: 'Sec 91 CrPC / 94 BNSS 2023',
              nodal_recipients: [remitterOfficer.nodalEmail, beneficiaryOfficer.nodalEmail],
            },
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
};
