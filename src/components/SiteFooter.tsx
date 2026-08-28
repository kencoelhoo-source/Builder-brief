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
    <footer className="site-footer no-print border-t border-line mt-12 bg-canvas">
      <div className="page-wrap py-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3.5 text-xs text-muted">
        <div className="text-left leading-relaxed">
          <strong className="text-ink">{hi ? 'प्रोटोटाइप' : 'Prototype'}</strong> — {hi ? 'सिमुलेटेड · आधिकारिक सरकारी वेबसाइट नहीं' : 'Simulated · Not an official government website'}
        </div>
        <div className="flex items-center gap-5 mt-1 sm:mt-0">
          <button type="button" onClick={onResetToHome} className="btn-link">
            {hi ? 'नई रिपोर्ट' : 'New report'}
          </button>
          <button type="button" onClick={onOpenMockedHub} className="btn-link">
            {hi ? 'क्या मॉक है' : "What's mocked"}
          </button>
        </div>
      </div>
    </footer>
  );
};
