import React, { useEffect, useState } from 'react';
import { Radio, ShieldCheck } from 'lucide-react';
import type { ExtractedTransaction, Language, CFCFRMSPayload, RadarNode } from '../types';
import { formatINR } from '../utils/formatters';
import { MyApplicationsTab } from './MyApplicationsTab';

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
  const [viewTab, setViewTab] = useState<'radar' | 'application'>('radar');

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
          ← {hi ? 'फ्रीज पर लौटें' : 'Back to freeze'}
        </button>
      </p>

      {/* Segmented Tab Switcher */}
      <div className="inline-flex items-center p-1 rounded-full bg-soft border border-line mb-6 w-full max-w-sm gap-1">
        <button
          type="button"
          onClick={() => setViewTab('radar')}
          className={`flex-1 h-9 flex items-center justify-center gap-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
            viewTab === 'radar'
              ? 'bg-card text-ink shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Radio size={13} className={viewTab === 'radar' ? 'text-[#15803d]' : 'text-muted'} />
          <span>{hi ? 'फंड रडार' : 'Intercept Radar'}</span>
        </button>
        <button
          type="button"
          onClick={() => setViewTab('application')}
          className={`flex-1 h-9 flex items-center justify-center gap-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
            viewTab === 'application'
              ? 'bg-card text-ink shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
        >
          <ShieldCheck size={13} className={viewTab === 'application' ? 'text-amber-600' : 'text-muted'} />
          <span>{hi ? 'मेरी शिकायत' : 'My Application'}</span>
        </button>
      </div>

      {viewTab === 'radar' ? (
        <div>
          <p className="text-success font-bold text-sm">
            {hi ? 'आदेश लागू हो गया' : 'The order has been applied'}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            {hi
              ? `${formatINR(transaction.amount)} फ्रीज कर दी गई है`
              : `${formatINR(transaction.amount)} has been frozen`}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted">
            {hi
              ? `पावती ${payload.ackNumber}। राशि मजिस्ट्रेट आदेश तक सुरक्षित है।`
              : `Acknowledgment ${payload.ackNumber}. The funds stay held until a magistrate restoration order.`}
          </p>

          {/* Intercept Trail Nodes */}
          <ol className="mt-8 border-t border-line">
            {nodes.map((node) => (
              <li key={node.id} className="py-4 sm:py-5 border-b border-line flex flex-col sm:flex-row sm:justify-between gap-2">
                <div>
                  <p className="font-bold text-base sm:text-lg text-ink">{node.label}</p>
                  <p className="text-muted text-xs sm:text-sm mt-0.5">{node.subLabel}</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-mono font-bold text-ink">₹{node.amount.toLocaleString('en-IN')}</p>
                  <p className="text-muted text-xs sm:text-sm mt-0.5">{hi ? node.statusLabelHi : node.statusLabel}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Next Step / Court Petition */}
          <div className="mt-10 p-5 rounded-2xl border border-line bg-card">
            <h2 className="text-lg font-bold text-ink">
              {hi ? 'धन वापसी (अगला कानूनी कदम)' : 'Get the money back (Next Legal Step)'}
            </h2>
            <p className="mt-2 text-muted text-xs sm:text-sm leading-relaxed">
              {hi
                ? 'राशि बैंकिंग लेयर में सुरक्षित फ्रीज हो चुकी है। अब धारा 457 CrPC / 503 BNSS के तहत मजिस्ट्रेट याचिका द्वारा यह रकम आपके खाते में लौटाई जाएगी।'
                : 'Funds are securely locked in the banking layer. A Magistrate Restoration Petition (under Section 457 CrPC / 503 BNSS) is now required to legally release and restore the frozen money directly to your account.'}
            </p>
            <div className="btn-group mt-6">
              <button type="button" onClick={onOpenCourtPetition} className="btn-primary">
                {hi ? 'न्यायालय याचिका' : 'Generate court petition'}
              </button>
              <button type="button" onClick={onViewReceipt} className="btn-secondary">
                {hi ? 'पावती रसीद' : 'Download receipt'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <MyApplicationsTab
          transaction={transaction}
          payload={payload}
          currentLang={currentLang}
          onOpenCourtPetition={onOpenCourtPetition}
          onViewReceipt={onViewReceipt}
        />
      )}
    </div>
  );
};
