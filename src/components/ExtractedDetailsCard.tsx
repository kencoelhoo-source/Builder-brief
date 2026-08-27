import React, { useState } from 'react';
import type { ExtractedTransaction, Language } from '../types';
import { formatINR } from '../utils/formatters';
import { isValidUTR, isValidVPA } from '../utils/sanitizers';

interface ExtractedDetailsCardProps {
  transaction: ExtractedTransaction;
  currentLang: Language;
  onProceedToFreeze: (updatedTxn: ExtractedTransaction) => void;
  onBackToIntake: () => void;
}

export const ExtractedDetailsCard: React.FC<ExtractedDetailsCardProps> = ({
  transaction,
  currentLang,
  onProceedToFreeze,
  onBackToIntake,
}) => {
  const [formData, setFormData] = useState<ExtractedTransaction>({ ...transaction });
  const [isEditing, setIsEditing] = useState(false);
  const hi = currentLang === 'hi';
  const utrValid = isValidUTR(formData.utr);
  const vpaValid = isValidVPA(formData.beneficiaryVpa);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToFreeze(formData);
  };

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="py-5 border-b border-line">
      <p className="field-label">{label}</p>
      {children}
    </div>
  );

  return (
    <div className="page-wrap page-stack max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold">
        {hi ? 'विवरण जाँचें' : 'Check these details'}
      </h1>
      <p className="mt-4 text-lg text-muted max-w-2xl">
        {hi
          ? 'फ्रीज नोटिस भेजने से पहले इन्हें सही करें।'
          : 'Correct anything that looks wrong before the freeze notice is sent.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <Field label={hi ? 'राशि' : 'Amount'}>
          {isEditing ? (
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="input-field max-w-xs"
            />
          ) : (
            <p className="text-2xl font-bold">{formatINR(formData.amount)}</p>
          )}
          <p className="text-muted mt-1">{formData.fraudCategoryLabel} · {formData.timestamp}</p>
        </Field>

        <Field label={hi ? 'UTR' : 'UTR'}>
          {isEditing ? (
            <input
              type="text"
              maxLength={12}
              value={formData.utr}
              onChange={(e) => setFormData({ ...formData, utr: e.target.value.trim() })}
              className={`input-field max-w-sm ${!utrValid ? 'border-[var(--danger)]' : ''}`}
            />
          ) : (
            <p className="text-lg font-mono">{formData.utr}</p>
          )}
        </Field>

        <Field label={hi ? 'संदिग्ध VPA' : 'Suspect VPA'}>
          {isEditing ? (
            <input
              type="text"
              value={formData.beneficiaryVpa}
              onChange={(e) => setFormData({ ...formData, beneficiaryVpa: e.target.value.trim() })}
              className={`input-field ${!vpaValid ? 'border-[var(--danger)]' : ''}`}
            />
          ) : (
            <p className="text-lg font-mono break-all">{formData.beneficiaryVpa}</p>
          )}
        </Field>

        <Field label={hi ? 'शिकायतकर्ता का बैंक' : 'Your bank'}>
          {isEditing ? (
            <input
              type="text"
              value={formData.remitterBank}
              onChange={(e) => setFormData({ ...formData, remitterBank: e.target.value })}
              className="input-field"
            />
          ) : (
            <p className="text-lg">{formData.remitterBank}</p>
          )}
        </Field>

        <Field label={hi ? 'संदिग्ध का बैंक' : 'Suspect bank'}>
          {isEditing ? (
            <input
              type="text"
              value={formData.beneficiaryBank}
              onChange={(e) => setFormData({ ...formData, beneficiaryBank: e.target.value })}
              className="input-field"
            />
          ) : (
            <p className="text-lg">{formData.beneficiaryBank}</p>
          )}
        </Field>

        <Field label={hi ? 'घटना' : 'What happened'}>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.incidentSummary}
              onChange={(e) => setFormData({ ...formData, incidentSummary: e.target.value })}
              className="input-field resize-none"
            />
          ) : (
            <p className="text-lg leading-relaxed">{formData.incidentSummary}</p>
          )}
        </Field>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button type="submit" className="btn-primary">
            {hi ? 'जारी रखें' : 'Continue'}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
          >
            {isEditing ? (hi ? 'सहेजें' : 'Save') : (hi ? 'बदलें' : 'Change details')}
          </button>
          <button type="button" onClick={onBackToIntake} className="btn-link self-center">
            {hi ? '← वापस' : '← Back'}
          </button>
        </div>
      </form>
    </div>
  );
};
