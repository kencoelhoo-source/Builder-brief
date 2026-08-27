import React from 'react';
import type { Language } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentLang: Language;
  onToggleLang: (lang: Language) => void;
  onOpenMockedHub: () => void;
  onResetToHome: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onToggleLang,
  onOpenMockedHub,
  onResetToHome,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const hi = currentLang === 'hi';

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="phase-banner">
        <div className="page-wrap py-2 flex flex-wrap items-center justify-between gap-2">
          <p>
            <span className="phase-tag">{hi ? 'प्रोटोटाइप' : 'Prototype'}</span>
            {hi ? 'सिमुलेटेड · आधिकारिक सरकारी साइट नहीं' : 'Simulated · not an official government website'}
          </p>
          <button type="button" onClick={onOpenMockedHub} className="btn-link" style={{ fontSize: 12 }}>
            {hi ? 'क्या मॉक है' : 'What’s mocked'}
          </button>
        </div>
      </div>
      <div className="page-wrap masthead">
        <button
          type="button"
          onClick={onResetToHome}
          className="text-left bg-transparent border-0 cursor-pointer p-0"
        >
          <span className="wordmark">Kavach Omni</span>
          <span className="wordmark-sub">
            {hi ? 'साइबर अपराध रिपोर्ट' : 'Cybercrime report'}
          </span>
        </button>
        <div className="header-actions">
          <a href="tel:1930" className="helpline">
            1930 <small>{hi ? 'हेल्पलाइन' : 'Helpline'}</small>
          </a>
          <div className="lang-switch">
            <button type="button" className={currentLang === 'en' ? 'is-active' : ''} onClick={() => onToggleLang('en')}>
              EN
            </button>
            <button type="button" className={currentLang === 'hi' ? 'is-active' : ''} onClick={() => onToggleLang('hi')}>
              हिन्दी
            </button>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button type="button" onClick={onLogout} className="btn-link" style={{ fontSize: 13 }}>
            {hi ? 'बाहर' : 'Sign out'}
          </button>
        </div>
      </div>
    </header>
  );
};
