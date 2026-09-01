import React, { useState } from 'react';
import type { Language } from '../types';
import { ThemeToggle } from './ThemeToggle';
import loginHero from '../assets/login-hero-v2.png';

interface LoginScreenProps {
  currentLang: Language;
  onToggleLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogin: (phone: string) => void;
  onOpenQuiz: () => void;
}

const DEMO_PHONE = '9876543210';
const DEMO_OTP = '123456';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  currentLang,
  onToggleLang,
  theme,
  onToggleTheme,
  onLogin,
  onOpenQuiz,
}) => {
  const hi = currentLang === 'hi';
  const [phone, setPhone] = useState(DEMO_PHONE);
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '').slice(-10);
    if (digits.length !== 10) {
      setError(hi ? '10 अंकों का मोबाइल नंबर लिखें।' : 'Enter a 10-digit mobile number.');
      return;
    }
    setError('');
    setStage('otp');
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim() !== DEMO_OTP) {
      setError(hi ? 'इस प्रोटोटाइप के लिए OTP 123456 है।' : 'For this prototype the OTP is 123456.');
      return;
    }
    onLogin(phone.replace(/\D/g, '').slice(-10));
  };

  return (
    <div className="login-screen page-enter">
      <div className="login-shell">
        <figure className="login-visual">
          <img
            src={loginHero}
            alt={hi ? 'सुबह की रोशनी से भरा शांत घर का प्रवेश द्वार' : 'A calm home entryway filled with morning light'}
            loading="eager"
            decoding="async"
          />
          <div className="login-utility-controls" role="group" aria-label={hi ? 'भाषा और थीम' : 'Language and theme'}>
            <div className="lang-switch">
              <button
                type="button"
                className={currentLang === 'en' ? 'is-active' : ''}
                onClick={() => onToggleLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={currentLang === 'hi' ? 'is-active' : ''}
                onClick={() => onToggleLang('hi')}
              >
                हिन्दी
              </button>
            </div>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
          <figcaption className="login-visual-copy">
            <p className="wordmark">Kavach</p>
            <h2>{hi ? 'हम आपके साथ हैं।' : 'We’ve got you.'}</h2>
            <p>
              {hi
                ? 'यहीं से शुरुआत करें। पैसे जाने पर पहले 1930 पर कॉल करें।'
                : 'Start here. If money just left your account, call 1930 first.'}
            </p>
          </figcaption>
        </figure>
      <div className="login-card">
        <p className="eyebrow">{hi ? 'सिमुलेटेड लॉगिन' : 'Simulated sign-in'}</p>
        <h1 className="text-3xl font-semibold">
          {hi ? 'साइबर अपराध रिपोर्ट करें' : 'Report a cybercrime'}
        </h1>
        <p className="mt-3 text-muted">
          {hi
            ? 'फ्रीज या टेकडाउन नोटिस का डेमो देखें। कोई असली OTP नहीं जाता।'
            : 'Preview a freeze or takedown notice. No real OTP is sent.'}
        </p>

        {stage === 'phone' ? (
          <form onSubmit={sendOtp} className="mt-8">
            <label className="field-label" htmlFor="phone">
              {hi ? 'मोबाइल नंबर' : 'Mobile number'}
            </label>
            <input
              id="phone"
              className="input-field"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {error && <p className="mt-3 text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}
            <button type="submit" className="btn-primary w-full mt-6">
              {hi ? 'OTP भेजें' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="mt-8">
            <label className="field-label" htmlFor="otp">
              {hi ? 'OTP' : 'OTP'}
            </label>
            <input
              id="otp"
              className="input-field"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
            />
            <p className="mt-2 text-sm text-muted">
              {hi ? 'प्रोटोटाइप OTP: ' : 'Prototype OTP: '}
              <span className="font-mono font-semibold text-ink">{DEMO_OTP}</span>
            </p>
            {error && <p className="mt-3 text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}
            <button type="submit" className="btn-primary w-full mt-6">
              {hi ? 'जारी रखें' : 'Continue'}
            </button>
            <p className="mt-4 text-center">
              <button type="button" className="btn-link" onClick={() => { setStage('phone'); setError(''); }}>
                {hi ? 'नंबर बदलें' : 'Change number'}
              </button>
            </p>
          </form>
        )}

        <button
          type="button"
          className="btn-secondary w-full mt-3"
          onClick={() => onLogin(DEMO_PHONE)}
        >
          {hi ? 'समीक्षक के रूप में जारी रखें' : 'Continue as reviewer'}
        </button>

        <button type="button" className="btn-secondary w-full mt-3" onClick={onOpenQuiz}>
          {hi ? 'साइबर सुरक्षा क्विज़' : 'Learn with the cyber-safety quiz'}
        </button>

        <p className="mt-6 text-xs text-subtle leading-relaxed">
          {hi
            ? 'यह भारत सरकार की आधिकारिक सेवा नहीं है। Build What Moves India हेतु नागरिक प्रोटोटाइप।'
            : 'Not an official government service. A citizen prototype for Build What Moves India.'}
        </p>
      </div>
      </div>
    </div>
  );
};
