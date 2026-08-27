import React, { useState, useEffect } from 'react';
import type { SocialIncident, Language, Sec79Payload } from '../types';
import { formatTimeRemaining } from '../utils/formatters';

interface TakedownDispatchCardProps {
  transaction: SocialIncident;
  currentLang: Language;
  onDispatchComplete: (payload: Sec79Payload) => void;
  onBack: () => void;
}

export const TakedownDispatchCard: React.FC<TakedownDispatchCardProps> = ({
  transaction,
  currentLang,
  onDispatchComplete,
  onBack,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(7200);
  const [isDispatching, setIsDispatching] = useState(false);
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const hi = currentLang === 'hi';

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExecuteDispatch = async () => {
    setIsDispatching(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onDispatchComplete({
      ackNumber: `NCRP-SM-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
      takedownToken: `IT79-REQ-${Date.now().toString().slice(-8)}`,
      incidentTimestamp: transaction.timestamp,
      dispatchedAt: new Date().toISOString(),
      platform: transaction.platform,
      suspectUrl: transaction.suspectUrl,
      legalSection: 'Section 79 IT Act, 2000',
      priorityScore: 'P1_HIGH',
      status: 'NOTICE_SERVED',
      grievanceOfficerEmail: `nodal.officer@${transaction.platform.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    });
  };

  return (
    <div className="page-wrap page-stack max-w-3xl">
      <p className="mb-6">
        <button type="button" className="btn-link" onClick={onBack}>
          {hi ? '← वापस' : '← Back'}
        </button>
      </p>
      <h1 className="text-3xl md:text-4xl font-bold">
        {hi ? 'टेकडाउन नोटिस भेजें' : 'Send the takedown notice'}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {hi
          ? `${formatTimeRemaining(secondsLeft)} शेष · धारा 79 IT Act`
          : `${formatTimeRemaining(secondsLeft)} remaining · Section 79 IT Act`}
      </p>

      <div className="mt-8 py-5 border-t border-line">
        <p className="field-label">{hi ? 'प्लेटफ़ॉर्म' : 'Platform'}</p>
        <p className="text-lg font-bold">{transaction.platform}</p>
        <p className="mt-2 break-all">{transaction.suspectUrl}</p>
        <p className="text-muted mt-3">
          {hi
            ? 'IT Act धारा 79(3)(b) के तहत अवैध सामग्री तक पहुँच तत्काल बंद करें।'
            : 'Disable access to the unlawful content under Section 79(3)(b) of the IT Act, 2000.'}
        </p>
      </div>

      <div className="py-5 border-t border-line">
        <p className="field-label">{hi ? 'आगे की कार्रवाई' : 'If they do not comply'}</p>
        <p className="text-lg">
          {hi
            ? 'स्थानीय साइबर सेल के लिए FIR ड्राफ्ट तैयार किया जाएगा।'
            : 'An FIR draft will be prepared for the local cyber crime police station.'}
        </p>
      </div>

      <p className="notice mt-6 text-sm text-muted">
        {hi
          ? 'मध्यस्थों को 36 घंटे में कार्रवाई करनी होती है। इस प्रोटोटाइप में भेजना सिमुलेटेड है।'
          : 'Intermediaries must act within 36 hours of actual knowledge. Dispatch in this prototype is simulated.'}
      </p>

      <button
        type="button"
        onClick={handleExecuteDispatch}
        disabled={isDispatching}
        className="btn-emergency mt-8"
      >
        {isDispatching
          ? hi
            ? 'भेजा जा रहा है…'
            : 'Sending…'
          : hi
          ? 'टेकडाउन नोटिस जारी करें'
          : 'Issue takedown notice'}
      </button>

      <p className="mt-6">
        <button type="button" className="btn-link" onClick={() => setShowJsonPayload(!showJsonPayload)}>
          {showJsonPayload
            ? hi
              ? 'पेलोड छिपाएँ'
              : 'Hide payload'
            : hi
            ? 'तकनीकी पेलोड देखें'
            : 'View technical payload'}
        </button>
      </p>
      {showJsonPayload && (
        <pre className="mt-4 p-4 text-sm overflow-x-auto border border-line">
          {JSON.stringify(
            {
              protocol: 'IT_ACT_SEC79_TAKEDOWN',
              priority: 'P1_HIGH',
              platform: transaction.platform,
              suspect_url: transaction.suspectUrl,
              content_type: transaction.contentType,
              statutory_act: 'Sec 79 IT Act, 2000',
            },
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
};
