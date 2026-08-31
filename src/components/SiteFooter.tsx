import React from 'react';
import type { Language } from '../types';

interface SiteFooterProps {
  currentLang: Language;
  onResetToHome: () => void;
  onOpenMockedHub: () => void;
  onOpenQuiz: () => void;
  onOpenTips?: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  currentLang,
  onResetToHome,
  onOpenMockedHub,
  onOpenQuiz,
  onOpenTips,
}) => {
  const hi = currentLang === 'hi';

  return (
    <footer className="site-footer no-print w-full max-w-full overflow-hidden border-t border-line bg-card/85 dark:bg-card/95 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-3.5 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-1.5 text-xs text-muted overflow-hidden">
        <button
          type="button"
          onClick={onResetToHome}
          className="footer-link"
        >
          {hi ? 'नई रिपोर्ट' : 'New report'}
        </button>

        <span className="text-line-strong select-none" aria-hidden="true">•</span>

        <button
          type="button"
          onClick={onOpenMockedHub}
          className="footer-link"
        >
          {hi ? 'क्या मॉक है' : "What's mocked"}
        </button>

        <span className="text-line-strong select-none" aria-hidden="true">•</span>

        <button
          type="button"
          onClick={onOpenQuiz}
          className="footer-link"
        >
          {hi ? 'साइबर सुरक्षा सीखें' : 'Learn cyber safety'}
        </button>

        {onOpenTips && (
          <>
            <span className="text-line-strong select-none" aria-hidden="true">•</span>
            <button
              type="button"
              onClick={onOpenTips}
              className="footer-link"
            >
              {hi ? 'साक्ष्य व सुझाव' : 'Evidence & tips'}
            </button>
          </>
        )}
      </div>
    </footer>
  );
};
