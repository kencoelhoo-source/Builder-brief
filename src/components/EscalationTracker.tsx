import React, { useState } from 'react';
import { ShieldCheck, Radio } from 'lucide-react';
import type { SocialIncident, Language, Sec79Payload } from '../types';
import { MyApplicationsTab } from './MyApplicationsTab';

interface EscalationTrackerProps {
  transaction: SocialIncident;
  payload: Sec79Payload;
  currentLang: Language;
  onGeneratePetition: () => void;
  onBack: () => void;
  onReturnHome?: () => void;
  initialTab?: 'track' | 'details' | 'status' | 'application';
}

export const EscalationTracker: React.FC<EscalationTrackerProps> = ({
  transaction,
  payload,
  currentLang,
  onGeneratePetition,
  onBack,
  onReturnHome,
  initialTab = 'track',
}) => {
  const hi = currentLang === 'hi';
  const normalizeTab = (t?: string): 'track' | 'details' => {
    if (t === 'details' || t === 'status') return 'details';
    return 'track';
  };
  const [viewTab, setViewTab] = useState<'track' | 'details'>(normalizeTab(initialTab));

  React.useEffect(() => {
    if (initialTab) {
      setViewTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  return (
    <div className="page-wrap page-stack flow-page">
      <p className="mb-6">
        <button type="button" className="btn-link" onClick={onBack}>
          ← {hi ? 'मामले की समीक्षा पर लौटें' : 'Back to case review'}
        </button>
      </p>

      <header className="page-head mb-4">
        <p className="eyebrow">{hi ? 'डेमो नोटिस तैयार है' : 'Demo notice is ready'}</p>
        <h1>{hi ? 'टेकडाउन की स्थिति' : 'Takedown status'}</h1>
        <p className="lede">
          {payload.takedownToken} · {transaction.platform}
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
            onReturnHome={onReturnHome}
          />
        </div>
      ) : (
        <div className="anim-slide-right">
          <ol className="trail-list">
            <li>
              <div>
                <p className="field-label">1. {hi ? 'पूर्ण' : 'Done'}</p>
                <p className="detail-value">{hi ? 'Sec 79 नोटिस का डेमो' : 'Section 79 notice demo'}</p>
                <p className="detail-meta">
                  {new Date(payload.dispatchedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
            </li>
            <li>
              <div>
                <p className="field-label">2. {hi ? 'चल रहा है' : 'In progress'}</p>
                <p className="detail-value">{hi ? 'प्लेटफ़ॉर्म समीक्षा (डेमो)' : 'Platform review (demo)'}</p>
                <p className="detail-meta">
                  {payload.grievanceOfficerEmail} · {hi ? '36 घंटे की डेमो अवधि' : '36-hour demo window'}
                </p>
              </div>
            </li>
            <li>
              <div>
                <p className="field-label">3. {hi ? 'यदि आवश्यक हो' : 'If needed'}</p>
                <p className="detail-value">{hi ? 'FIR और पुलिस जाँच' : 'FIR and police investigation'}</p>
                <p className="detail-meta">
                  {hi
                    ? 'प्रोडक्शन में, अनुपालन न होने पर स्थानीय साइबर सेल को भेजा जा सकता है।'
                    : 'In production, non-compliance could be routed to the local cyber cell.'}
                </p>
              </div>
            </li>
          </ol>

          <div className="notice mt-8 text-sm text-muted">
            <p className="font-semibold text-ink">
              {hi ? 'आगे क्या करना है?' : 'What to do next:'}
            </p>
            <p className="mt-1">
              {hi
                ? 'यदि यह वास्तविक घटना है, तो आधिकारिक प्लेटफॉर्म रिपोर्टिंग और स्थानीय साइबर सेल की प्रक्रिया अपनाएँ। यह ड्राफ्ट केवल प्रोटोटाइप है।'
                : 'For a real incident, use the platform’s official reporting channel and your local cyber cell. This draft is only a prototype.'}
            </p>
          </div>

          <button type="button" onClick={onGeneratePetition} className="btn-primary mt-6">
            {hi ? 'पुलिस शिकायत (FIR ड्राफ्ट) देखें' : 'View Police Complaint (FIR Draft)'}
          </button>
        </div>
      )}
    </div>
  );
};
