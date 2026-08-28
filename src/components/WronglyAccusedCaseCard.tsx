import React from 'react';
import { FileCheck2, PhoneCall, ShieldCheck } from 'lucide-react';
import type { FinancialIncident, Language } from '../types';
import { PersonProfileSummary } from './PersonProfileSummary';

interface WronglyAccusedCaseCardProps {
  transaction: FinancialIncident;
  currentLang: Language;
  onBackToIntake: () => void;
}

export const WronglyAccusedCaseCard: React.FC<WronglyAccusedCaseCardProps> = ({
  transaction,
  currentLang,
  onBackToIntake,
}) => {
  const hi = currentLang === 'hi';

  return (
    <div className="page-wrap page-stack flow-page">
      <p className="crumb">
        <button type="button" onClick={onBackToIntake}>{hi ? 'शिकायत' : 'Report'}</button>
        <span className="crumb-sep" aria-hidden="true">/</span>
        <span>{hi ? 'खाता समीक्षा' : 'Account review'}</span>
      </p>

      <header className="page-head">
        <h1>{hi ? 'खाता गलती से फ्रीज हुआ है।' : 'This account was frozen by mistake.'}</h1>
        <p className="lede">
          {hi
            ? 'यहाँ शिकायतकर्ता की तरह फ्रीज न भेजें। पहले बैंक से लिखित कारण मांगें।'
            : 'Do not send a victim-style freeze. Ask the bank for a written reason first.'}
        </p>
      </header>

      <PersonProfileSummary
        profile={transaction.personProfile}
        perspective={transaction.casePerspective}
        currentLang={currentLang}
      />

      <div className="detail-sheet">
        <div className="detail-row">
          <p className="field-label">{hi ? 'बैंक' : 'Bank'}</p>
          <p className="detail-value">{transaction.remitterBank}</p>
        </div>
        <div className="detail-row">
          <p className="field-label">{hi ? 'खाता' : 'Account'}</p>
          <p className="detail-value font-mono">{transaction.remitterAccount}</p>
        </div>
      </div>

      <div className="case-response-grid">
        <section className="case-response-card">
          <div className="case-response-icon"><PhoneCall size={18} /></div>
          <div>
            <p className="case-response-step">{hi ? '1 · अभी' : '1 · First'}</p>
            <h2>{hi ? 'बैंक से लिखित कारण मांगें' : 'Ask the bank for a written reason'}</h2>
            <p>{hi ? 'केस नंबर, फ्रीज की तारीख और समीक्षा चैनल पूछें।' : 'Ask for the case number, freeze date, and the review channel.'}</p>
          </div>
        </section>
        <section className="case-response-card">
          <div className="case-response-icon"><FileCheck2 size={18} /></div>
          <div>
            <p className="case-response-step">{hi ? '2 · सबूत' : '2 · Evidence'}</p>
            <h2>{hi ? 'वैध लेनदेन का रिकॉर्ड रखें' : 'Keep proof of legitimate activity'}</h2>
            <p>{hi ? 'स्टेटमेंट, KYC और इनवॉइस सुरक्षित रखें।' : 'Keep statements, KYC and invoices.'}</p>
          </div>
        </section>
        <section className="case-response-card">
          <div className="case-response-icon"><ShieldCheck size={18} /></div>
          <div>
            <p className="case-response-step">{hi ? '3 · सुरक्षित रहें' : '3 · Stay safe'}</p>
            <h2>{hi ? 'अनफ्रीज के लिए पैसे न दें' : 'Never pay to get unfrozen'}</h2>
            <p>{hi ? 'OTP, PIN या स्क्रीन-शेयर न दें।' : 'Do not share an OTP, PIN, or your screen.'}</p>
          </div>
        </section>
      </div>

      <div className="btn-group flow-actions">
        <button type="button" className="btn-secondary" onClick={onBackToIntake}>
          {hi ? 'मॉक केस बदलें' : 'Choose another case'}
        </button>
      </div>
    </div>
  );
};
