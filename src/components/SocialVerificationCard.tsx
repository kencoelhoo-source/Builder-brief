import React, { useState } from 'react';
import type { SocialIncident, Language } from '../types';

interface SocialVerificationCardProps {
  transaction: SocialIncident;
  currentLang: Language;
  onProceedToTakedown: (updatedTxn: SocialIncident) => void;
  onBackToIntake: () => void;
}

export const SocialVerificationCard: React.FC<SocialVerificationCardProps> = ({
  transaction,
  currentLang,
  onProceedToTakedown,
  onBackToIntake,
}) => {
  const [formData, setFormData] = useState<SocialIncident>({ ...transaction });
  const [isEditing, setIsEditing] = useState(false);
  const hi = currentLang === 'hi';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToTakedown(formData);
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
          ? 'धारा 79 टेकडाउन नोटिस भेजने से पहले इन्हें सही करें।'
          : 'Correct anything that looks wrong before the Section 79 notice is sent.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <Field label={hi ? 'प्लेटफ़ॉर्म' : 'Platform'}>
          {isEditing ? (
            <input
              type="text"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="input-field max-w-sm"
            />
          ) : (
            <p className="text-2xl font-bold">{formData.platform}</p>
          )}
          <p className="text-muted mt-1">{formData.fraudCategoryLabel} · {formData.timestamp}</p>
        </Field>

        <Field label={hi ? 'संदिग्ध प्रोफाइल' : 'Suspect profile URL'}>
          {isEditing ? (
            <input
              type="text"
              value={formData.suspectUrl}
              onChange={(e) => setFormData({ ...formData, suspectUrl: e.target.value.trim() })}
              className="input-field"
            />
          ) : (
            <p className="text-lg break-all">{formData.suspectUrl}</p>
          )}
        </Field>

        <Field label={hi ? 'सामग्री का प्रकार' : 'Content type'}>
          {isEditing ? (
            <select
              value={formData.contentType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contentType: e.target.value as SocialIncident['contentType'],
                })
              }
              className="input-field max-w-md"
            >
              <option value="FAKE_PROFILE">Fake profile / impersonation</option>
              <option value="HARASSING_POST">Harassing / threatening post</option>
              <option value="PRIVATE_IMAGES">Non-consensual private images</option>
              <option value="HACKED_ACCOUNT">Hacked account</option>
            </select>
          ) : (
            <p className="text-lg">{formData.contentType.replace(/_/g, ' ')}</p>
          )}
        </Field>

        <Field label={hi ? 'शिकायतकर्ता' : 'Complainant'}>
          <p className="text-lg">{formData.victimName}</p>
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
          <button type="submit" className="btn-emergency">
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
