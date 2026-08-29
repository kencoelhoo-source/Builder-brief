import React, { useState } from 'react';
import type { SocialIncident, Language } from '../types';
import { isValidSuspectUrl } from '../utils/sanitizers';
import { PersonProfileSummary } from './PersonProfileSummary';

interface SocialVerificationCardProps {
  transaction: SocialIncident;
  currentLang: Language;
  onProceedToTakedown: (updatedTxn: SocialIncident) => void;
  onBackToIntake: () => void;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, children }) => (
  <div className="detail-row">
    <p className="field-label">{label}</p>
    {children}
  </div>
);

export const SocialVerificationCard: React.FC<SocialVerificationCardProps> = ({
  transaction,
  currentLang,
  onProceedToTakedown,
  onBackToIntake,
}) => {
  const [formData, setFormData] = useState<SocialIncident>({ ...transaction });
  const [isEditing, setIsEditing] = useState(false);
  const hi = currentLang === 'hi';
  const canProceed = Boolean((formData.platform || '').trim()) && isValidSuspectUrl(formData.suspectUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToTakedown(formData);
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
            ? 'प्रोफ़ाइल लिंक सही है, यह यहीं देख लें। यह साइट प्लेटफ़ॉर्म को मेल नहीं भेजती।'
            : 'Confirm the profile link. This site does not email the platform.'}
        </p>
      </header>

      <PersonProfileSummary
        profile={transaction.personProfile}
        perspective={transaction.casePerspective}
        currentLang={currentLang}
      />

      <form onSubmit={handleSubmit}>
        <div className="detail-sheet">
          <Field label={hi ? 'प्लेटफ़ॉर्म' : 'Platform'}>
            {isEditing ? (
              <input
                type="text"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="detail-value">{formData.platform}</p>
            )}
          </Field>

          <Field label={hi ? 'प्रोफाइल लिंक' : 'Profile link'}>
            {isEditing ? (
              <input
                type="text"
                value={formData.suspectUrl}
                onChange={(e) => setFormData({ ...formData, suspectUrl: e.target.value.trim() })}
                className="input-field"
              />
            ) : (
              <p className="detail-value font-mono">{formData.suspectUrl || '—'}</p>
            )}
          </Field>

          <Field label={hi ? 'सामग्री' : 'Content type'}>
            {isEditing ? (
              <select
                value={formData.contentType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contentType: e.target.value as SocialIncident['contentType'],
                  })
                }
                className="input-field"
              >
                <option value="FAKE_PROFILE">Fake profile / impersonation</option>
                <option value="HARASSING_POST">Harassing / threatening post</option>
                <option value="PRIVATE_IMAGES">Non-consensual private images</option>
                <option value="HACKED_ACCOUNT">Hacked account</option>
              </select>
            ) : (
              <p className="detail-value">{(formData.contentType || 'CONTENT').replace(/_/g, ' ')}</p>
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
              ? 'आगे बढ़ने से पहले प्लेटफ़ॉर्म और http/https प्रोफाइल लिंक भरें।'
              : 'Enter the platform and a valid http/https profile link before continuing.'}
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
