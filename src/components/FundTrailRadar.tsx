import React, { useEffect, useState } from 'react';
import type { ExtractedTransaction, Language, CFCFRMSPayload, RadarNode } from '../types';
import { formatINR } from '../utils/formatters';

interface FundTrailRadarProps {
  transaction: ExtractedTransaction;
  payload: CFCFRMSPayload;
  currentLang: Language;
  onOpenCourtPetition: () => void;
  onViewReceipt: () => void;
  onBack: () => void;
}

export const FundTrailRadar: React.FC<FundTrailRadarProps> = ({
  transaction,
  payload,
  currentLang,
  onOpenCourtPetition,
  onViewReceipt,
  onBack,
}) => {
  const hi = currentLang === 'hi';
  const [, setActiveStep] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const nodes: RadarNode[] = [
    {
      id: 'node-0',
      label: hi ? 'पीड़ित का खाता' : 'Your account',
      subLabel: `${transaction.victimName} (${transaction.remitterBank})`,
      tier: 0,
      amount: transaction.amount,
      status: 'DISPATCHED',
      statusLabel: 'Debit confirmed',
      statusLabelHi: 'डेबिट पुष्टि',
      bankName: transaction.remitterBank,
      accountMasked: transaction.remitterAccount,
    },
    {
      id: 'node-1',
      label: hi ? 'संदिग्ध खाता' : 'Suspect account',
      subLabel: `${transaction.beneficiaryVpa} (${transaction.beneficiaryBank})`,
      tier: 1,
      amount: transaction.amount,
      status: 'LIEN_LOCKED',
      statusLabel: 'Lien marked — frozen',
      statusLabelHi: 'लियन — फ्रीज',
      bankName: transaction.beneficiaryBank,
      accountMasked: 'XXXX-8921',
      frozenAt: 'Intercepted',
    },
    {
      id: 'node-2',
      label: hi ? 'मध्यस्थ खाता' : 'Intermediary account',
      subLabel: 'IndusInd Bank',
      tier: 2,
      amount: Math.round(transaction.amount * 0.45),
      status: 'INTERCEPTED',
      statusLabel: 'Transfer intercepted',
      statusLabelHi: 'अंतरण रोका गया',
      bankName: 'IndusInd Bank',
      accountMasked: 'XXXX-5512',
    },
    {
      id: 'node-3',
      label: hi ? 'नकद निकासी' : 'Cash withdrawal',
      subLabel: 'ATM switch',
      tier: 3,
      amount: Math.round(transaction.amount * 0.55),
      status: 'BLOCKED',
      statusLabel: 'Withdrawal blocked',
      statusLabelHi: 'निकासी ब्लॉक',
      bankName: 'ATM Switch Terminal',
      accountMasked: 'Card #4912',
    },
  ];

  return (
    <div className="page-wrap page-stack max-w-3xl">
      <p className="mb-6">
        <button type="button" className="btn-link" onClick={onBack}>
          {hi ? '← वापस' : '← Back'}
        </button>
      </p>
      <p className="text-success font-bold">
        {hi ? 'आदेश लागू हो गया' : 'The order has been applied'}
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mt-2">
        {hi
          ? `${formatINR(transaction.amount)} फ्रीज कर दी गई है`
          : `${formatINR(transaction.amount)} has been frozen`}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {hi
          ? `पावती ${payload.ackNumber}। राशि मजिस्ट्रेट आदेश तक सुरक्षित है।`
          : `Acknowledgment ${payload.ackNumber}. The funds stay held until a magistrate restoration order.`}
      </p>

      <ol className="mt-10 border-t border-line">
        {nodes.map((node) => (
          <li key={node.id} className="py-5 border-b border-line flex flex-col sm:flex-row sm:justify-between gap-2">
            <div>
              <p className="font-bold text-lg">{node.label}</p>
              <p className="text-muted mt-1">{node.subLabel}</p>
            </div>
            <div className="sm:text-right">
              <p className="font-mono font-bold">₹{node.amount.toLocaleString('en-IN')}</p>
              <p className="text-muted mt-1">{hi ? node.statusLabelHi : node.statusLabel}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="text-xl font-bold mt-10">
        {hi ? 'धन वापसी' : 'Get the money back'}
      </h2>
      <p className="mt-2 text-muted text-lg">
        {hi
          ? 'मजिस्ट्रेट याचिका से फ्रीज राशि आपके खाते में लौट सकती है।'
          : 'A magistrate petition is needed to restore the frozen amount to your account.'}
      </p>
      <div className="btn-group mt-8">
        <button type="button" onClick={onOpenCourtPetition} className="btn-primary">
          {hi ? 'न्यायालय याचिका' : 'Generate court petition'}
        </button>
        <button type="button" onClick={onViewReceipt} className="btn-secondary">
          {hi ? 'पावती' : 'Download receipt'}
        </button>
      </div>
    </div>
  );
};
