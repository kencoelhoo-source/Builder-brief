import React, { useState, useRef, useEffect } from 'react';
import { Mic, ArrowRight, CreditCard, ShieldAlert, MessageCircleQuestionMark } from 'lucide-react';
import type { Language, FraudPersona } from '../types';
import type { SavedDraft } from '../services/storageService';
import { MOCK_PERSONAS } from '../data/mockPersonas';
import { speechService } from '../services/speechService';
import { formatINR } from '../utils/formatters';
import { isValidSuspectUrl, isValidVPA } from '../utils/sanitizers';

interface EmergencyIntakeProps {
  currentLang: Language;
  onSelectPreset: (personaId: string) => void;
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

const demoLabel = (persona: FraudPersona, hi: boolean) => {
  if (persona.id === 'gpay-phishing') {
    return { title: hi ? 'गूगल पे' : 'Google Pay', meta: '₹48,500' };
  }
  if (persona.id === 'instagram-fake') {
    return { title: hi ? 'फर्जी इंस्टाग्राम' : 'Fake Instagram', meta: persona.platform || '' };
  }
  if (persona.id === 'digital-arrest') {
    return { title: hi ? 'डिजिटल अरेस्ट' : 'Digital arrest', meta: '₹1,50,000' };
  }
  if (persona.id === 'wrongly-accused-freeze') {
    return { title: hi ? 'गलत फ्रीज' : 'Wrong freeze', meta: '₹72,000' };
  }
  return { title: hi ? persona.nameHi : persona.name, meta: persona.amount ? formatINR(persona.amount) : '' };
};

export const EmergencyIntake: React.FC<EmergencyIntakeProps> = ({
  currentLang,
  onSelectPreset,
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

  const draftTx = savedDraft?.transaction;

  return (
    <div className="page-wrap page-stack intake">
      {panel !== 'home' && (
        <p className="mb-6">
          <button type="button" className="btn-link" onClick={() => { speechService.stopListening(); setIsListening(false); setPanel('home'); }}>
            {hi ? '← वापस' : '← Back'}
          </button>
        </p>
      )}

      {panel === 'home' && (
        <div className="panel-enter intake-home">
          {/* Active Saved Draft Banner if page was refreshed */}
          {draftTx && onResumeDraft && (
            <div className="saved-draft-card">
              <div className="saved-draft-copy">
                <p className="saved-draft-kicker">
                  {hi ? 'सहेजी गई शिकायत' : 'Saved complaint'}
                </p>
                <p className="saved-draft-name">
                  {'amount' in draftTx ? formatINR(draftTx.amount) : draftTx.platform}
                </p>
                <p className="saved-draft-category">{draftTx.fraudCategoryLabel}</p>
                <p className="saved-draft-meta">
                  {hi ? 'आपका डेटा सुरक्षित है और समीक्षा के लिए तैयार है।' : 'Your details are safe and ready for review.'}
                </p>
              </div>
              <span className="saved-draft-status">
                {hi ? 'समीक्षा के लिए तैयार' : 'Ready to review'}
              </span>
              <div className="saved-draft-actions">
                {onClearDraft && (
                  <button
                    type="button"
                    onClick={onClearDraft}
                    className="saved-draft-discard"
                    title={hi ? 'ड्राफ्ट हटाएं' : 'Discard draft'}
                  >
                    {hi ? 'हटाएं' : 'Discard'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onResumeDraft}
                  className="btn-primary saved-draft-resume"
                >
                  <span>{hi ? 'समीक्षा जारी रखें' : 'Resume review'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          <header className="intake-hero">
            <p className="crumb">{hi ? 'शिकायत' : 'Report'}</p>
            <h1>{hi ? 'क्या हुआ?' : 'What happened?'}</h1>
            <p className="lede">
              {hi
                ? 'एक कार्ड चुनें। रसीद या चैट की फोटो उसी कार्ड पर छोड़ सकते हैं।'
                : 'Pick one card. If you have a photo of the receipt or chat, drop it on that card.'}
            </p>
            <div className="notice notice-urgent intake-urgent" role="note">
              <div>
                <strong>{hi ? 'पैसे अभी-अभी गए हैं?' : 'Money just left?'}</strong>
                <p>{hi ? 'पहले बैंक को बताएं और 1930 पर कॉल करें। यह साइट खाता नहीं रोकती।' : 'Call your bank and 1930 first. This site does not freeze accounts.'}</p>
              </div>
              <a className="btn-emergency intake-call-btn" href="tel:1930">1930</a>
            </div>
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
              <span className="intake-choice-icon"><CreditCard size={20} /></span>
              <span className="intake-choice-title">{hi ? 'मेरे पैसे चले गए' : 'I lost money'}</span>
              <span className="intake-choice-meta">
                {isLoading
                  ? hi ? 'पढ़ा जा रहा है…' : 'Reading…'
                  : hi ? 'UPI रसीद या बैंक SMS की फोटो यहीं छोड़ें या चुनें।' : 'Drop or choose the UPI receipt or bank SMS photo.'}
              </span>
              <span className="intake-choice-foot">{hi ? 'JPG, PNG, WEBP · 10 MB तक' : 'JPG, PNG or WEBP · up to 10 MB'}</span>
            </button>
            <button
              type="button"
              className={`intake-choice ${dropOver === 'social' ? 'is-over' : ''} ${isLoading ? 'is-busy' : ''}`}
              disabled={isLoading}
              {...uploadBind('social')}
            >
              <span className="intake-choice-icon"><ShieldAlert size={20} /></span>
              <span className="intake-choice-title">{hi ? 'फेक प्रोफाइल / धमकी' : 'Fake profile / threat'}</span>
              <span className="intake-choice-meta">
                {hi ? 'चैट, प्रोफाइल या पोस्ट की फोटो यहीं छोड़ें या चुनें।' : 'Drop or choose a photo of the chat, profile or post.'}
              </span>
              <span className="intake-choice-foot">{hi ? 'JPG, PNG, WEBP · 10 MB तक' : 'JPG, PNG or WEBP · up to 10 MB'}</span>
            </button>
            <button
              type="button"
              className="intake-choice"
              disabled={isLoading}
              onClick={() => setPanel('voice')}
            >
              <span className="intake-choice-icon"><MessageCircleQuestionMark size={20} /></span>
              <span className="intake-choice-title">{hi ? 'समझ नहीं आ रहा' : 'I’m not sure'}</span>
              <span className="intake-choice-meta">
                {hi ? 'टाइप करें या बोलें — फोटो बाद में जोड़ सकते हैं।' : 'Type or speak. You can add a photo later.'}
              </span>
              <span className="intake-choice-foot">{hi ? 'आवाज़ या टेक्स्ट' : 'Voice or text'}</span>
            </button>
          </div>

          <div className="intake-fallbacks">
            <p className="intake-fallback-copy">
              {hi ? 'फोटो नहीं है?' : 'No photo?'}
            </p>
            <button type="button" className="btn-secondary" onClick={() => setPanel('manual')}>
              {hi ? 'पेमेंट नंबर लिखें' : 'Type the payment ID'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setPanel('social')}>
              {hi ? 'प्रोफाइल लिंक लिखें' : 'Type the profile link'}
            </button>
          </div>

          <p className="demo-label">{hi ? 'समीक्षकों के लिए मॉक केस' : 'Mock cases'}</p>
          <div className="mock-case-grid">
            {MOCK_PERSONAS.map((persona: FraudPersona) => {
              const label = demoLabel(persona, hi);
              return (
                <button key={persona.id} type="button" className="mock-case-card" onClick={() => onSelectPreset(persona.id)} disabled={isLoading}>
                  <span className="mock-case-kind">
                    {persona.incidentType === 'SOCIAL' ? (hi ? 'सोशल' : 'Social') : (hi ? 'पैसा' : 'Money')}
                  </span>
                  <span className="mock-case-title">{persona.profile.fullName}</span>
                  <span className="mock-case-category">
                    {label.title}{label.meta ? ` · ${label.meta}` : ''}
                  </span>
                  <span className={`mock-case-role ${persona.casePerspective === 'WRONGLY_ACCUSED' ? 'is-warning' : ''}`}>
                    {persona.casePerspective === 'WRONGLY_ACCUSED'
                      ? hi ? 'गलत आरोप' : 'Wrongly accused'
                      : hi ? 'शिकायतकर्ता' : 'Reporting victim'}
                  </span>
                </button>
              );
            })}
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
              <textarea
                id="social-summary"
                rows={4}
                value={socialSummary}
                onChange={(e) => setSocialSummary(e.target.value)}
                className="input-field resize-none"
                required
              />
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
