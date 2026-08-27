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
    <div className="page-wrap page-stack">
      {panel !== 'home' && (
        <p className="mb-6">
          <button type="button" className="btn-link" onClick={() => setPanel('home')}>
            {hi ? '← वापस' : '← Back'}
          </button>
        </p>
      )}

      {panel === 'home' && (
        <div className="panel-enter">
          <p className="eyebrow">{hi ? 'गोल्डन ऑवर' : 'Golden hour'}</p>
          <h1 className="text-4xl md:text-[2.75rem] font-semibold max-w-2xl">
            {hi ? 'साइबर अपराध की रिपोर्ट करें' : 'Report a cybercrime'}
          </h1>
          <p className="mt-5 text-lg text-muted max-w-2xl">
            {hi
              ? 'भुगतान या फर्जी प्रोफाइल का स्क्रीनशॉट अपलोड करें। यह सेवा विवरण निकालकर बैंक फ्रीज या टेकडाउन नोटिस तैयार करती है। इसमें लगभग 2 मिनट लगते हैं।'
              : 'Upload a screenshot of the payment or fake profile. This service extracts the details and prepares a bank freeze or a takedown notice. It takes about 2 minutes.'}
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
            className={`dropzone mt-8 max-w-2xl ${isDragOver ? 'is-over' : ''}`}
          >
            {isLoading ? (
              <p className="font-bold text-lg">{hi ? 'स्कैन हो रहा है…' : 'Reading the screenshot…'}</p>
            ) : (
              <>
                <Upload size={22} strokeWidth={1.75} className="mx-auto mb-3 text-muted" />
                <p className="font-bold text-lg">
                  {hi ? 'स्क्रीनशॉट अपलोड करें' : 'Upload a screenshot'}
                </p>
                <p className="text-muted mt-1">
                  {hi ? 'GPay, Paytm, SMS, Instagram या Facebook' : 'GPay, Paytm, SMS, Instagram or Facebook'}
                </p>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <button
              type="button"
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {hi ? 'अभी शुरू करें' : 'Start now'}
            </button>
            <a href="tel:1930" className="btn-link">
              {hi ? 'अभी हो रहा है? 1930 पर कॉल करें' : 'Happening now? Call 1930'}
            </a>
          </div>

          <p className="mt-8 text-muted">
            {hi ? 'अन्य तरीके: ' : 'Other ways to report: '}
            <button type="button" className="btn-link" onClick={() => setPanel('voice')}>
              {hi ? 'बोलकर' : 'by voice'}
            </button>
            {' · '}
            <button type="button" className="btn-link" onClick={() => setPanel('manual')}>
              {hi ? 'UTR नंबर से' : 'with a UTR number'}
            </button>
          </p>

          <hr className="section-rule" />

          <h2 className="text-xl font-bold">
            {hi ? 'समीक्षकों के लिए नमूना मामले' : 'Sample cases for reviewers'}
          </h2>
          <p className="text-muted mt-2 mb-2">
            {hi
              ? 'पूरी यात्रा देखने के लिए एक मामला चुनें। डेटा सिंथेटिक है।'
              : 'Pick a case to walk the full journey. The data is synthetic.'}
          </p>
          <ul className="sample-list">
            {MOCK_PERSONAS.map((persona: FraudPersona) => (
              <li key={persona.id}>
                <button type="button" onClick={() => onSelectPreset(persona.id)} disabled={isLoading}>
                  <span className="title">{hi ? persona.nameHi : persona.name}</span>
                  <span className="meta block">
                    {persona.incidentType === 'FINANCIAL'
                      ? `${persona.utr ?? ''} · ₹${(persona.amount ?? 0).toLocaleString('en-IN')}`
                      : persona.platform}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {panel === 'voice' && (
        <div className="panel-enter max-w-2xl">
          <h1 className="text-3xl font-bold">
            {hi ? 'बोलकर रिपोर्ट करें' : 'Report by voice'}
          </h1>
          <p className="mt-4 text-muted text-lg">
            {hi
              ? 'उदाहरण: “गूगल पे पर पैसे कट गए” या “इंस्टाग्राम पर फर्जी प्रोफाइल है”।'
              : 'For example: “I lost money on GPay” or “Someone made a fake Instagram profile”.'}
          </p>
          <button
            type="button"
            onClick={handleToggleVoice}
            className={isListening ? 'btn-emergency mt-8' : 'btn-primary mt-8'}
          >
            <Mic size={18} strokeWidth={1.75} />
            {isListening
              ? hi
                ? 'रोकें और जमा करें'
                : 'Stop and submit'
              : hi
              ? 'रिकॉर्डिंग शुरू करें'
              : 'Start recording'}
          </button>
          {spokenText && (
            <p className="mt-6 text-lg">{spokenText}</p>
          )}
        </div>
      )}

      {panel === 'manual' && (
        <form onSubmit={handleManualFormSubmit} className="panel-enter max-w-xl">
          <h1 className="text-3xl font-bold">
            {hi ? 'UTR नंबर दर्ज करें' : 'Enter a UTR number'}
          </h1>
          <p className="mt-4 text-muted text-lg">
            {hi
              ? 'यदि आपके पास 12-अंकीय लेनदेन संदर्भ है।'
              : 'Use this if you already have the 12-digit transaction reference.'}
          </p>
          <div className="mt-8">
            <label className="field-label" htmlFor="utr">
              {hi ? 'UTR' : 'UTR'}
            </label>
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
          <div className="mt-6">
            <label className="field-label" htmlFor="amount">
              {hi ? 'राशि (₹)' : 'Amount (₹)'}
            </label>
            <input
              id="amount"
              type="number"
              value={manualAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              className="input-field"
              placeholder="25000"
            />
          </div>
          <button
            type="submit"
            disabled={manualUtr.length < 10}
            className="btn-primary mt-8"
          >
            {hi ? 'जारी रखें' : 'Continue'}
          </button>
        </form>
      )}
    </div>
  );
};
