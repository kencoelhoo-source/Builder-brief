import React, { useState, useRef, useEffect } from 'react';
import { Mic, ArrowRight, CreditCard, ShieldAlert, MessageCircleQuestionMark, FileText, Trash2, ChevronRight } from 'lucide-react';
import type { Language } from '../types';
import type { SavedDraft } from '../services/storageService';
import { speechService } from '../services/speechService';
import { formatINR } from '../utils/formatters';
import { isValidSuspectUrl, isValidVPA } from '../utils/sanitizers';

interface EmergencyIntakeProps {
  currentLang: Language;
  onUploadFile: (file: File) => void;
  onVoiceTranscribe: (transcript: string) => void;
  onManualSubmit: (utr: string, amount: number, beneficiaryVpa: string) => void;
  onManualSocialSubmit: (platform: string, suspectUrl: string, summary: string) => void;
  isLoading: boolean;
  savedDraft?: SavedDraft | null;
  onResumeDraft?: () => void;
  onClearDraft?: () => void;
}

type Panel = 'home' | 'voice' | 'manual' | 'social';

export const EmergencyIntake: React.FC<EmergencyIntakeProps> = ({
  currentLang,
  onUploadFile,
  onVoiceTranscribe,
  onManualSubmit,
  onManualSocialSubmit,
  isLoading,
  savedDraft,
  onResumeDraft,
  onClearDraft,
}) => {
  const [panel, setPanel] = useState<Panel>('home');
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [manualUtr, setManualUtr] = useState(() => {
    try {
      return sessionStorage.getItem('kavach_manual_utr') || '';
    } catch {
      return '';
    }
  });
  const [manualAmount, setManualAmount] = useState(() => {
    try {
      return sessionStorage.getItem('kavach_manual_amt') || '';
    } catch {
      return '';
    }
  });
  const [manualVpa, setManualVpa] = useState(() => {
    try {
      return sessionStorage.getItem('kavach_manual_vpa') || '';
    } catch {
      return '';
    }
  });
  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [socialSummary, setSocialSummary] = useState('');
  const [socialListening, setSocialListening] = useState(false);
  const [socialVoiceHint, setSocialVoiceHint] = useState('');
  const [dropOver, setDropOver] = useState<'money' | 'social' | null>(null);
  const [voiceHint, setVoiceHint] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hi = currentLang === 'hi';
  const voiceSupported = speechService.isSupported();

  useEffect(() => {
    try {
      if (manualUtr) sessionStorage.setItem('kavach_manual_utr', manualUtr);
      else sessionStorage.removeItem('kavach_manual_utr');
      if (manualAmount) sessionStorage.setItem('kavach_manual_amt', manualAmount);
      else sessionStorage.removeItem('kavach_manual_amt');
      if (manualVpa) sessionStorage.setItem('kavach_manual_vpa', manualVpa);
      else sessionStorage.removeItem('kavach_manual_vpa');
    } catch {
      /* ignore */
    }
  }, [manualUtr, manualAmount, manualVpa]);

  useEffect(() => () => speechService.stopListening(), []);

  const handleToggleVoice = () => {
    if (!voiceSupported) {
      setVoiceHint(
        hi
          ? 'इस ब्राउज़र में आवाज़ उपलब्ध नहीं है। नीचे टाइप करें या स्क्रीनशॉट अपलोड करें।'
          : 'Voice is not available in this browser. Type below or upload a screenshot.'
      );
      return;
    }
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      if (spokenText.trim()) onVoiceTranscribe(spokenText);
      return;
    }
    setSpokenText('');
    setVoiceHint('');
    const started = speechService.startListening(
      currentLang,
      (transcript, isFinal) => {
        setSpokenText(transcript);
        if (isFinal) {
          speechService.stopListening();
          onVoiceTranscribe(transcript);
          setIsListening(false);
        }
      },
      () => {
        setIsListening(false);
        setVoiceHint(
          hi
            ? 'माइक्रोफ़ोन चालू नहीं हो सका। टाइप करें या स्क्रीनशॉट अपलोड करें।'
            : 'Microphone could not start. Type instead or upload a screenshot.'
        );
      }
    );
    if (started) setIsListening(true);
  };

  const handleToggleSocialVoice = () => {
    if (!voiceSupported) {
      setSocialVoiceHint(
        hi
          ? 'इस ब्राउज़र में आवाज़ उपलब्ध नहीं है। नीचे टाइप करें।'
          : 'Voice is not available in this browser. Type in the field instead.'
      );
      return;
    }
    if (socialListening) {
      speechService.stopListening();
      setSocialListening(false);
      return;
    }
    setSocialVoiceHint('');
    const started = speechService.startListening(
      currentLang,
      (transcript, isFinal) => {
        setSocialSummary(transcript);
        if (isFinal) {
          speechService.stopListening();
          setSocialListening(false);
        }
      },
      () => {
        setSocialListening(false);
        setSocialVoiceHint(
          hi
            ? 'माइक्रोफ़ोन चालू नहीं हो सका। नीचे टाइप करें।'
            : 'Microphone could not start. Type in the field instead.'
        );
      }
    );
    if (started) setSocialListening(true);
  };

  const handleTypedVoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (spokenText.trim()) onVoiceTranscribe(spokenText);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropOver(null);
    if (e.dataTransfer.files?.[0]) onUploadFile(e.dataTransfer.files[0]);
  };

  const uploadBind = (kind: 'money' | 'social') => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDropOver(kind);
    },
    onDragLeave: () => setDropOver(null),
    onDrop: handleFileDrop,
    onClick: () => fileInputRef.current?.click(),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onUploadFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleManualFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(manualAmount);
    if (manualUtr.trim().length === 12 && amount > 0 && isValidVPA(manualVpa)) {
      onManualSubmit(manualUtr.trim(), amount, manualVpa.trim());
    }
  };

  const handleSocialFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (socialPlatform.trim() && isValidSuspectUrl(socialUrl) && socialSummary.trim()) {
      onManualSocialSubmit(socialPlatform.trim(), socialUrl.trim(), socialSummary.trim());
    }
  };

  const isUncompletedDraft = savedDraft && savedDraft.step !== 'radar';
  const draftTx = isUncompletedDraft ? savedDraft.transaction : null;

  return (
    <div className="page-wrap page-stack intake">
      {panel !== 'home' && (
        <p className="mb-6">
          <button type="button" className="btn-link" onClick={() => { speechService.stopListening(); setIsListening(false); setSocialListening(false); setPanel('home'); }}>
            {hi ? '← वापस' : '← Back'}
          </button>
        </p>
      )}

      {panel === 'home' && (
        <div className="panel-enter intake-home">
          {/* Active Saved Draft Banner: Sleek, Compact & Responsive */}
          {draftTx && onResumeDraft && (
            <div className="mb-5 p-3.5 sm:p-5 rounded-2xl bg-card border border-line-strong shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-soft border border-line flex items-center justify-center shrink-0 text-ink">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-ink tracking-tight">
                      {hi ? 'सहेजा गया ड्राफ्ट:' : 'Draft in Progress:'}{' '}
                      <span className="font-extrabold text-ink">{'amount' in draftTx ? formatINR(draftTx.amount) : draftTx.platform}</span>
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted truncate mt-0.5">
                    <span className="font-medium text-ink/80">{draftTx.fraudCategoryLabel}</span> · {hi ? 'डिवाइस पर सुरक्षित' : 'Saved locally on device'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-line/40 sm:border-t-0">
                {onClearDraft && (
                  <button
                    type="button"
                    onClick={onClearDraft}
                    className="draft-action-btn draft-action-discard"
                    title={hi ? 'ड्राफ्ट हटाएं' : 'Discard draft'}
                  >
                    <Trash2 size={13} />
                    <span>{hi ? 'हटाएं' : 'Discard'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onResumeDraft}
                  className="draft-action-btn draft-action-resume"
                >
                  <span>{hi ? 'समीक्षा जारी रखें' : 'Resume Review'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          <header className="intake-hero">
            <p className="crumb font-extrabold tracking-wider">{hi ? 'शिकायत' : 'Report'}</p>
            <h1>{hi ? 'क्या हुआ?' : 'What happened?'}</h1>
            {/* Desktop / Tablet: Full descriptive instructions */}
            <p className="lede hidden sm:block">
              {hi
                ? 'अपनी शिकायत शुरू करने के लिए नीचे उपयुक्त श्रेणी चुनें। आप रसीद फोटो, चैट स्क्रीनशॉट अपलोड कर सकते हैं या बोलकर बता सकते हैं।'
                : 'Select the incident category below to start your guided report. You can upload a payment receipt, chat export, or speak directly.'}
            </p>
            {/* Mobile: Concise, airy, breathable one-liner */}
            <p className="lede block sm:hidden text-xs text-muted mt-1 leading-normal">
              {hi
                ? 'शुरू करने के लिए नीचे उपयुक्त विकल्प चुनें।'
                : 'Choose an option below to start your report.'}
            </p>
          </header>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
            className="hidden"
          />

          <div className="intake-choice-grid" aria-label={hi ? 'घटना का प्रकार चुनें' : 'Choose incident type'}>
            <button
              type="button"
              className={`intake-choice ${dropOver === 'money' ? 'is-over' : ''} ${isLoading ? 'is-busy' : ''}`}
              disabled={isLoading}
              {...uploadBind('money')}
            >
              <div className="flex items-center gap-3 mb-2.5 w-full">
                <span className="intake-choice-icon !mb-0 shrink-0"><CreditCard size={20} /></span>
                <span className="intake-choice-title font-extrabold">{hi ? 'मेरे पैसे चले गए' : 'I lost money'}</span>
              </div>
              <div className="intake-choice-body">
                <span className="intake-choice-meta">
                  {isLoading
                    ? hi ? 'पढ़ा जा रहा है…' : 'Reading…'
                    : hi ? 'UPI रसीद या बैंक SMS की फोटो अपलोड करें।' : 'Upload UPI receipt or bank SMS photo.'}
                </span>
                <span className="intake-choice-foot">{hi ? 'JPG, PNG, WEBP · 10 MB तक' : 'JPG, PNG or WEBP · up to 10 MB'}</span>
              </div>
              <span className="intake-choice-arrow" aria-hidden="true"><ChevronRight size={18} /></span>
            </button>

            <button
              type="button"
              className={`intake-choice ${dropOver === 'social' ? 'is-over' : ''} ${isLoading ? 'is-busy' : ''}`}
              disabled={isLoading}
              {...uploadBind('social')}
            >
              <div className="flex items-center gap-3 mb-2.5 w-full">
                <span className="intake-choice-icon !mb-0 shrink-0"><ShieldAlert size={20} /></span>
                <span className="intake-choice-title font-extrabold">{hi ? 'फेक प्रोफाइल / धमकी' : 'Fake profile / threat'}</span>
              </div>
              <div className="intake-choice-body">
                <span className="intake-choice-meta">
                  {hi ? 'चैट, प्रोफाइल या पोस्ट का स्क्रीनशॉट अपलोड करें।' : 'Upload screenshot of chat, profile or post.'}
                </span>
                <span className="intake-choice-foot">{hi ? 'JPG, PNG, WEBP · 10 MB तक' : 'JPG, PNG or WEBP · up to 10 MB'}</span>
              </div>
              <span className="intake-choice-arrow" aria-hidden="true"><ChevronRight size={18} /></span>
            </button>

            <button
              type="button"
              className="intake-choice"
              disabled={isLoading}
              onClick={() => setPanel('voice')}
            >
              <div className="flex items-center gap-3 mb-2.5 w-full">
                <span className="intake-choice-icon !mb-0 shrink-0"><MessageCircleQuestionMark size={20} /></span>
                <span className="intake-choice-title font-extrabold">{hi ? 'समझ नहीं आ रहा' : 'I’m not sure'}</span>
              </div>
              <div className="intake-choice-body">
                <span className="intake-choice-meta">
                  {hi ? 'टाइप करें या बोलें — साक्ष्य बाद में जोड़ सकते हैं।' : 'Type or speak. You can add evidence later.'}
                </span>
                <span className="intake-choice-foot">{hi ? 'आवाज़ या टेक्स्ट' : 'Voice or text'}</span>
              </div>
              <span className="intake-choice-arrow" aria-hidden="true"><ChevronRight size={18} /></span>
            </button>
          </div>

          <div className="intake-fallbacks mt-6 pt-4 border-t border-line/60">
            <p className="intake-fallback-copy !font-extrabold !text-ink">
              {hi ? 'फोटो नहीं है?' : 'No photo?'}
            </p>
            <div className="intake-fallback-buttons">
              <button type="button" className="btn-secondary font-bold" onClick={() => setPanel('manual')}>
                {hi ? 'पेमेंट नंबर लिखें' : 'Type the payment ID'}
              </button>
              <button type="button" className="btn-secondary font-bold" onClick={() => setPanel('social')}>
                {hi ? 'प्रोफाइल लिंक लिखें' : 'Type the profile link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {panel === 'voice' && (
        <div className="panel-enter max-w-xl">
          <header className="page-head">
          <h1>{hi ? 'आवाज़ से रिपोर्ट' : 'Report by voice'}</h1>
          <p className="lede">
            {hi
              ? 'हिन्दी या अंग्रेज़ी में घटना बताएं (उदा. "गूगल पे पर मेरे साथ ₹48,500 का फ्रॉड हुआ...")।'
              : 'Speak naturally in Hindi or English (e.g. "I was defrauded of ₹48,500 on Google Pay...").'}
          </p>
          </header>
          {voiceSupported ? (
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`btn-primary w-full justify-center ${isListening ? 'btn-listening' : ''}`}
            >
              <Mic size={16} />
              <span>{isListening ? (hi ? 'सुन रहे हैं… रोकें' : 'Listening… Tap to stop') : (hi ? 'बोलना शुरू करें' : 'Start speaking')}</span>
            </button>
          ) : (
            <p className="notice notice-urgent">
              {hi
                ? 'Safari / iPhone पर आवाज़ हमेशा काम नहीं करती। नीचे टाइप करें।'
                : 'Voice is unreliable in Safari. Type what happened below.'}
            </p>
          )}
          {voiceHint && <p className="notice mt-3 text-sm">{voiceHint}</p>}
          <form onSubmit={handleTypedVoiceSubmit} className="mt-4 space-y-3">
            <label htmlFor="voice-notes" className="block text-xs font-semibold text-muted">
              {hi ? 'या टाइप करें' : 'Or type it'}
            </label>
            <textarea
              id="voice-notes"
              className="input-field resize-none"
              rows={4}
              value={spokenText}
              onChange={(e) => setSpokenText(e.target.value)}
              placeholder={hi ? 'क्या हुआ, राशि, UTR…' : 'What happened, amount, UTR…'}
            />
            <button type="submit" className="btn-primary w-full justify-center" disabled={!spokenText.trim() || isLoading}>
              {hi ? 'आगे बढ़ाएं' : 'Continue'}
            </button>
          </form>
        </div>
      )}

      {panel === 'manual' && (
        <div className="panel-enter max-w-xl">
          <header className="page-head">
          <h1>{hi ? 'रसीद का पेमेंट नंबर लिखें।' : 'Type the payment ID from the receipt.'}</h1>
          <p className="lede">
            {hi
              ? 'UTR वह 12 अंकों का नंबर है जो GPay, PhonePe या बैंक SMS पर छपता है। साथ में राशि और संदिग्ध UPI ID लिखें।'
              : 'UTR is the 12-digit Unique Transaction Reference printed on GPay, PhonePe or the bank SMS. Also enter the amount and the suspect UPI ID.'}
          </p>
          <button type="button" className="intake-voice-link" onClick={() => setPanel('voice')}>
            <Mic size={15} />
            <span>{hi ? 'आवाज़ से बताएं' : 'Use voice instead'}</span>
          </button>
          </header>
          <form onSubmit={handleManualFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="manual-utr" className="block text-xs font-semibold text-muted mb-1">
                {hi ? '12 अंकों का UTR (रसीद / SMS पर)' : '12-digit UTR (on the receipt or SMS)'}
              </label>
              <input
                id="manual-utr"
                type="text"
                value={manualUtr}
                onChange={(e) => setManualUtr(e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
                placeholder="e.g. 412938472910"
                className="input-field w-full font-mono text-base"
               maxLength={12}
                required
              />
            </div>
            <div>
              <label htmlFor="manual-amount" className="block text-xs font-semibold text-muted mb-1">
                {hi ? 'धोखाधड़ी की राशि (₹)' : 'Disputed Amount (₹)'}
              </label>
              <input
                id="manual-amount"
                type="number"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="e.g. 48500"
                className="input-field w-full font-mono text-base"
                min="1"
                step="1"
                required
              />
            </div>
            <div>
              <label htmlFor="manual-vpa" className="block text-xs font-semibold text-muted mb-1">
                {hi ? 'संदिग्ध UPI ID (VPA)' : 'Suspect UPI ID (VPA)'}
              </label>
              <input
                id="manual-vpa"
                type="text"
                value={manualVpa}
                onChange={(e) => setManualVpa(e.target.value.trim())}
                placeholder="e.g. name@oksbi"
                className="input-field w-full font-mono text-base"
                required
              />
              <p className="field-hint">
                {hi
                  ? 'VPA मतलब Virtual Payment Address — name@oksbi जैसा पता जिससे पैसे गए।'
                  : 'VPA means Virtual Payment Address — the name@oksbi style ID the money went to.'}
              </p>
            </div>
            <button
              type="submit"
              disabled={manualUtr.trim().length !== 12 || Number(manualAmount) <= 0 || !isValidVPA(manualVpa) || isLoading}
              className="btn-primary w-full justify-center"
            >
              {isLoading ? (hi ? 'प्रोसेसिंग…' : 'Processing…') : (hi ? 'शिकायत आगे बढ़ाएं' : 'Proceed to verify')}
            </button>
          </form>
        </div>
      )}

      {panel === 'social' && (
        <div className="panel-enter max-w-xl">
          <header className="page-head">
            <h1>{hi ? 'प्रोफाइल लिंक लिखें।' : 'Type the profile link.'}</h1>
            <p className="lede">
              {hi
                ? 'फोटो नहीं है तो Instagram / Facebook का लिंक और क्या हुआ, लिख दें।'
                : 'No photo? Paste the Instagram or Facebook link and a short note on what happened.'}
            </p>
          </header>
          <form onSubmit={handleSocialFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="social-platform" className="block text-xs font-semibold text-muted mb-1">
                {hi ? 'प्लेटफ़ॉर्म' : 'Platform'}
              </label>
              <input
                id="social-platform"
                type="text"
                value={socialPlatform}
                onChange={(e) => setSocialPlatform(e.target.value)}
                placeholder={hi ? 'जैसे Instagram' : 'e.g. Instagram'}
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="social-url" className="block text-xs font-semibold text-muted mb-1">
                {hi ? 'प्रोफाइल / पोस्ट लिंक' : 'Profile or post link'}
              </label>
              <input
                id="social-url"
                type="url"
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value.trim())}
                placeholder="https://instagram.com/..."
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="social-summary" className="block text-xs font-semibold text-muted mb-1">
                {hi ? 'क्या हुआ' : 'What happened'}
              </label>
              <div className="textarea-with-voice">
                <textarea
                  id="social-summary"
                  rows={4}
                  value={socialSummary}
                  onChange={(e) => setSocialSummary(e.target.value)}
                  className="input-field resize-none"
                  required
                />
                <button
                  type="button"
                  className={`textarea-voice-button ${socialListening ? 'is-recording' : ''}`}
                  onClick={handleToggleSocialVoice}
                  aria-label={
                    socialListening
                      ? (hi ? 'आवाज़ रोकें' : 'Stop voice input')
                      : (hi ? 'आवाज़ से क्या हुआ बताएं' : 'Describe what happened by voice')
                  }
                  aria-pressed={socialListening}
                  title={
                    socialListening
                      ? (hi ? 'आवाज़ रोकें' : 'Stop voice input')
                      : (hi ? 'आवाज़ से बताएं' : 'Use voice input')
                  }
                >
                  <Mic size={16} />
                </button>
              </div>
              {socialVoiceHint && <p className="field-hint">{socialVoiceHint}</p>}
            </div>
            <button
              type="submit"
              disabled={!socialPlatform.trim() || !isValidSuspectUrl(socialUrl) || !socialSummary.trim() || isLoading}
              className="btn-primary w-full justify-center"
            >
              {hi ? 'आगे बढ़ाएं' : 'Continue'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
