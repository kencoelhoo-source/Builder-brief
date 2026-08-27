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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-card w-full max-w-2xl max-h-[92vh] flex flex-col border border-line">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-line">
          <div>
            <h2 className="text-xl font-bold">
              {hi ? 'क्या मॉक है' : 'What is mocked'}
            </h2>
            <p className="text-muted mt-1">
              {hi
                ? 'समीक्षकों के लिए: इस प्रोटोटाइप में क्या चलता है, क्या नहीं।'
                : 'For reviewers: what this prototype actually does.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn-icon"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-6 text-[15px] leading-relaxed">
          <div className="notice notice-urgent">
            <p className="font-bold">
              {hi ? 'यह सरकारी उत्पाद नहीं है' : 'This is not a government product'}
            </p>
            <p className="mt-1 text-muted">
              {hi
                ? 'Build What Moves India हैकथॉन का स्वतंत्र नागरिक प्रोटोटाइप। लाइव पुलिस या बैंक सिस्टम से जुड़ा नहीं। सरकारी लोगो का उपयोग नहीं।'
                : 'An independent citizen prototype for the Build What Moves India hackathon. It does not talk to live police or bank systems, and it does not use official logos.'}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">{hi ? 'सिमुलेटेड' : 'Simulated'}</h3>
            <ul className="mt-2 space-y-1 text-muted list-disc pl-5">
              <li>Bank nodal APIs and lien locking</li>
              <li>1930 as a real number — this app does not place the call</li>
              <li>Synthetic personas only</li>
              <li>Session data in the browser, cleared on reset</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg">{hi ? 'इस बिल्ड में काम करता है' : 'Working in this build'}</h3>
            <ul className="mt-2 space-y-1 text-muted list-disc pl-5">
              <li>Full citizen journey, financial or social</li>
              <li>CFCFRMS-shaped freeze payload</li>
              <li>Section 79 takedown notice and 36-hour window</li>
              <li>Printable FIR and court petition from the case data</li>
              <li>Voice input in Hindi and English</li>
            </ul>
          </div>
        </div>

        <div className="p-5 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted text-center sm:text-left">Kavach Omni · hackathon build</span>
          <div className="btn-group sm:ml-auto w-full sm:w-auto">
            <button type="button" onClick={onClose} className="btn-primary">
              {hi ? 'ठीक है' : 'Back to the service'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
