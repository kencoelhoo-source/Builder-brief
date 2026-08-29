import React, { useEffect, useState } from 'react';
import type { ExtractedTransaction, Language } from '../types';
import { formatINR } from '../utils/formatters';
import { isValidUTR, isValidVPA } from '../utils/sanitizers';
import { PersonProfileSummary } from './PersonProfileSummary';

interface ExtractedDetailsCardProps {
  transaction: ExtractedTransaction;
  currentLang: Language;
  onProceedToFreeze: (updatedTxn: ExtractedTransaction) => void;
  onBackToIntake: () => void;
}

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, hint, children }) => (
  <div className="detail-row">
    <p className="field-label">{label}</p>
    {children}
    {hint ? <p className="field-hint">{hint}</p> : null}
  </div>
);

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
  const canProceed = utrValid && vpaValid && formData.amount > 0;

  useEffect(() => {
    setFormData({ ...transaction });
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToFreeze(formData);
  };

  return (
    <div className="page-wrap page-stack flow-page">
      <p className="crumb">
        <button type="button" onClick={onBackToIntake}>{hi ? 'शिकायत' : 'Report'}</button>
        <span className="crumb-sep" aria-hidden="true">/</span>
        <span>{hi ? 'जाँच' : 'Check'}</span>
      </p>

      <header className="page-head">
        <h1>{hi ? 'ये विवरण जाँचें।' : 'Check these details.'}</h1>
        <p className="lede">
          {hi
            ? 'स्क्रीनशॉट से निकाली गई जानकारी सही है या नहीं, यहीं देखें।'
            : 'Confirm the numbers from the screenshot before you continue.'}
        </p>
      </header>

      <PersonProfileSummary
        profile={transaction.personProfile}
        perspective={transaction.casePerspective}
        currentLang={currentLang}
      />

      <form onSubmit={handleSubmit}>
        <div className="detail-sheet">
          <Field label={hi ? 'राशि' : 'Amount'}>
            {isEditing ? (
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="input-field"
              />
            ) : (
              <p className="detail-value">{formatINR(formData.amount)}</p>
            )}
          </Field>

          <Field
            label={hi ? 'पेमेंट आईडी (UTR)' : 'Payment ID (UTR)'}
            hint={hi
              ? 'UTR = Unique Transaction Reference. रसीद या बैंक SMS पर 12 अंक।'
              : 'UTR = Unique Transaction Reference. The 12-digit number on the receipt or bank SMS.'}
          >
            {isEditing ? (
              <input
                type="text"
                maxLength={12}
                value={formData.utr}
                onChange={(e) => setFormData({ ...formData, utr: e.target.value.trim() })}
                className={`input-field ${!utrValid ? 'border-[var(--danger)]' : ''}`}
              />
            ) : (
              <p className="detail-value font-mono">{formData.utr || '—'}</p>
            )}
          </Field>

          <Field
            label={hi ? 'संदिग्ध UPI ID (VPA)' : 'Suspect UPI ID (VPA)'}
            hint={hi
              ? 'VPA = Virtual Payment Address, जैसे name@oksbi — पैसे इसी पते पर गए।'
              : 'VPA = Virtual Payment Address, like name@oksbi — the UPI ID the money went to.'}
          >
            {isEditing ? (
              <input
                type="text"
                value={formData.beneficiaryVpa}
                onChange={(e) => setFormData({ ...formData, beneficiaryVpa: e.target.value.trim() })}
                className={`input-field ${!vpaValid ? 'border-[var(--danger)]' : ''}`}
              />
            ) : (
              <p className="detail-value font-mono">{formData.beneficiaryVpa || '—'}</p>
            )}
          </Field>

          <Field label={hi ? 'आपका बैंक' : 'Your bank'}>
            {isEditing ? (
              <input
                type="text"
                value={formData.remitterBank}
                onChange={(e) => setFormData({ ...formData, remitterBank: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="detail-value">{formData.remitterBank}</p>
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
              <p className="detail-value">{formData.beneficiaryBank}</p>
            )}
          </Field>

          <Field label={hi ? 'क्या हुआ' : 'What happened'}>
            {isEditing ? (
              <textarea
                rows={3}
                value={formData.incidentSummary}
                onChange={(e) => setFormData({ ...formData, incidentSummary: e.target.value })}
                className="input-field resize-none"
              />
            ) : (
              <p className="detail-value is-body">{formData.incidentSummary}</p>
            )}
            <p className="detail-meta">{formData.fraudCategoryLabel} · {formData.timestamp}</p>
          </Field>
        </div>

        {!canProceed && (
          <p className="mt-4 text-sm text-danger" role="alert">
            {hi
              ? 'आगे बढ़ने से पहले राशि, 12 अंकों का UTR और संदिग्ध UPI ID भरें।'
              : 'Fill amount, 12-digit UTR and suspect UPI ID before continuing.'}
          </p>
        )}

        <div className="btn-group flow-actions">
          <button type="submit" className="btn-primary" disabled={!canProceed}>
            {hi ? 'आगे बढ़ें' : 'Continue'}
          </button>
          <button type="button" onClick={() => setIsEditing(!isEditing)} className="btn-secondary">
            {isEditing ? (hi ? 'सहेजें' : 'Save') : (hi ? 'विवरण बदलें' : 'Change details')}
          </button>
        </div>
      </form>
    </div>
  );
};
