import React from 'react';
import { PhoneCall } from 'lucide-react';
import type { AppStep, Language } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentLang: Language;
  currentStep: AppStep;
  furthestStep: number;
  onGoToStep: (step: AppStep) => void;
  onToggleLang: (lang: Language) => void;
  onGoHome: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  onTrack: () => void;
  canTrack: boolean;
  onHub: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  currentStep,
  furthestStep,
  onGoToStep,
  onToggleLang,
  onGoHome,
  theme,
  onToggleTheme,
  onLogout,
  onTrack,
  canTrack,
  onHub,
}) => {
  const hi = currentLang === 'hi';
  const steps: { id: AppStep; en: string; hi: string; hintEn: string; hintHi: string }[] = [
    { id: 'intake', en: 'Report', hi: 'शिकायत', hintEn: '1. Report', hintHi: '1. शिकायत' },
    { id: 'review', en: 'Check', hi: 'जाँच', hintEn: '2. Check', hintHi: '2. जाँच' },
    { id: 'freeze', en: 'Preview', hi: 'डेमो', hintEn: '3. Preview', hintHi: '3. डेमो' },
    { id: 'radar', en: 'Track', hi: 'ट्रैक', hintEn: '4. Track this complaint', hintHi: '4. यह शिकायत ट्रैक करें' },
  ];
  const currentIndex = onHub
    ? -1
    : currentStep === 'petition'
      ? steps.length - 1
      : steps.findIndex((s) => s.id === currentStep);

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="page-wrap topbar">
        <button type="button" onClick={onGoHome} className="topbar-brand">
          Kavach
        </button>

        <nav className="topbar-steps" aria-label="Progress">
          {steps.map((step, idx) => {
            const locked = step.id === 'radar' ? !canTrack && idx > furthestStep : idx > furthestStep;
            const cls =
              idx === currentIndex ? 'is-current' : idx < currentIndex ? 'is-done' : '';
            return (
              <button
                key={step.id}
                type="button"
                className={cls}
                disabled={step.id === 'radar' ? !canTrack : locked}
                title={hi ? step.hintHi : step.hintEn}
                onClick={() => {
                  if (step.id === 'radar') onTrack();
                  else onGoToStep(step.id);
                }}
              >
                {hi ? step.hi : step.en}
              </button>
            );
          })}
        </nav>

        <div className="topbar-actions">
          <a
            href="tel:1930"
            className="helpline"
            title={hi ? '1930 पर कॉल करें' : 'Call 1930'}
            aria-label={hi ? '1930 हेल्पलाइन' : '1930 Helpline'}
          >
            <PhoneCall size={12} strokeWidth={2.25} />
            <span>1930</span>
            <span className="hidden sm:inline">{hi ? 'हेल्पलाइन' : 'Helpline'}</span>
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
          <button type="button" onClick={onLogout} className="topbar-logout">
            {hi ? 'साइन आउट' : 'Sign out'}
          </button>
        </div>
      </div>
    </header>
  );
};
