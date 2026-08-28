import React, { useState, useEffect } from 'react';
import {
  Header,
} from './components/Header';
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
import { ComplaintAssistant } from './components/ComplaintAssistant';
import { SiteFooter } from './components/SiteFooter';

import { LoginScreen } from './components/LoginScreen';
import type { AppStep, Language, CyberIncident, FinancialIncident, SocialIncident, CFCFRMSPayload, Sec79Payload } from './types';
import { parseScreenshotOCR, parseVoiceTranscription, OcrReadError } from './services/ocrService';
import {
  saveDraftToStorage,
  getDraftFromStorage,
  saveLanguagePreference,
  getLanguagePreference,
  clearDraftFromStorage,
  clearSessionFlowState,
  saveLastAcknowledgment,
  type SavedDraft,
} from './services/storageService';
import { CyberSafetyQuiz } from './components/CyberSafetyQuiz';
import { WronglyAccusedCaseCard } from './components/WronglyAccusedCaseCard';
import { HomeHub } from './components/HomeHub';


type Theme = 'light' | 'dark';

const STEP_ORDER: AppStep[] = ['intake', 'review', 'freeze', 'radar'];
const stepIndex = (step: AppStep) => {
  if (step === 'petition') return 3;
  return Math.max(0, STEP_ORDER.indexOf(step));
};

type NavigationOptions = {
  persist?: boolean;
  transaction?: CyberIncident | null;
  payload?: CFCFRMSPayload | Sec79Payload | null;
};

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
  const [isToastLeaving, setIsToastLeaving] = useState<boolean>(false);
  const toastTimerRef = React.useRef<{ hide?: number; clear?: number }>({});
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [savedDraft, setSavedDraft] = useState<SavedDraft | null>(() => getDraftFromStorage());

  const [showPetitionModal, setShowPetitionModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showFIRModal, setShowFIRModal] = useState<boolean>(false);
  const [showMockedHub, setShowMockedHub] = useState<boolean>(false);

  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [intakeResetKey, setIntakeResetKey] = useState(0);
  const [furthestStep, setFurthestStep] = useState<number>(0);
  const [showHub, setShowHub] = useState(true);
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
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  useEffect(() => {
    // Always start at intake on fresh load/refresh
    window.history.replaceState({ step: 'intake' }, '');
  }, []);

  const goToStep = (
    step: AppStep,
    source: 'nav' | 'flow' | 'pop' = 'nav',
    options: NavigationOptions = {}
  ) => {
    const nextTransaction = options.transaction !== undefined ? options.transaction : transaction;
    const nextPayload = options.payload !== undefined ? options.payload : payload || sec79Payload;
    const idx = stepIndex(step);
    if (source === 'nav' && idx > furthestStep) return;
    if (source !== 'flow') {
      if ((step === 'review' || step === 'freeze') && !nextTransaction) return;
      if (step === 'radar' && !nextPayload) return;
    }
    if (source === 'flow') {
      setFurthestStep((n) => Math.max(n, idx));
    }
    setCurrentStep(step);
    if (options.persist !== false && nextTransaction) {
      saveDraftToStorage(nextTransaction, nextPayload, step);
      setSavedDraft(getDraftFromStorage());
    }
    if (source !== 'pop') {
      window.history.pushState({ step }, '');
    }
  };

  useEffect(() => {
    const onPop = (event: PopStateEvent) => {
      const step = event.state?.step as AppStep | undefined;
      if (step && STEP_ORDER.includes(step)) {
        setCurrentStep(step);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const triggerToast = (msg: string) => {
    if (toastTimerRef.current.hide) window.clearTimeout(toastTimerRef.current.hide);
    if (toastTimerRef.current.clear) window.clearTimeout(toastTimerRef.current.clear);

    setIsToastLeaving(false);
    setToastMessage(msg);

    toastTimerRef.current.hide = window.setTimeout(() => {
      setIsToastLeaving(true);
      toastTimerRef.current.clear = window.setTimeout(() => {
        setToastMessage(null);
        setIsToastLeaving(false);
      }, 280);
    }, 2500);
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
      setPayload(null);
      setSec79Payload(null);
      setTransaction(extracted);
      goToStep('review', 'flow', { transaction: extracted, payload: null });
      triggerToast(currentLang === 'hi' ? 'AI ने ट्रांसक्शन विवरण निकाल लिया है' : 'Vision AI parsed screenshot details');
    } catch (e) {
      console.error(e);
      triggerToast(currentLang === 'hi' ? 'डेमो रिपोर्ट लोड नहीं हो सकी' : 'Could not load that demo report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    if ((file.type && !file.type.startsWith('image/')) || file.size > 10 * 1024 * 1024) {
      triggerToast(
        currentLang === 'hi'
          ? 'कृपया 10 MB से छोटी इमेज अपलोड करें'
          : 'Please upload an image smaller than 10 MB'
      );
      return;
    }
    setIsLoading(true);
    try {
      const extracted = await parseScreenshotOCR(file);
      setPayload(null);
      setSec79Payload(null);
      setTransaction(extracted);
      goToStep('review', 'flow', { transaction: extracted, payload: null });
      const thin =
        extracted.incidentType === 'FINANCIAL'
          ? !extracted.utr && !extracted.amount && !extracted.beneficiaryVpa
          : !extracted.suspectUrl;
      triggerToast(
        currentLang === 'hi'
          ? thin
            ? 'स्क्रीनशॉट पढ़ा गया — विवरण जाँचें और खाली फ़ील्ड भरें'
            : 'स्क्रीनशॉट से विवरण निकाले गए'
          : thin
            ? 'Screenshot read — check details and fill anything missing'
            : 'Details extracted from the screenshot'
      );
    } catch (e) {
      console.error(e);
      const code = e instanceof OcrReadError ? e.code : '';
      const hiMsg =
        code === 'HEIC_UNSUPPORTED'
          ? 'यह HEIC फोटो नहीं पढ़ सकी। JPG या PNG में सेव करके अपलोड करें।'
          : code === 'OCR_TIMEOUT'
            ? 'पढ़ने में समय लग गया। छोटी इमेज आज़माएं या UTR खुद लिखें।'
            : 'स्क्रीनशॉट पढ़ा नहीं जा सका। फिर कोशिश करें या मैन्युअल भरें।';
      const enMsg =
        code === 'HEIC_UNSUPPORTED'
          ? 'This device could not read a HEIC photo. Save as JPG or PNG and upload again.'
          : code === 'OCR_TIMEOUT'
            ? 'Reading timed out. Try a smaller image or enter the UTR yourself.'
            : 'Could not read that screenshot. Try again or enter details manually.';
      triggerToast(currentLang === 'hi' ? hiMsg : enMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscribe = async (transcript: string) => {
    setIsLoading(true);
    try {
      const extracted = await parseVoiceTranscription(transcript);
      setPayload(null);
      setSec79Payload(null);
      setTransaction(extracted);
      goToStep('review', 'flow', { transaction: extracted, payload: null });
      triggerToast(currentLang === 'hi' ? 'आवाज़ से विवरण दर्ज हुआ' : 'Voice input processed');
    } catch (e) {
      console.error(e);
      triggerToast(currentLang === 'hi' ? 'आवाज़ को समझा नहीं जा सका' : 'Could not process that voice report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (utr: string, amount: number, beneficiaryVpa: string) => {
    const manualTxn: FinancialIncident = {
      incidentType: 'FINANCIAL',
      utr,
      amount,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      remitterBank: 'HDFC Bank Ltd.',
      remitterAccount: 'XXXX-XXXX-4012',
      beneficiaryVpa,
      beneficiaryBank: 'Unknown bank — please verify',
      fraudCategory: 'UPI_PHISHING',
      fraudCategoryLabel: 'Manually Entered UTR Report',
      incidentSummary: `Unauthorized transaction reported with UTR ${utr}.`,
      victimName: 'Citizen (Demo User)',
      victimMobile: '+91-98765-43210',
      confidenceScore: 100,
      extractedVia: 'MANUAL',
    };
    setTransaction(manualTxn);
    setPayload(null);
    setSec79Payload(null);
    goToStep('review', 'flow', { transaction: manualTxn, payload: null });
  };

  const handleProceedToAction = (updatedTxn: CyberIncident) => {
    setTransaction(updatedTxn);
    goToStep('freeze', 'flow', { transaction: updatedTxn, payload: null });
    triggerToast(currentLang === 'hi' ? 'कार्रवाई योजना तैयार' : 'Action Plan Ready');
  };

  const handleDispatchComplete = (generatedPayload: CFCFRMSPayload | Sec79Payload) => {
    if ('cfcfrmsToken' in generatedPayload) {
      setPayload(generatedPayload as CFCFRMSPayload);
      triggerToast(currentLang === 'hi' ? 'डेमो फ्रीज नोटिस तैयार हुआ' : 'Demo freeze notice prepared');
    } else {
      setSec79Payload(generatedPayload as Sec79Payload);
      triggerToast(currentLang === 'hi' ? 'डेमो टेकडाउन नोटिस तैयार हुआ' : 'Demo takedown notice prepared');
    }

    saveLastAcknowledgment(generatedPayload.ackNumber);
    if (transaction) {
      goToStep('radar', 'flow', { transaction, payload: generatedPayload });
    }
  };

  const handleManualSocialSubmit = (platform: string, suspectUrl: string, summary: string) => {
    const socialTxn: SocialIncident = {
      incidentType: 'SOCIAL',
      platform,
      suspectUrl,
      contentType: 'FAKE_PROFILE',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      fraudCategory: 'SOCIAL_MEDIA_IMPERSONATION',
      fraudCategoryLabel: 'Manually entered profile report',
      incidentSummary: summary,
      victimName: 'Citizen (Demo User)',
      victimMobile: '+91-98765-43210',
      confidenceScore: 100,
      extractedVia: 'MANUAL',
    };
    setTransaction(socialTxn);
    setPayload(null);
    setSec79Payload(null);
    goToStep('review', 'flow', { transaction: socialTxn, payload: null });
  };

  const handleGoHub = () => {
    setShowHub(true);
    setCurrentStep('intake');
    window.history.replaceState({ step: 'intake' }, '');
  };

  const handleTrack = () => {
    const livePayload = payload || sec79Payload;
    if (transaction && livePayload) {
      setShowHub(false);
      goToStep('radar', 'nav', { transaction, payload: livePayload });
      return;
    }
    const draft = getDraftFromStorage();
    if (draft?.transaction && draft.payload) {
      handleResumeDraft();
      setShowHub(false);
      return;
    }
    triggerToast(
      currentLang === 'hi'
        ? 'अभी कोई शिकायत ट्रैक करने को नहीं है। पहले रिपोर्ट करें।'
        : 'No complaint to track yet. Report one first.'
    );
  };

  const handleResumeDraft = () => {
    const draft = getDraftFromStorage();
    if (!draft?.transaction) {
      triggerToast(currentLang === 'hi' ? 'सहेजा हुआ ड्राफ्ट उपलब्ध नहीं है' : 'Saved draft is no longer available');
      return;
    }

    const isFinancial = draft.transaction.incidentType === 'FINANCIAL';
    const hasCompatiblePayload = Boolean(
      draft.payload && (isFinancial ? 'cfcfrmsToken' in draft.payload : 'takedownToken' in draft.payload)
    );

    setTransaction(draft.transaction);
    setPayload(isFinancial && hasCompatiblePayload ? draft.payload as CFCFRMSPayload : null);
    setSec79Payload(!isFinancial && hasCompatiblePayload ? draft.payload as Sec79Payload : null);

    // A draft saved at intake/review/freeze should always reopen at review unless
    // it contains a matching completed payload. This avoids blank screens from
    // stale step metadata or a payload from the other incident type.
    const targetStep: AppStep = hasCompatiblePayload ? 'radar' : 'review';
    goToStep(targetStep, 'flow', {
      transaction: draft.transaction,
      payload: hasCompatiblePayload ? draft.payload : null,
    });
    triggerToast(currentLang === 'hi' ? 'सुरक्षित ड्राफ्ट लोड हो गया' : 'Draft restored successfully');
  };

  const handleClearDraft = () => {
    clearDraftFromStorage();
    clearSessionFlowState();
    setSavedDraft(null);
    setTransaction(null);
    setPayload(null);
    setSec79Payload(null);
    setFurthestStep(0);
    setIntakeResetKey((key) => key + 1);
    triggerToast(currentLang === 'hi' ? 'ड्राफ्ट हटा दिया गया' : 'Draft cleared');
  };

  const handleResetToHome = () => {
    clearDraftFromStorage();
    clearSessionFlowState();
    setSavedDraft(null);
    setTransaction(null);
    setPayload(null);
    setSec79Payload(null);
    setFurthestStep(0);
    setIntakeResetKey((key) => key + 1);
    setCurrentStep('intake');
    setShowHub(true);
    window.history.replaceState({ step: 'intake' }, '');
    triggerToast(currentLang === 'hi' ? 'नया केस शुरू किया गया' : 'Ready for a new report');
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
      <>
        <LoginScreen
          currentLang={currentLang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          onLogin={handleLogin}
          onOpenQuiz={() => setShowQuiz(true)}
        />
        {showQuiz && (
          <CyberSafetyQuiz currentLang={currentLang} onClose={() => setShowQuiz(false)} />
        )}
      </>
    );
  }

  return (
    <div className="app-shell">
      {toastMessage && (
        <div className={`toast-bar ${isToastLeaving ? 'is-leaving' : ''}`} role="status">
          {toastMessage}
        </div>
      )}

      <Header
        currentLang={currentLang}
        currentStep={currentStep}
        onToggleLang={handleToggleLang}
        onGoHome={handleGoHub}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onLogout={handleLogout}
        furthestStep={furthestStep}
        onGoToStep={(step) => {
          setShowHub(false);
          goToStep(step, 'nav');
        }}
        onTrack={handleTrack}
        canTrack={Boolean((payload || sec79Payload) && transaction)}
        onHub={showHub}
      />

      <main id="main" className="flex-1 page-enter" key={showHub ? 'hub' : currentStep}>
        {showHub ? (
          <HomeHub
            currentLang={currentLang}
            onReport={() => setShowHub(false)}
            onTrack={handleTrack}
            canTrack={Boolean((payload || sec79Payload) && transaction) || Boolean(savedDraft?.payload)}
            ackNumber={
              payload?.ackNumber
              || sec79Payload?.ackNumber
              || (savedDraft?.payload && 'ackNumber' in savedDraft.payload ? savedDraft.payload.ackNumber : null)
              || null
            }
          />
        ) : currentStep === 'intake' && (
          <EmergencyIntake
            key={intakeResetKey}
            currentLang={currentLang}
            onSelectPreset={handleSelectPreset}
            onUploadFile={handleUploadFile}
            onVoiceTranscribe={handleVoiceTranscribe}
            onManualSubmit={handleManualSubmit}
            onManualSocialSubmit={handleManualSocialSubmit}
            isLoading={isLoading}
            savedDraft={savedDraft}
            onResumeDraft={() => {
              handleResumeDraft();
              setShowHub(false);
            }}
            onClearDraft={handleClearDraft}
          />
        )}

        {!showHub && currentStep === 'review' && transaction && (
          transaction.casePerspective === 'WRONGLY_ACCUSED' && transaction.incidentType === 'FINANCIAL' ? (
            <WronglyAccusedCaseCard
              transaction={transaction as FinancialIncident}
              currentLang={currentLang}
              onBackToIntake={() => goToStep('intake', 'nav')}
            />
          ) : transaction.incidentType === 'FINANCIAL' ? (
            <ExtractedDetailsCard
              transaction={transaction as FinancialIncident}
              currentLang={currentLang}
              onProceedToFreeze={handleProceedToAction}
              onBackToIntake={() => goToStep('intake', 'nav')}
            />
          ) : (
            <SocialVerificationCard
              transaction={transaction as SocialIncident}
              currentLang={currentLang}
              onProceedToTakedown={handleProceedToAction}
              onBackToIntake={() => goToStep('intake', 'nav')}
            />
          )
        )}

        {!showHub && currentStep === 'freeze' && transaction && (
          transaction.incidentType === 'FINANCIAL' ? (
            <DualBankFreezeCard
              transaction={transaction as FinancialIncident}
              currentLang={currentLang}
              onDispatchComplete={handleDispatchComplete}
              onBack={() => goToStep('review', 'nav')}
            />
          ) : (
            <TakedownDispatchCard
              transaction={transaction as SocialIncident}
              currentLang={currentLang}
              onDispatchComplete={handleDispatchComplete}
              onBack={() => goToStep('review', 'nav')}
            />
          )
        )}

        {!showHub && currentStep === 'radar' && transaction && (
          transaction.incidentType === 'FINANCIAL' && payload ? (
            <FundTrailRadar
              transaction={transaction as FinancialIncident}
              payload={payload}
              currentLang={currentLang}
              onOpenCourtPetition={() => setShowPetitionModal(true)}
              onViewReceipt={() => setShowReceiptModal(true)}
              onBack={() => goToStep('freeze', 'nav')}
            />
          ) : transaction.incidentType === 'SOCIAL' && sec79Payload ? (
            <EscalationTracker
              transaction={transaction as SocialIncident}
              payload={sec79Payload}
              currentLang={currentLang}
              onGeneratePetition={() => setShowFIRModal(true)}
              onBack={() => goToStep('freeze', 'nav')}
            />
          ) : null
        )}
      </main>

      <SiteFooter
        currentLang={currentLang}
        onResetToHome={handleResetToHome}
        onOpenMockedHub={() => setShowMockedHub(true)}
        onOpenQuiz={() => setShowQuiz(true)}
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

      {showQuiz && (
        <CyberSafetyQuiz currentLang={currentLang} onClose={() => setShowQuiz(false)} />
      )}

      <ComplaintAssistant currentLang={currentLang} />
    </div>
  );
};

export default App;
