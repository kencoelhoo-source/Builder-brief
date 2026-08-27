import React, { useState, useRef } from 'react';
import { Upload, Mic } from 'lucide-react';
import type { Language, FraudPersona } from '../types';
import { MOCK_PERSONAS } from '../data/mockPersonas';
import { speechService } from '../services/speechService';

interface EmergencyIntakeProps {
  currentLang: Language;
  onSelectPreset: (personaId: string) => void;
  onUploadFile: (file: File) => void;
  onVoiceTranscribe: (transcript: string) => void;
  onManualSubmit: (utr: string, amount: number) => void;
  isLoading: boolean;
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
}) => {
  const [panel, setPanel] = useState<Panel>('home');
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [manualUtr, setManualUtr] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hi = currentLang === 'hi';

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
            className={isListening ? 'btn-emergency mt-8' : 'btn-primary mt-8'}
          >
            <Mic size={18} strokeWidth={1.75} />
            {isListening
              ? hi
                ? 'रोकें'
                : 'Stop'
              : hi
              ? 'रिकॉर्ड करें'
              : 'Record'}
          </button>
          {spokenText && <p className="mt-6 p-4 rounded bg-soft text-ink">{spokenText}</p>}
        </div>
      )}

      {panel === 'manual' && (
        <form onSubmit={handleManualFormSubmit} className="panel-enter max-w-xl">
          <h1>{hi ? 'UTR दर्ज करें' : 'Enter UTR'}</h1>
          <p className="lede">
            {hi
              ? '12 अंकों का UTR नंबर आपके बैंक SMS या UPI ऐप की रसीद पर मिलता है।'
              : 'The 12-digit UTR (Unique Transaction Reference) is in your Bank SMS or UPI receipt.'}
          </p>
          <div className="mt-8">
            <label className="field-label" htmlFor="utr">UTR</label>
            <input
              id="utr"
              type="text"
              inputMode="numeric"
              maxLength={12}
              value={manualUtr}
              onChange={(e) => setManualUtr(e.target.value)}
              className="input-field"
              autoComplete="off"
            />
          </div>
          <div className="mt-5">
            <label className="field-label" htmlFor="amount">{hi ? 'राशि' : 'Amount'}</label>
            <input
              id="amount"
              type="number"
              value={manualAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={manualUtr.length < 10} className="btn-primary mt-8">
            {hi ? 'जारी रखें' : 'Continue'}
          </button>
        </form>
      )}
    </div>
  );
};
