import React from 'react';
import { UserCheck, ShieldAlert } from 'lucide-react';
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
    <section className="mb-5 p-4 sm:p-5 rounded-2xl border border-line bg-card shadow-2xs" aria-labelledby="case-profile-title">
      <div className="flex items-center justify-between gap-3 flex-wrap pb-3.5 border-b border-line/60">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted m-0 p-0 leading-none">
            {hi ? 'सत्यापित नागरिक' : 'Verified Person'}
          </p>
          <h2 id="case-profile-title" className="text-base sm:text-lg font-extrabold text-ink tracking-tight mt-1.5 m-0 p-0 leading-tight truncate">
            {profile.fullName}
          </h2>
        </div>

        {/* Enhanced High-Contrast Status Pill */}
        {isWronglyAccused ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/25 dark:border-rose-400/25 text-rose-700 dark:text-rose-300 shadow-2xs shrink-0 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <ShieldAlert size={13} className="shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{hi ? 'गलत आरोप' : 'Wrongly accused'}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/25 dark:border-emerald-400/25 text-emerald-700 dark:text-emerald-300 shadow-2xs shrink-0 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <UserCheck size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{hi ? 'शिकायतकर्ता' : 'Reporting victim'}</span>
          </span>
        )}
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-3.5 m-0 p-0">
        <div>
          <dt className="text-[11px] font-semibold text-muted">{hi ? 'उम्र / लिंग' : 'Age / Gender'}</dt>
          <dd className="text-xs sm:text-sm font-bold text-ink mt-0.5 m-0">{profile.age} · {profile.gender}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold text-muted">{hi ? 'पेशा' : 'Occupation'}</dt>
          <dd className="text-xs sm:text-sm font-bold text-ink mt-0.5 m-0">{profile.occupation}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold text-muted">{hi ? 'मोबाइल' : 'Mobile'}</dt>
          <dd className="text-xs sm:text-sm font-bold text-ink mt-0.5 m-0">{profile.mobile}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-[11px] font-semibold text-muted">{hi ? 'स्थान' : 'Location'}</dt>
          <dd className="text-xs sm:text-sm font-bold text-ink mt-0.5 m-0 break-words">{profile.city}, {profile.state}</dd>
        </div>
        <div className="col-span-2 sm:col-span-3 lg:col-span-4 pt-2 border-t border-line/40">
          <dt className="text-[11px] font-semibold text-muted">{hi ? 'पूरा पता' : 'Full Address'}</dt>
          <dd className="text-xs sm:text-sm font-medium text-ink/90 mt-0.5 m-0 break-words leading-relaxed">
            {profile.address}, {profile.city}, {profile.state} - {profile.postalCode}
          </dd>
        </div>
      </dl>
    </section>
  );
};
