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
    <footer className="site-footer no-print border-t border-[#e5e7eb] mt-12 bg-white">
      <div className="page-wrap py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#6b7280]">
        <div className="text-center md:text-left">
           <strong className="text-[#111827]">{hi ? 'प्रोटोटाइप' : 'Prototype'}</strong> — {hi ? 'सिमुलेटेड · आधिकारिक सरकारी वेबसाइट नहीं' : 'Simulated · Not an official government website'}
        </div>
        <div className="flex items-center gap-6">
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
