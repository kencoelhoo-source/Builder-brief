import React, { useState } from 'react';
import { Radio, ShieldCheck, Home } from 'lucide-react';
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
  onReturnHome?: () => void;
  initialTab?: 'track' | 'details' | 'radar' | 'application';
}

export const FundTrailRadar: React.FC<FundTrailRadarProps> = ({
  transaction,
  payload,
  currentLang,
  onOpenCourtPetition,
  onViewReceipt,
  onBack,
  onReturnHome,
  initialTab = 'track',
}) => {
  const hi = currentLang === 'hi';
  const normalizeTab = (t?: string): 'track' | 'details' => {
    if (t === 'details' || t === 'radar') return 'details';
    return 'track';
  };
  const [viewTab, setViewTab] = useState<'track' | 'details'>(normalizeTab(initialTab));

  React.useEffect(() => {
    if (initialTab) {
      setViewTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

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
          ← {hi ? 'मामले की समीक्षा पर लौटें' : 'Back to case review'}
        </button>
      </p>

      <header className="page-head mb-4">
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

      {/* Segmented Tab Switcher with Smooth Sliding Indicator */}
      <div className="tab-switcher">
        <div className={`tab-indicator ${viewTab === 'details' ? 'is-right' : 'is-left'}`} />

        <button
          type="button"
          onClick={() => setViewTab('track')}
          className={`tab-btn ${viewTab === 'track' ? 'is-active' : ''}`}
        >
          <Radio size={16} className={viewTab === 'track' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'} />
          <span>{hi ? 'ट्रैक' : 'Track'}</span>
        </button>
        <button
          type="button"
          onClick={() => setViewTab('details')}
          className={`tab-btn ${viewTab === 'details' ? 'is-active' : ''}`}
        >
          <ShieldCheck size={16} className={viewTab === 'details' ? 'text-amber-600 dark:text-amber-400' : 'text-muted'} />
          <span>{hi ? 'विवरण' : 'Details'}</span>
        </button>
      </div>

      {viewTab === 'track' ? (
        <div className="anim-slide-left">
          <MyApplicationsTab
            transaction={transaction}
            payload={payload}
            currentLang={currentLang}
            onViewReceipt={onViewReceipt}
            onReturnHome={onReturnHome}
          />
        </div>
      ) : (
        <div className="anim-slide-right">
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
            <div className="btn-group mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={onOpenCourtPetition} className="btn-primary">
                {hi ? 'डेमो याचिका देखें' : 'View demo petition'}
              </button>
              <button type="button" onClick={onViewReceipt} className="btn-secondary">
                {hi ? 'डेमो रसीद देखें' : 'View demo receipt'}
              </button>
              {onReturnHome && (
                <button type="button" onClick={onReturnHome} className="btn-secondary flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>{hi ? 'होम पर लौटें' : 'Return to Home'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
