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
    <footer className="site-footer no-print">
      <div className="page-wrap footer-row">
        <button type="button" onClick={onResetToHome} className="btn-link">
          {hi ? 'नई रिपोर्ट' : 'New report'}
        </button>
        <button type="button" onClick={onOpenMockedHub} className="btn-link">
          {hi ? 'क्या मॉक है' : "What's mocked"}
        </button>
      </div>
    </footer>
  );
};
