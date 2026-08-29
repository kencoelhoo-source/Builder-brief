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
    <footer className="site-footer no-print w-full max-w-full overflow-hidden border-t border-line/60 bg-card/60 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-3.5 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-1.5 text-xs text-muted overflow-hidden">
        <button
          type="button"
          onClick={onResetToHome}
          className="hover:text-ink transition-colors font-medium cursor-pointer"
        >
          {hi ? 'नई रिपोर्ट' : 'New report'}
        </button>

        <span className="text-line-strong select-none" aria-hidden="true">•</span>

        <button
          type="button"
          onClick={onOpenMockedHub}
          className="hover:text-ink transition-colors font-medium cursor-pointer"
        >
          {hi ? 'क्या मॉक है' : "What's mocked"}
        </button>

        <span className="text-line-strong select-none" aria-hidden="true">•</span>

        <button
          type="button"
          onClick={onOpenQuiz}
          className="hover:text-ink transition-colors font-medium cursor-pointer"
        >
          {hi ? 'साइबर सुरक्षा सीखें' : 'Learn cyber safety'}
        </button>

        {onOpenTips && (
          <>
            <span className="text-line-strong select-none" aria-hidden="true">•</span>
            <button
              type="button"
              onClick={onOpenTips}
              className="hover:text-ink transition-colors font-medium cursor-pointer"
            >
              {hi ? 'साक्ष्य व सुझाव' : 'Evidence & tips'}
            </button>
          </>
        )}
      </div>
    </footer>
  );
};
