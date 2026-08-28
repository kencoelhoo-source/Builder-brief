import React, { useEffect } from 'react';
import { CheckCircle2, Info, PlugZap, X } from 'lucide-react';
import type { Language } from '../types';

interface PrototypeBoundaryModalProps {
  currentLang: Language;
  onClose: () => void;
}

export const PrototypeBoundaryModal: React.FC<PrototypeBoundaryModalProps> = ({ currentLang, onClose }) => {
  const hi = currentLang === 'hi';

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="prototype-boundary-modal fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <section
        className="bg-card border border-line rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prototype-boundary-title"
      >
        <header className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-line bg-soft">
          <div className="flex items-start gap-3">
            <div className="prototype-boundary-modal-icon w-9 h-9 rounded-full flex items-center justify-center shrink-0">
              <Info size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="eyebrow">{hi ? 'कवच · प्रोटोटाइप' : 'Kavach · Prototype'}</p>
              <h2 id="prototype-boundary-title" className="text-xl sm:text-2xl font-bold leading-tight mt-1">
                {hi ? 'यह डेमो कैसे काम करता है' : 'How this demo works'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon !w-9 !h-9 shrink-0"
            aria-label={hi ? 'प्रोटोटाइप जानकारी बंद करें' : 'Close prototype information'}
          >
            <X size={18} />
          </button>
        </header>

        <div className="p-5 sm:p-6">
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            {hi
              ? 'अधिकृत CFCFRMS / I4C वर्कफ़्लो से पहले नागरिकों के लिए प्री-इंजेशन लेयर — यह सरकारी सिस्टम नहीं है और इसमें कोई आधिकारिक चिह्न या उपाधि नहीं है।'
              : 'A citizen pre-ingestion layer in front of a future authorised CFCFRMS / I4C workflow — not a government system, emblem or title.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="border border-line rounded-xl p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wide text-success">
                  {hi ? 'आज काम करता है' : 'Working today'}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed mt-2">
                {hi ? 'गाइडेड रिपोर्ट, सबूत चेकलिस्ट, द्विभाषी ड्राफ्ट और सुरक्षा सलाह।' : 'Guided intake, evidence checklists, bilingual drafts and safety guidance.'}
              </p>
            </div>

            <div className="border border-line rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-warning shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wide text-warning">
                  {hi ? 'मॉक / सिमुलेटेड' : 'Mocked / simulated'}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed mt-2">
                {hi ? 'बैंक, पुलिस और प्लेटफ़ॉर्म हैंडऑफ़, टाइमर, खाते और सभी मॉक व्यक्ति।' : 'Bank, police and platform handoffs, timers, accounts and all sample people.'}
              </p>
            </div>

            <div className="border border-line rounded-xl p-4">
              <div className="flex items-center gap-2">
                <PlugZap size={16} className="text-danger shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wide text-danger">
                  {hi ? 'आगे चाहिए' : 'Would need'}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed mt-2">
                {hi ? 'MHA, बैंक और अधिकृत पुलिस / प्लेटफ़ॉर्म इंटीग्रेशन।' : 'MHA, banks and authorised police / platform integrations.'}
              </p>
            </div>
          </div>

          <div className="notice mt-5 flex items-start gap-3">
            <Info size={17} className="text-muted mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-muted leading-relaxed">
              {hi
                ? 'इस डेमो में दिखाए गए खाते, लोग, टाइमर और हैंडऑफ़ सिमुलेटेड हैं। किसी वास्तविक घटना के लिए अपने बैंक और 1930 हेल्पलाइन से तुरंत संपर्क करें।'
                : 'Accounts, people, timers and handoffs shown here are simulated. For a real incident, contact your bank and the 1930 helpline immediately.'}
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button type="button" className="btn-primary" onClick={onClose}>
              {hi ? 'समझ गया' : 'Got it'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
