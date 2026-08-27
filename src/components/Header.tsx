import React from 'react';
import type { AppStep, Language } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentLang: Language;
  currentStep: AppStep;
  furthestStep: number;
  onGoToStep: (step: AppStep) => void;
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
  furthestStep,
  onGoToStep,
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
        <button type="button" onClick={onResetToHome} className="topbar-brand">
          Kavach Omni
        </button>

        <nav className="topbar-steps" aria-label="Progress">
          {steps.map((step, idx) => {
            const locked = idx > furthestStep;
            const cls =
              idx === currentIndex ? 'is-current' : idx < currentIndex ? 'is-done' : '';
            return (
              <button
                key={step.id}
                type="button"
                className={cls}
                disabled={locked}
                onClick={() => onGoToStep(step.id)}
              >
                {hi ? step.hi : step.en}
              </button>
            );
          })}
        </nav>

        <span className="topbar-now">
          {hi ? steps[currentIndex]?.hi : steps[currentIndex]?.en}
        </span>

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
          <button type="button" onClick={onLogout} className="topbar-text">
            {hi ? 'बाहर' : 'Out'}
          </button>
        </div>
      </div>
    </header>
  );
};
