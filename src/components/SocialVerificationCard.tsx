import React, { useState } from 'react';
import type { SocialIncident, Language } from '../types';
import { isValidSuspectUrl } from '../utils/sanitizers';
import { PersonProfileSummary } from './PersonProfileSummary';
import { CustomSelect } from './CustomSelect';

interface SocialVerificationCardProps {
  transaction: SocialIncident;
  currentLang: Language;
  onProceedToTakedown: (updatedTxn: SocialIncident) => void;
  onBackToIntake: () => void;
  isDispatched?: boolean;
  ackNumber?: string;
  onViewLiveTracker?: () => void;
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
  isDispatched = false,
  ackNumber,
  onViewLiveTracker,
}) => {
  const [formData, setFormData] = useState<SocialIncident>({ ...transaction });
  const [isEditing, setIsEditing] = useState(false);
  const hi = currentLang === 'hi';
  const canProceed = Boolean((formData.platform || '').trim()) && isValidSuspectUrl(formData.suspectUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDispatched && onViewLiveTracker) {
      onViewLiveTracker();
      return;
    }
    onProceedToTakedown(formData);
  };

  return (
    <div className="page-wrap page-stack flow-page">
      <p className="crumb">
        <button type="button" onClick={onBackToIntake}>{hi ? 'शिकायत' : 'Report'}</button>
        <span className="crumb-sep" aria-hidden="true">/</span>
        <span>{hi ? 'जाँच' : 'Check'}</span>
      </p>

      {isDispatched && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="anim-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate">
              {hi
                ? `धारा 79 नोटिस प्रेषित व केस सक्रिय है (${ackNumber || 'सक्रिय'})`
                : `Section 79 Notice Dispatched & Case Active (${ackNumber || 'Active'})`}
            </span>
          </div>
          {onViewLiveTracker && (
            <button
              type="button"
              onClick={onViewLiveTracker}
              className="live-status-link shrink-0 cursor-pointer"
            >
              <span>{hi ? 'लाइव स्थिति देखें' : 'View Live Status'}</span>
              <span className="link-arrow" aria-hidden="true">→</span>
            </button>
          )}
        </div>
      )}

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
              <p className="detail-value font-mono">{formData.suspectUrl || '-'}</p>
            )}
          </Field>

          <Field label={hi ? 'सामग्री' : 'Content type'}>
            {isEditing ? (
              <CustomSelect
                value={formData.contentType || 'FAKE_PROFILE'}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    contentType: val as SocialIncident['contentType'],
                  })
                }
                options={[
                  { value: 'FAKE_PROFILE', label: 'Fake profile / impersonation' },
                  { value: 'HARASSING_POST', label: 'Harassing / threatening post' },
                  { value: 'PRIVATE_IMAGES', label: 'Non-consensual private images' },
                  { value: 'HACKED_ACCOUNT', label: 'Hacked account' },
                ]}
                ariaLabel={hi ? 'सामग्री का प्रकार' : 'Content type'}
              />
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
            {isDispatched
              ? (hi ? 'लाइव ट्रैकर देखें' : 'View Live Tracker')
              : (hi ? 'आगे बढ़ें' : 'Continue')}
          </button>
          <button type="button" onClick={() => setIsEditing(!isEditing)} className="btn-secondary">
            {isEditing ? (hi ? 'सहेजें' : 'Save') : (hi ? 'विवरण बदलें' : 'Change details')}
          </button>
        </div>
      </form>
    </div>
  );
};
