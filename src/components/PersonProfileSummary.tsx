import React from 'react';
import type { CasePerspective, Language, MockPersonProfile } from '../types';

interface PersonProfileSummaryProps {
  profile?: MockPersonProfile;
  perspective?: CasePerspective;
  currentLang: Language;
}

export const PersonProfileSummary: React.FC<PersonProfileSummaryProps> = ({
  profile,
  perspective = 'REPORTING_VICTIM',
  currentLang,
}) => {
  if (!profile) return null;
  const hi = currentLang === 'hi';
  const isWronglyAccused = perspective === 'WRONGLY_ACCUSED';

  return (
    <section className="profile-card" aria-labelledby="case-profile-title">
      <div className="profile-card-head">
        <div>
          <p className="profile-card-kicker">{hi ? 'व्यक्ति' : 'Person'}</p>
          <h2 id="case-profile-title">{profile.fullName}</h2>
        </div>
        <span className={`profile-card-pill ${isWronglyAccused ? 'is-warning' : ''}`}>
          {isWronglyAccused
            ? hi ? 'गलत आरोप' : 'Wrongly accused'
            : hi ? 'शिकायतकर्ता' : 'Reporting victim'}
        </span>
      </div>
      <dl className="profile-card-grid">
        <div>
          <dt>{hi ? 'उम्र / लिंग' : 'Age / gender'}</dt>
          <dd>{profile.age} · {profile.gender}</dd>
        </div>
        <div>
          <dt>{hi ? 'काम' : 'Occupation'}</dt>
          <dd>{profile.occupation}</dd>
        </div>
        <div>
          <dt>{hi ? 'मोबाइल' : 'Mobile'}</dt>
          <dd>{profile.mobile}</dd>
        </div>
        <div className="profile-card-wide">
          <dt>{hi ? 'पता' : 'Address'}</dt>
          <dd>{profile.address}, {profile.city}, {profile.state} — {profile.postalCode}</dd>
        </div>
      </dl>
    </section>
  );
};
