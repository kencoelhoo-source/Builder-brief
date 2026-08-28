import React from 'react';
import type { Language } from '../types';

interface SiteFooterProps {
  currentLang: Language;
  onResetToHome: () => void;
  onOpenMockedHub: () => void;
  onOpenQuiz: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  currentLang,
  onResetToHome,
  onOpenMockedHub,
  onOpenQuiz,
}) => {
  const hi = currentLang === 'hi';

  return (
    <footer className="site-footer no-print">
      <div className="page-wrap py-6 flex flex-wrap items-center gap-5 text-xs text-muted">
        <button type="button" onClick={onResetToHome} className="btn-link">
          {hi ? 'नई रिपोर्ट' : 'New report'}
        </button>
        <button type="button" onClick={onOpenMockedHub} className="btn-link">
          {hi ? 'क्या मॉक है' : "What's mocked"}
        </button>
        <button type="button" onClick={onOpenQuiz} className="btn-link">
          {hi ? 'साइबर सुरक्षा सीखें' : 'Learn cyber safety'}
        </button>
      </div>
    </footer>
  );
};
