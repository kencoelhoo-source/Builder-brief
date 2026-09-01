import React, { useEffect } from 'react';
import { CheckCircle2, Info, PlugZap, X } from 'lucide-react';
import type { Language } from '../types';

interface PrototypeBoundaryModalProps {
  currentLang: Language;
  onClose: () => void;
}

export const PrototypeBoundaryModal: React.FC<PrototypeBoundaryModalProps> = ({ currentLang, onClose }) => {
  const hi = currentLang === 'hi';
  const [isClosing, setIsClosing] = React.useState(false);

  const handleSmoothClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(onClose, 150);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleSmoothClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className={`prototype-boundary-modal fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-3 sm:p-4 overscroll-contain ${
        isClosing ? 'modal-backdrop-exit' : 'modal-backdrop-enter'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleSmoothClose();
      }}
    >
      <section
        className={`bg-card border border-line-strong rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden overscroll-contain ${
          isClosing ? 'modal-content-exit' : 'modal-content-enter'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prototype-boundary-title"
      >
        <header className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-line bg-soft/40">
          <div className="flex items-start gap-3">
            <Info size={22} className="text-muted mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="eyebrow">{hi ? 'कवच · प्रोटोटाइप' : 'Kavach · Prototype'}</p>
              <h2 id="prototype-boundary-title" className="text-xl sm:text-2xl font-bold leading-tight mt-1 text-ink">
                {hi ? 'यह डेमो कैसे काम करता है' : 'How this demo works'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSmoothClose}
            className="w-8 h-8 rounded-full bg-soft hover:bg-line border border-line flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0 cursor-pointer"
            aria-label={hi ? 'प्रोटोटाइप जानकारी बंद करें' : 'Close prototype information'}
          >
            <X size={18} strokeWidth={2} />
          </button>
        </header>

        <div className="p-5 sm:p-6">
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            {hi
              ? 'अधिकृत CFCFRMS / I4C वर्कफ़्लो से पहले नागरिकों के लिए प्री-इंजेशन लेयर (यह सरकारी सिस्टम नहीं है और इसमें कोई आधिकारिक चिह्न या उपाधि नहीं है)।'
              : 'A citizen pre-ingestion layer in front of a future authorised CFCFRMS / I4C workflow (not a government system, emblem or title).'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="border border-line rounded-xl p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wide text-success">
                  {hi ? 'कार्यशील' : 'Works now'}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed mt-2">
                {hi ? 'क्लाइंट-साइड सत्यापन, साक्ष्य बंडल, UTR चेक, शिकायत तैयारी।' : 'Client-side verification, evidence bundle, UTR checks, complaint preparation.'}
              </p>
            </div>

            <div className="border border-line rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-ink shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wide text-ink">
                  {hi ? 'सिम्युलेटेड' : 'Simulated'}
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
            <button type="button" className="btn-primary !h-10 !px-8 !text-xs !font-bold !rounded-full cursor-pointer" onClick={handleSmoothClose}>
              {hi ? 'समझ गया' : 'Got it'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
