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
  initialTab?: 'status' | 'application';
}

export const EscalationTracker: React.FC<EscalationTrackerProps> = ({
  transaction,
  payload,
  currentLang,
  onGeneratePetition,
  onBack,
  onReturnHome,
  initialTab = 'status',
}) => {
  const hi = currentLang === 'hi';
  const [viewTab, setViewTab] = useState<'status' | 'application'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setViewTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="page-wrap page-stack flow-page">
      <p className="mb-6">
        <button type="button" className="btn-link" onClick={onBack}>
          ← {hi ? 'कार्रवाई पर लौटें' : 'Back to act'}
        </button>
      </p>

      {/* Segmented Tab Switcher with Smooth Sliding Indicator */}
      <div className="relative inline-flex items-center p-1 rounded-full bg-soft border border-line mb-6 w-full max-w-sm">
        {/* Sliding Pill Indicator */}
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-card shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            left: viewTab === 'status' ? '4px' : 'calc(50%)',
          }}
        />

        <button
          type="button"
          onClick={() => setViewTab('status')}
          className={`relative z-10 flex-1 h-9 flex items-center justify-center gap-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
            viewTab === 'status'
              ? 'text-ink'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Radio size={13} className={viewTab === 'status' ? 'text-[#15803d]' : 'text-muted'} />
          <span>{hi ? 'टेकडाउन रडार' : 'Takedown Radar'}</span>
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

      {viewTab === 'status' ? (
        <div className="anim-slide-left">
          <header className="page-head">
            <p className="eyebrow">{hi ? 'डेमो नोटिस तैयार है' : 'Demo notice is ready'}</p>
            <h1>{hi ? 'टेकडाउन की स्थिति' : 'Takedown status'}</h1>
            <p className="lede">
              {payload.takedownToken} · {transaction.platform}
            </p>
          </header>

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
            {hi ? 'FIR ड्राफ्ट तैयार करें' : 'Generate FIR draft'}
          </button>
        </div>
      ) : (
        <div className="anim-slide-right">
          <MyApplicationsTab
            transaction={transaction}
            payload={payload}
            currentLang={currentLang}
            onReturnHome={onReturnHome}
          />
        </div>
      )}
    </div>
  );
};
