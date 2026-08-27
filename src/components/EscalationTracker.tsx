import React from 'react';
import type { SocialIncident, Language, Sec79Payload } from '../types';

interface EscalationTrackerProps {
  transaction: SocialIncident;
  payload: Sec79Payload;
  currentLang: Language;
  onGeneratePetition: () => void;
}

export const EscalationTracker: React.FC<EscalationTrackerProps> = ({
  transaction,
  payload,
  currentLang,
  onGeneratePetition,
}) => {
  const hi = currentLang === 'hi';

  return (
    <div className="page-wrap page-stack max-w-3xl">
      <p className="text-success font-bold">
        {hi ? 'नोटिस भेज दिया गया' : 'The notice has been sent'}
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mt-2">
        {hi ? 'टेकडाउन की स्थिति' : 'Takedown status'}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {payload.takedownToken} · {transaction.platform}
      </p>

      <ol className="mt-10 border-t border-line">
        <li className="py-5 border-b border-line">
          <p className="text-muted">1. {hi ? 'पूर्ण' : 'Done'}</p>
          <p className="font-bold text-lg mt-1">
            {hi ? 'Sec 79 नोटिस भेजा गया' : 'Section 79 notice dispatched'}
          </p>
          <p className="text-muted mt-1">
            {new Date(payload.dispatchedAt).toLocaleString('en-IN')}
          </p>
        </li>
        <li className="py-5 border-b border-line">
          <p className="text-muted">2. {hi ? 'चल रहा है' : 'In progress'}</p>
          <p className="font-bold text-lg mt-1">
            {hi ? 'प्लेटफ़ॉर्म समीक्षा' : 'Platform review'}
          </p>
          <p className="text-muted mt-1">
            {payload.grievanceOfficerEmail} · {hi ? '36 घंटे की अवधि सक्रिय' : '36-hour window is running'}
          </p>
        </li>
        <li className="py-5 border-b border-line">
          <p className="text-muted">3. {hi ? 'यदि आवश्यक हो' : 'If needed'}</p>
          <p className="font-bold text-lg mt-1">
            {hi ? 'FIR और पुलिस जाँच' : 'FIR and police investigation'}
          </p>
          <p className="text-muted mt-1">
            {hi
              ? 'यदि प्लेटफ़ॉर्म कार्रवाई न करे तो स्थानीय साइबर सेल को भेजा जाएगा।'
              : 'If the platform does not comply, this goes to the local cyber cell.'}
          </p>
        </li>
      </ol>

      <button type="button" onClick={onGeneratePetition} className="btn-primary mt-8">
        {hi ? 'FIR ड्राफ्ट तैयार करें' : 'Generate FIR draft'}
      </button>
    </div>
  );
};
