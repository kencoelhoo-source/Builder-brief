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
    <footer className="site-footer no-print">
      <div className="page-wrap py-6 grid grid-cols-2 md:flex md:flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted">
        <button
          type="button"
          onClick={onResetToHome}
          className="btn-link inline-flex items-center gap-2 font-medium w-fit text-left"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-ink dark:bg-white shrink-0 shadow-xs" aria-hidden="true" />
          <span>{hi ? 'नई रिपोर्ट' : 'New report'}</span>
        </button>
        <button
          type="button"
          onClick={onOpenMockedHub}
          className="btn-link inline-flex items-center gap-2 font-medium w-fit text-left"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-ink dark:bg-white shrink-0 shadow-xs" aria-hidden="true" />
          <span>{hi ? 'क्या मॉक है' : "What's mocked"}</span>
        </button>
        <button
          type="button"
          onClick={onOpenQuiz}
          className="btn-link inline-flex items-center gap-2 font-medium w-fit text-left"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-ink dark:bg-white shrink-0 shadow-xs" aria-hidden="true" />
          <span>{hi ? 'साइबर सुरक्षा सीखें' : 'Learn cyber safety'}</span>
        </button>
        {onOpenTips && (
          <button
            type="button"
            onClick={onOpenTips}
            className="btn-link inline-flex items-center gap-2 font-medium w-fit text-left"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ink dark:bg-white shrink-0 shadow-xs" aria-hidden="true" />
            <span>{hi ? 'साक्ष्य व रिपोर्टिंग सुझाव' : 'Evidence & reporting tips'}</span>
          </button>
        )}
      </div>
    </footer>
  );
};
