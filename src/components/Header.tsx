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
  onResetToHome,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const hi = currentLang === 'hi';
  const steps: { id: AppStep; en: string; hi: string; hintEn: string; hintHi: string }[] = [
    { id: 'intake', en: 'Report', hi: 'शिकायत', hintEn: '1. Report: Submit screenshot, voice or UTR', hintHi: '1. शिकायत: स्क्रीनशॉट, आवाज़ या UTR दर्ज करें' },
    { id: 'review', en: 'Check', hi: 'जाँच', hintEn: '2. Check: Verify extracted incident data', hintHi: '2. जाँच: निकाले गए विवरण की पुष्टि करें' },
    { id: 'freeze', en: 'Act', hi: 'कार्रवाई', hintEn: '3. Act: Send statutory freeze directive to banks', hintHi: '3. कार्रवाई: बैंकों को कानूनी फ्रीज नोटिस भेजें' },
    { id: 'radar', en: 'Track', hi: 'स्थिति', hintEn: '4. Track: Monitor intercepted funds & court petition', hintHi: '4. स्थिति: रोकी गई राशि देखें व न्यायालय याचिका डाउनलोड करें' },
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
                title={hi ? step.hintHi : step.hintEn}
                onClick={() => onGoToStep(step.id)}
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
            title={hi ? "1930 राष्ट्रीय साइबर वित्तीय धोखाधड़ी हेल्पलाइन (कॉल करने के लिए टैप करें)" : "1930 National Cyber Financial Fraud Emergency Helpline (Tap to call)"}
            aria-label={hi ? "1930 राष्ट्रीय हेल्पलाइन" : "1930 National Helpline"}
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
          <button type="button" onClick={onLogout} className="topbar-text">
            {hi ? 'बाहर' : 'Out'}
          </button>
        </div>
      </div>
    </header>
  );
};
