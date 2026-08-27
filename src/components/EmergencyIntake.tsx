import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, RefreshCw, Trash2, ArrowRight } from 'lucide-react';
import type { Language, FraudPersona } from '../types';
import type { SavedDraft } from '../services/storageService';
import { MOCK_PERSONAS } from '../data/mockPersonas';
import { speechService } from '../services/speechService';
import { formatINR } from '../utils/formatters';

interface EmergencyIntakeProps {
  currentLang: Language;
  onSelectPreset: (personaId: string) => void;
  onUploadFile: (file: File) => void;
  onVoiceTranscribe: (transcript: string) => void;
  onManualSubmit: (utr: string, amount: number) => void;
  isLoading: boolean;
  savedDraft?: SavedDraft | null;
  onResumeDraft?: () => void;
  onClearDraft?: () => void;
}

type Panel = 'home' | 'voice' | 'manual';

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
  return { title: hi ? persona.nameHi : persona.name, meta: '' };
};

export const EmergencyIntake: React.FC<EmergencyIntakeProps> = ({
  currentLang,
  onSelectPreset,
  onUploadFile,
  onVoiceTranscribe,
  onManualSubmit,
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
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hi = currentLang === 'hi';

  useEffect(() => {
    try {
      if (manualUtr) sessionStorage.setItem('kavach_manual_utr', manualUtr);
      if (manualAmount) sessionStorage.setItem('kavach_manual_amt', manualAmount);
    } catch {
      /* ignore */
    }
  }, [manualUtr, manualAmount]);

  const handleToggleVoice = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      if (spokenText.trim()) onVoiceTranscribe(spokenText);
      return;
    }
    setSpokenText('');
    const started = speechService.startListening(
      currentLang,
      (transcript, isFinal) => {
        setSpokenText(transcript);
        if (isFinal) {
          onVoiceTranscribe(transcript);
          setIsListening(false);
        }
      },
      () => setIsListening(false)
    );
    if (started) setIsListening(true);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) onUploadFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onUploadFile(e.target.files[0]);
  };

  const handleManualFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUtr.trim().length >= 10) {
      onManualSubmit(manualUtr.trim(), parseFloat(manualAmount) || 25000);
    }
  };

  const draftTx = savedDraft?.transaction;

  return (
    <div className="page-wrap page-stack intake">
      {panel !== 'home' && (
        <p className="mb-6">
          <button type="button" className="btn-link" onClick={() => setPanel('home')}>
            {hi ? '← वापस' : '← Back'}
          </button>
        </p>
      )}

      {panel === 'home' && (
        <div className="panel-enter intake-home">
          {/* Active Saved Draft Banner if page was refreshed */}
          {draftTx && onResumeDraft && (
            <div className="mb-6 p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <RefreshCw size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {hi ? 'सक्रिय शिकायत सुरक्षित है' : 'Active Case Restored'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-ink mt-0.5">
                    {'amount' in draftTx ? formatINR(draftTx.amount) : draftTx.platform} · {draftTx.fraudCategoryLabel}
                  </p>
                  <p className="text-xs text-muted">
                    {hi ? 'आपका भरा हुआ डेटा सुरक्षित है। सीधे वहीं से जारी रखें:' : 'Your filled details are preserved. Continue where you left off:'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                {onClearDraft && (
                  <button
                    type="button"
                    onClick={onClearDraft}
                    className="btn-secondary !text-xs !py-1.5 !px-2.5 text-muted hover:text-danger"
                    title={hi ? 'ड्राफ्ट हटाएं' : 'Discard draft'}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onResumeDraft}
                  className="btn-primary !text-xs !py-1.5 !px-3"
                >
                  <span>{hi ? 'शिकायत जारी रखें' : 'Resume Complaint'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          <h1>{hi ? 'रिपोर्ट करें' : 'Report'}</h1>
          <p className="lede">
            {hi
              ? 'पेमेंट या फर्जी प्रोफाइल का स्क्रीनशॉट डालें।'
              : 'Drop a payment or fake-profile screenshot.'}
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`dropzone ${isDragOver ? 'is-over' : ''}`}
          >
            {isLoading ? (
              <p className="font-semibold">{hi ? 'पढ़ा जा रहा है…' : 'Reading…'}</p>
            ) : (
              <>
                <Upload size={20} strokeWidth={1.75} className="mx-auto mb-2 text-muted" />
                <p className="font-semibold">{hi ? 'स्क्रीनशॉट अपलोड करें' : 'Upload screenshot'}</p>
                <p className="text-xs text-muted mt-1">{hi ? 'UPI रसीद, बैंक SMS, या संदिग्ध चैट' : 'UPI receipt, bank SMS, or suspect chat'}</p>
              </>
            )}
          </div>

          <div className="alt-row">
            <button type="button" className="btn-link" onClick={() => setPanel('voice')}>
              {hi ? 'आवाज़' : 'Voice'}
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" className="btn-link" onClick={() => setPanel('manual')}>
              {hi ? 'UTR' : 'UTR'}
            </button>
          </div>

          <p className="demo-label">{hi ? 'डेमो' : 'Demo'}</p>
          <ul className="sample-list">
            {MOCK_PERSONAS.map((persona: FraudPersona) => {
              const label = demoLabel(persona, hi);
              return (
                <li key={persona.id}>
                  <button type="button" onClick={() => onSelectPreset(persona.id)} disabled={isLoading}>
                    <span className="title">{label.title}</span>
                    {label.meta ? <span className="meta">{label.meta}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {panel === 'voice' && (
        <div className="panel-enter max-w-xl">
          <h1>{hi ? 'आवाज़ से रिपोर्ट' : 'Report by voice'}</h1>
          <p className="lede">
            {hi
              ? 'हिन्दी या अंग्रेज़ी में घटना बताएं (उदा. "गूगल पे पर मेरे साथ ₹48,500 का फ्रॉड हुआ...")।'
              : 'Speak naturally in Hindi or English (e.g. "I was defrauded of ₹48,500 on Google Pay...").'}
          </p>
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`btn-primary w-full justify-center ${isListening ? 'btn-listening' : ''}`}
          >
            <Mic size={16} />
            <span>{isListening ? (hi ? 'सुन रहे हैं… रोकें' : 'Listening… Tap to stop') : (hi ? 'बोलना शुरू करें' : 'Start speaking')}</span>
          </button>
          {spokenText && (
            <div className="notice mt-4">
              <p className="text-xs font-semibold text-muted mb-1">{hi ? 'पहचाना गया:' : 'Recognized:'}</p>
              <p className="text-sm italic text-ink">"{spokenText}"</p>
            </div>
          )}
        </div>
      )}

      {panel === 'manual' && (
        <div className="panel-enter max-w-xl">
          <h1>{hi ? 'UTR दर्ज करें' : 'Enter transaction UTR'}</h1>
          <p className="lede">
            {hi
              ? '12 अंकों का UPI संदर्भ या UTR नंबर और राशि डालें।'
              : 'Enter the 12-digit UPI reference / UTR number and amount.'}
          </p>
          <form onSubmit={handleManualFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="manual-utr" className="block text-xs font-semibold text-muted mb-1">
                {hi ? '12 अंकों का UTR / संदर्भ संख्या' : '12-digit UTR / Ref Number'}
              </label>
              <input
                id="manual-utr"
                type="text"
                value={manualUtr}
                onChange={(e) => setManualUtr(e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
                placeholder="e.g. 412938472910"
                className="input-field w-full font-mono text-base"
                maxLength={16}
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
                required
              />
            </div>
            <button
              type="submit"
              disabled={manualUtr.trim().length < 10 || isLoading}
              className="btn-primary w-full justify-center"
            >
              {isLoading ? (hi ? 'प्रोसेसिंग…' : 'Processing…') : (hi ? 'शिकायत आगे बढ़ाएं' : 'Proceed to verify')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
