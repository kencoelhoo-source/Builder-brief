import React from 'react';
import type { AppStep, Language } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentLang: Language;
  currentStep: AppStep;
  onToggleLang: (lang: Language) => void;
  onOpenMockedHub: () => void;
  onResetToHome: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  currentStep,
  onToggleLang,
  onOpenMockedHub,
  onResetToHome,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const hi = currentLang === 'hi';
  const steps: { id: AppStep; en: string; hi: string }[] = [
    { id: 'intake', en: 'Report', hi: 'शिकायत' },
    { id: 'review', en: 'Check', hi: 'जाँच' },
    { id: 'freeze', en: 'Act', hi: 'कार्रवाई' },
    { id: 'radar', en: 'Track', hi: 'स्थिति' },
  ];
  const currentIndex =
    currentStep === 'petition'
      ? steps.length - 1
      : steps.findIndex((s) => s.id === currentStep);

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="page-wrap topbar">
        <button
          type="button"
          onClick={onResetToHome}
          className="topbar-brand"
        >
          Kavach Omni
        </button>

        <nav className="topbar-steps" aria-label="Progress">
          {steps.map((step, idx) => (
            <span
              key={step.id}
              className={idx === currentIndex ? 'is-current' : idx < currentIndex ? 'is-done' : ''}
            >
              {hi ? step.hi : step.en}
            </span>
          ))}
        </nav>

        <div className="topbar-actions">
          <a href="tel:1930" className="helpline">1930</a>
          <div className="lang-switch">
            <button type="button" className={currentLang === 'en' ? 'is-active' : ''} onClick={() => onToggleLang('en')}>
              EN
            </button>
            <button type="button" className={currentLang === 'hi' ? 'is-active' : ''} onClick={() => onToggleLang('hi')}>
              हिन्दी
            </button>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button type="button" onClick={onOpenMockedHub} className="topbar-text">
            {hi ? 'मॉक' : 'Mocked'}
          </button>
          <button type="button" onClick={onLogout} className="topbar-text">
            {hi ? 'बाहर' : 'Sign out'}
          </button>
        </div>
      </div>
    </header>
  );
};
