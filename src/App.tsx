import React, { useState, useEffect } from 'react';
import {
  Header,
} from './components/Header';
import { StepTracker } from './components/StepTracker';
import { EmergencyIntake } from './components/EmergencyIntake';
import { ExtractedDetailsCard } from './components/ExtractedDetailsCard';
import { DualBankFreezeCard } from './components/DualBankFreezeCard';
import { FundTrailRadar } from './components/FundTrailRadar';
import { CourtPetitionModal } from './components/CourtPetitionModal';
import { OfficialReceipt } from './components/OfficialReceipt';
import { MockedTransparencyHub } from './components/MockedTransparencyHub';
import { SocialVerificationCard } from './components/SocialVerificationCard';
import { TakedownDispatchCard } from './components/TakedownDispatchCard';
import { EscalationTracker } from './components/EscalationTracker';
import { FIRDraftModal } from './components/FIRDraftModal';
import { SiteFooter } from './components/SiteFooter';
import { LoginScreen } from './components/LoginScreen';
import type { AppStep, Language, CyberIncident, FinancialIncident, SocialIncident, CFCFRMSPayload, Sec79Payload } from './types';
import { parseScreenshotOCR, parseVoiceTranscription } from './services/ocrService';
import {
  saveDraftToStorage,
  getDraftFromStorage,
  saveLanguagePreference,
  getLanguagePreference,
  clearDraftFromStorage,
} from './services/storageService';


type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  try {
    const saved = localStorage.getItem('kavach_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* ignore */
  }
  return 'light';
};

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(getLanguagePreference());
  const [currentStep, setCurrentStep] = useState<AppStep>('intake');
  const [transaction, setTransaction] = useState<CyberIncident | null>(null);
  const [payload, setPayload] = useState<CFCFRMSPayload | null>(null);
  const [sec79Payload, setSec79Payload] = useState<Sec79Payload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const [showPetitionModal, setShowPetitionModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showFIRModal, setShowFIRModal] = useState<boolean>(false);
  const [showMockedHub, setShowMockedHub] = useState<boolean>(false);
  const [sessionPhone, setSessionPhone] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('kavach_session');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('kavach_theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  useEffect(() => {
    const saved = getDraftFromStorage();
    if (saved && saved.transaction) {
      setTransaction(saved.transaction);
      if (saved.payload) {
        if (saved.transaction.incidentType === 'FINANCIAL' && 'cfcfrmsToken' in saved.payload) {
          setPayload(saved.payload);
        } else if (saved.transaction.incidentType === 'SOCIAL' && 'takedownToken' in saved.payload) {
          setSec79Payload(saved.payload);
        }
        setCurrentStep('radar');
      } else {
        setCurrentStep('review');
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleLang = (lang: Language) => {
    setCurrentLang(lang);
    saveLanguagePreference(lang);
    triggerToast(lang === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है' : 'Language set to English');
  };

  const handleSelectPreset = async (personaId: string) => {
    setIsLoading(true);
    try {
      const extracted = await parseScreenshotOCR(personaId);
      setTransaction(extracted);
      saveDraftToStorage(extracted, null);
      setCurrentStep('review');
      triggerToast(currentLang === 'hi' ? 'AI ने ट्रांसक्शन विवरण निकाल लिया है' : 'Vision AI parsed screenshot details');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    setIsLoading(true);
    try {
      const extracted = await parseScreenshotOCR(file);
      setTransaction(extracted);
      saveDraftToStorage(extracted, null);
      setCurrentStep('review');
      triggerToast(currentLang === 'hi' ? 'स्क्रीनशॉट स्कैन पूर्ण' : 'Screenshot OCR extraction complete');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscribe = async (transcript: string) => {
    setIsLoading(true);
    try {
      const extracted = await parseVoiceTranscription(transcript);
      setTransaction(extracted);
      saveDraftToStorage(extracted, null);
      setCurrentStep('review');
      triggerToast(currentLang === 'hi' ? 'आवाज़ से विवरण दर्ज हुआ' : 'Voice input processed');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (utr: string, amount: number) => {
    const manualTxn: FinancialIncident = {
      incidentType: 'FINANCIAL',
      utr,
      amount,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      remitterBank: 'HDFC Bank Ltd.',
      remitterAccount: 'XXXX-XXXX-4012',
      beneficiaryVpa: 'fraudster.target@okaxis',
      beneficiaryBank: 'Axis Bank Ltd.',
      fraudCategory: 'UPI_PHISHING',
      fraudCategoryLabel: 'Manually Entered UTR Report',
      incidentSummary: `Unauthorized transaction reported with UTR ${utr}.`,
      victimName: 'Citizen (Demo User)',
      victimMobile: '+91-98765-43210',
      confidenceScore: 100,
      extractedVia: 'MANUAL',
    };
    setTransaction(manualTxn);
    saveDraftToStorage(manualTxn, null);
    setCurrentStep('review');
  };

  const handleProceedToAction = (updatedTxn: CyberIncident) => {
    setTransaction(updatedTxn);
    saveDraftToStorage(updatedTxn, null);
    setCurrentStep('freeze');
    triggerToast(currentLang === 'hi' ? 'कार्रवाई योजना तैयार' : 'Action Plan Ready');
  };

  const handleDispatchComplete = (generatedPayload: CFCFRMSPayload | Sec79Payload) => {
    if ('cfcfrmsToken' in generatedPayload) {
      setPayload(generatedPayload as CFCFRMSPayload);
      triggerToast(currentLang === 'hi' ? 'बैंकों को फ्रीज आदेश भेजा गया!' : 'Statutory Freeze Notice Dispatched to Banks!');
    } else {
      setSec79Payload(generatedPayload as Sec79Payload);
      triggerToast(currentLang === 'hi' ? 'टेकडाउन नोटिस भेजा गया!' : 'Takedown Notice Dispatched to Platform!');
    }

    if (transaction) {
      saveDraftToStorage(transaction, generatedPayload);
    }
    setCurrentStep('radar');
  };

  const handleResetToHome = () => {
    clearDraftFromStorage();
    setTransaction(null);
    setPayload(null);
    setSec79Payload(null);
    setCurrentStep('intake');
    triggerToast(currentLang === 'hi' ? 'नया केस शुरू किया गया' : 'Reset to new emergency intake');
  };

  const handleLogin = (phone: string) => {
    setSessionPhone(phone);
    try {
      sessionStorage.setItem('kavach_session', phone);
    } catch {
      /* ignore */
    }
    triggerToast(currentLang === 'hi' ? 'साइन इन हो गया' : 'Signed in');
  };

  const handleLogout = () => {
    setSessionPhone(null);
    try {
      sessionStorage.removeItem('kavach_session');
    } catch {
      /* ignore */
    }
    handleResetToHome();
  };

  if (!sessionPhone) {
    return (
      <LoginScreen
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="app-shell">
      {toastMessage && (
        <div className="toast-bar animate-fadeIn" role="status">
          {toastMessage}
        </div>
      )}

      <Header
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        onOpenMockedHub={() => setShowMockedHub(true)}
        onResetToHome={handleResetToHome}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onLogout={handleLogout}
      />

      <StepTracker
        currentStep={currentStep}
        currentLang={currentLang}
      />

      <main id="main" className="flex-1 page-enter" key={currentStep}>
        {currentStep === 'intake' && (
          <EmergencyIntake
            currentLang={currentLang}
            onSelectPreset={handleSelectPreset}
            onUploadFile={handleUploadFile}
            onVoiceTranscribe={handleVoiceTranscribe}
            onManualSubmit={handleManualSubmit}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'review' && transaction && (
          transaction.incidentType === 'FINANCIAL' ? (
            <ExtractedDetailsCard
              transaction={transaction as FinancialIncident}
              currentLang={currentLang}
              onProceedToFreeze={handleProceedToAction}
              onBackToIntake={() => setCurrentStep('intake')}
            />
          ) : (
            <SocialVerificationCard
              transaction={transaction as SocialIncident}
              currentLang={currentLang}
              onProceedToTakedown={handleProceedToAction}
              onBackToIntake={() => setCurrentStep('intake')}
            />
          )
        )}

        {currentStep === 'freeze' && transaction && (
          transaction.incidentType === 'FINANCIAL' ? (
            <DualBankFreezeCard
              transaction={transaction as FinancialIncident}
              currentLang={currentLang}
              onDispatchComplete={handleDispatchComplete}
            />
          ) : (
            <TakedownDispatchCard
              transaction={transaction as SocialIncident}
              currentLang={currentLang}
              onDispatchComplete={handleDispatchComplete}
            />
          )
        )}

        {currentStep === 'radar' && transaction && (
          transaction.incidentType === 'FINANCIAL' && payload ? (
            <FundTrailRadar
              transaction={transaction as FinancialIncident}
              payload={payload}
              currentLang={currentLang}
              onOpenCourtPetition={() => setShowPetitionModal(true)}
              onViewReceipt={() => setShowReceiptModal(true)}
            />
          ) : transaction.incidentType === 'SOCIAL' && sec79Payload ? (
            <EscalationTracker
              transaction={transaction as SocialIncident}
              payload={sec79Payload}
              currentLang={currentLang}
              onGeneratePetition={() => setShowFIRModal(true)}
            />
          ) : null
        )}
      </main>

      <SiteFooter
        currentLang={currentLang}
        onResetToHome={handleResetToHome}
        onOpenMockedHub={() => setShowMockedHub(true)}
      />

      {showPetitionModal && transaction && payload && (
        <CourtPetitionModal
          transaction={transaction as FinancialIncident}
          payload={payload}
          currentLang={currentLang}
          onClose={() => setShowPetitionModal(false)}
        />
      )}

      {showReceiptModal && transaction && payload && (
        <OfficialReceipt
          transaction={transaction as FinancialIncident}
          payload={payload}
          currentLang={currentLang}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

      {showFIRModal && transaction && sec79Payload && (
        <FIRDraftModal
          transaction={transaction as SocialIncident}
          payload={sec79Payload}
          currentLang={currentLang}
          onClose={() => setShowFIRModal(false)}
        />
      )}

      {showMockedHub && (
        <MockedTransparencyHub
          currentLang={currentLang}
          onClose={() => setShowMockedHub(false)}
        />
      )}
    </div>
  );
};

export default App;
