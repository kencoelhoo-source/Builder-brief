import React from 'react';
import type { Language } from '../types';

interface SiteFooterProps {
  currentLang: Language;
  onResetToHome: () => void;
  onOpenMockedHub: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  currentLang,
  onResetToHome,
  onOpenMockedHub,
}) => {
  const hi = currentLang === 'hi';

  return (
    <>
      <footer className="site-footer no-print">
        <div className="page-wrap py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="wordmark">Kavach Omni</p>
            <p className="text-sm mt-2 max-w-sm" style={{ color: 'inherit', opacity: 0.85 }}>
              {hi
                ? 'Build What Moves India के लिए नागरिक प्रोटोटाइप। लाइव बैंक या पुलिस सिस्टम से जुड़ा नहीं है।'
                : 'A citizen prototype for Build What Moves India. It does not connect to live banks or police systems.'}
            </p>
          </div>
          <div>
            <p className="font-bold mb-3">{hi ? 'इस सेवा पर' : 'On this service'}</p>
            <div className="flex flex-col gap-2 items-start">
              <button type="button" onClick={onResetToHome} className="btn-link">
                {hi ? 'नई शिकायत' : 'Start a new report'}
              </button>
              <button type="button" onClick={onOpenMockedHub} className="btn-link">
                {hi ? 'क्या मॉक है' : 'What is mocked'}
              </button>
            </div>
          </div>
          <div>
            <p className="font-bold mb-3">{hi ? 'आपात स्थिति' : 'If this is happening now'}</p>
            <a href="tel:1930" className="helpline">
              1930
              <small>{hi ? 'हेल्पलाइन' : 'Helpline'}</small>
            </a>
            <p className="text-sm mt-3" style={{ opacity: 0.85 }}>
              {hi
                ? 'वास्तविक आपात में 1930 पर कॉल करें।'
                : 'In a real emergency call 1930 or use cybercrime.gov.in.'}
            </p>
          </div>
        </div>
        <div className="page-wrap py-4 text-sm" style={{ borderTop: '1px solid var(--line)', opacity: 0.8 }}>
          Kavach Omni · 2026 · {hi ? 'कोई सरकारी साझेदारी नहीं' : 'No official partnership implied'}
        </div>
      </footer>

      <div className="mobile-helpline md:hidden no-print">
        <div className="page-wrap py-3 flex items-center justify-between">
          <button type="button" onClick={onResetToHome} className="btn-link text-sm">
            {hi ? 'नई शिकायत' : 'New report'}
          </button>
          <a href="tel:1930" className="helpline">1930</a>
        </div>
      </div>
    </>
  );
};
