import React from 'react';
import { X } from 'lucide-react';
import type { Language } from '../types';

interface MockedTransparencyHubProps {
  currentLang: Language;
  onClose: () => void;
}

export const MockedTransparencyHub: React.FC<MockedTransparencyHubProps> = ({
  currentLang,
  onClose,
}) => {
  const hi = currentLang === 'hi';
  const [isClosing, setIsClosing] = React.useState(false);

  const handleSmoothClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(onClose, 150);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain ${
        isClosing ? 'modal-backdrop-exit' : 'modal-backdrop-enter'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleSmoothClose();
      }}
    >
      <div
        className={`bg-card w-full max-w-2xl max-h-[92vh] flex flex-col border border-line-strong rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden overscroll-contain ${
          isClosing ? 'modal-content-exit' : 'modal-content-enter'
        }`}
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-line bg-soft/40">
          <div>
            <h2 className="text-xl font-bold text-ink">
              {hi ? 'क्या मॉक है' : 'What is mocked'}
            </h2>
            <p className="text-muted text-xs sm:text-sm mt-1">
              {hi
                ? 'समीक्षकों के लिए: इस प्रोटोटाइप में क्या चलता है, क्या नहीं।'
                : 'For reviewers: what this prototype actually does.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSmoothClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-soft hover:bg-line border border-line flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-3.5 sm:gap-4 text-ink">
          <div className="rounded-2xl p-4 sm:p-5 border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
            <p className="font-bold text-sm sm:text-base text-ink">
              {hi ? 'यह सरकारी उत्पाद नहीं है' : 'This is not a government product'}
            </p>
            <p className="mt-1 text-muted text-xs sm:text-sm leading-relaxed">
              {hi
                ? 'Build What Moves India हैकथॉन का स्वतंत्र नागरिक प्रोटोटाइप। यह अधिकृत CFCFRMS / I4C प्रक्रिया से पहले सबूत व्यवस्थित करने वाली लेयर है; लाइव पुलिस या बैंक सिस्टम से जुड़ा नहीं है। सरकारी लोगो का उपयोग नहीं।'
                : 'An independent citizen prototype for the Build What Moves India hackathon. Kavach is a pre-ingestion layer for organising evidence before an authorised CFCFRMS / I4C workflow; it does not talk to live police or bank systems, and it does not use official logos.'}
            </p>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 border border-line bg-soft/30">
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-ink mb-2">
              {hi ? 'सिमुलेटेड' : 'Simulated'}
            </h3>
            <ul className="space-y-1.5 text-muted text-xs sm:text-sm list-disc pl-5">
              <li>{hi ? 'बैंक नोडल API और लियन लॉकिंग' : 'Bank nodal APIs and lien locking'}</li>
              <li>{hi ? '1930 एक वास्तविक नंबर है (यह ऐप कॉल नहीं करता)' : '1930 is a real number (this app does not place the call)'}</li>
              <li>{hi ? 'सिर्फ सिंथेटिक / मॉक व्यक्ति' : 'Synthetic personas only'}</li>
              <li>{hi ? 'ब्राउज़र में सेशन डेटा, रीसेट पर साफ' : 'Session data in the browser, cleared on reset'}</li>
            </ul>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 border border-line bg-soft/30">
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-ink mb-2">
              {hi ? 'इस बिल्ड में काम करता है' : 'Working in this build'}
            </h3>
            <ul className="space-y-1.5 text-muted text-xs sm:text-sm list-disc pl-5">
              <li>{hi ? 'वित्तीय या सोशल शिकायत का पूरा नागरिक सफ़र' : 'Full citizen journey, financial or social'}</li>
              <li>{hi ? 'CFCFRMS-जैसा डेमो फ्रीज पेलोड' : 'CFCFRMS-shaped freeze payload'}</li>
              <li>{hi ? 'सेक्शन 79 टेकडाउन नोटिस और 36 घंटे की विंडो' : 'Section 79 takedown notice and 36-hour window'}</li>
              <li>{hi ? 'केस डेटा से प्रिंटेबल FIR और कोर्ट याचिका ड्राफ्ट' : 'Printable FIR and court petition from the case data'}</li>
              <li>{hi ? 'हिंदी और अंग्रेज़ी में वॉइस इनपुट' : 'Voice input in Hindi and English'}</li>
            </ul>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 border border-line bg-soft/30">
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-ink mb-2">
              {hi ? 'प्रोडक्शन के लिए क्या चाहिए' : 'What production would need'}
            </h3>
            <p className="text-muted text-xs sm:text-sm leading-relaxed">
              {hi
                ? 'MHA, बैंकों और अधिकृत पुलिस / प्लेटफ़ॉर्म सिस्टम के साथ स्वीकृत इंटीग्रेशन, सुरक्षा समीक्षा और स्पष्ट जवाबदेही। यह बिल्ड इनमें से कोई लाइव कनेक्शन होने का दावा नहीं करता।'
                : 'MHA, banks and authorised police / platform systems would need approved integrations, security review and clear accountability. This build does not claim any live connection to them.'}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-line bg-soft/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted text-center sm:text-left">Kavach · hackathon build</span>
          <div className="btn-group sm:ml-auto w-full sm:w-auto">
            <button type="button" onClick={handleSmoothClose} className="btn-primary !h-10 !px-8 !text-xs !font-bold !rounded-full w-full sm:w-auto cursor-pointer">
              {hi ? 'ठीक है' : 'Back to the service'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
