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
          ? 'धारा 79 IT Act टेकडाउन नोटिस भेजने से पहले संदिग्ध प्रोफ़ाइल लिंक व विवरण की पुष्टि करें।'
          : 'Verify the suspect URL and incident category before dispatching the formal Section 79 IT Act takedown demand.'}
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

        <div className="notice mt-6 text-sm text-muted">
          <p className="font-semibold text-ink">
            {hi ? 'कानूनी प्रावधान:' : 'Statutory Mandate:'}
          </p>
          <p className="mt-1">
            {hi
              ? 'IT नियम 2021 के अनुसार सोशल मीडिया प्लेटफॉर्म नोटिस प्राप्त होने के 36 घंटे के भीतर अवैध सामग्री हटाने के लिए बाध्य हैं।'
              : 'Under IT Rules 2021, social media intermediaries are legally obligated to act within 36 hours of receipt of notice.'}
          </p>
        </div>

        <div className="btn-group mt-8">
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
          <button type="button" onClick={onBackToIntake} className="btn-link sm:ml-4">
            {hi ? '← वापस' : '← Back'}
          </button>
        </div>
      </form>
    </div>
  );
};
