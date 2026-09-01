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
    <footer className="site-footer no-print w-full border-t border-line bg-card">
      <div className="max-w-4xl mx-auto px-3 py-2 sm:py-2.5 pr-14 sm:pr-4 flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4 gap-y-1 text-[11px] sm:text-xs text-muted">
        <button
          type="button"
          onClick={onResetToHome}
          className="footer-link hover:text-ink transition-colors"
        >
          {hi ? 'नई रिपोर्ट' : 'New report'}
        </button>

        <span className="text-line select-none" aria-hidden="true">•</span>

        <button
          type="button"
          onClick={onOpenMockedHub}
          className="footer-link hover:text-ink transition-colors"
        >
          {hi ? 'मॉक विवरण' : "What's mocked"}
        </button>

        <span className="text-line select-none" aria-hidden="true">•</span>

        <button
          type="button"
          onClick={onOpenQuiz}
          className="footer-link hover:text-ink transition-colors"
        >
          {hi ? 'सुरक्षा क्विज़' : 'Safety quiz'}
        </button>

        {onOpenTips && (
          <>
            <span className="text-line select-none" aria-hidden="true">•</span>
            <button
              type="button"
              onClick={onOpenTips}
              className="footer-link hover:text-ink transition-colors"
            >
              {hi ? 'सुझाव' : 'Tips'}
            </button>
          </>
        )}
      </div>
    </footer>
  );
};
