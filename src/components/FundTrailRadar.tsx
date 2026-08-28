import React, { useState } from 'react';
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
  const [viewTab, setViewTab] = useState<'radar' | 'application'>('radar');

  const nodes: RadarNode[] = [
    {
      id: 'node-0',
      label: hi ? 'पीड़ित का खाता' : 'Your account',
      subLabel: `${transaction.victimName} (${transaction.remitterBank})`,
      tier: 0,
      amount: transaction.amount,
      status: 'DISPATCHED',
      statusLabel: 'Illustrative demo path',
      statusLabelHi: 'डेमो मार्ग',
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
      statusLabel: 'Illustrative demo path',
      statusLabelHi: 'डेमो मार्ग',
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
      statusLabel: 'Illustrative route',
      statusLabelHi: 'उदाहरण मार्ग',
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
      statusLabel: 'Illustrative route',
      statusLabelHi: 'उदाहरण मार्ग',
      bankName: 'ATM Switch Terminal',
      accountMasked: 'Card #4912',
    },
  ];

  return (
    <div className="page-wrap page-stack flow-page">
      <p className="mb-6">
        <button type="button" className="btn-link" onClick={onBack}>
          ← {hi ? 'फ्रीज पर लौटें' : 'Back to freeze'}
        </button>
      </p>

      {/* Segmented Tab Switcher with Smooth Sliding Indicator */}
      <div className="relative inline-flex items-center p-1 rounded-full bg-soft border border-line mb-6 w-full max-w-sm">
        {/* Sliding Pill Indicator */}
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-card shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            left: viewTab === 'radar' ? '4px' : 'calc(50%)',
          }}
        />

        <button
          type="button"
          onClick={() => setViewTab('radar')}
          className={`relative z-10 flex-1 h-9 flex items-center justify-center gap-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
            viewTab === 'radar'
              ? 'text-ink'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Radio size={13} className={viewTab === 'radar' ? 'text-[#15803d]' : 'text-muted'} />
          <span>{hi ? 'फंड रडार' : 'Intercept Radar'}</span>
        </button>
        <button
          type="button"
          onClick={() => setViewTab('application')}
          className={`relative z-10 flex-1 h-9 flex items-center justify-center gap-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
            viewTab === 'application'
              ? 'text-ink'
              : 'text-muted hover:text-ink'
          }`}
        >
          <ShieldCheck size={13} className={viewTab === 'application' ? 'text-amber-600' : 'text-muted'} />
          <span>{hi ? 'मेरी शिकायत' : 'My Application'}</span>
        </button>
      </div>

      {viewTab === 'radar' ? (
        <div className="anim-slide-left">
          <header className="page-head">
            <p className="eyebrow">{hi ? 'डेमो प्रतिक्रिया तैयार है' : 'Demo response is ready'}</p>
            <h1>
              {hi
                ? `${formatINR(transaction.amount)} की डेमो स्थिति`
                : `Demo status for ${formatINR(transaction.amount)}`}
            </h1>
            <p className="lede">
              {hi
                ? `डेमो संदर्भ ${payload.ackNumber}। इस बिल्ड में कोई वास्तविक बैंक कार्रवाई नहीं हुई।`
                : `Demo reference ${payload.ackNumber}. This build has not taken a real banking action.`}
            </p>
          </header>

          <ol className="trail-list">
            {nodes.map((node) => (
              <li key={node.id}>
                <div>
                  <p className="detail-value">{node.label}</p>
                  <p className="detail-meta">{node.subLabel}</p>
                </div>
                <div className="sm:text-right">
                  <p className="detail-value font-mono">₹{node.amount.toLocaleString('en-IN')}</p>
                  <p className="detail-meta">{hi ? node.statusLabelHi : node.statusLabel}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Next Step / Court Petition */}
          <div className="mt-10 p-5 rounded-2xl border border-line bg-card">
            <h2 className="text-lg font-bold text-ink">
              {hi ? 'धन वापसी का अगला संभावित कदम' : 'Possible next step for fund recovery'}
            </h2>
            <p className="mt-2 text-muted text-xs sm:text-sm leading-relaxed">
              {hi
                ? 'यह डेमो दिखाता है कि वास्तविक बैंक कार्रवाई के बाद कौन से दस्तावेज़ उपयोगी हो सकते हैं। इस प्रोटोटाइप से कोई फ्रीज या वापसी नहीं होती।'
                : 'This demo shows which documents could be useful after a real bank action. No freeze or recovery happens from this prototype.'}
            </p>
            <div className="btn-group mt-6">
              <button type="button" onClick={onOpenCourtPetition} className="btn-primary">
                {hi ? 'डेमो याचिका देखें' : 'View demo petition'}
              </button>
              <button type="button" onClick={onViewReceipt} className="btn-secondary">
                {hi ? 'डेमो रसीद देखें' : 'View demo receipt'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="anim-slide-right">
          <MyApplicationsTab
            transaction={transaction}
            payload={payload}
            currentLang={currentLang}
            onOpenCourtPetition={onOpenCourtPetition}
            onViewReceipt={onViewReceipt}
          />
        </div>
      )}
    </div>
  );
};
