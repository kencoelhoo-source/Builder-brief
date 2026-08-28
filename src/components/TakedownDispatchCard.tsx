import React, { useRef, useState, useEffect } from 'react';
import type { SocialIncident, Language, Sec79Payload } from '../types';
import { formatTimeRemaining } from '../utils/formatters';
import { getOrCreateSessionDeadline } from '../services/storageService';
import { isValidSuspectUrl } from '../utils/sanitizers';

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
  const [deadlineAt] = useState(() => getOrCreateSessionDeadline('takedown', 36 * 60 * 60));
  const [now, setNow] = useState(() => Date.now());
  const [isDispatching, setIsDispatching] = useState(false);
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const mountedRef = useRef(true);
  const hi = currentLang === 'hi';
  const secondsLeft = Math.max(0, Math.ceil((deadlineAt - now) / 1000));
  const canDispatch = Boolean((transaction.platform || '').trim() && isValidSuspectUrl(transaction.suspectUrl || ''));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleExecuteDispatch = async () => {
    if (!canDispatch) return;
    setIsDispatching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (!mountedRef.current) return;
      onDispatchComplete({
        ackNumber: `DEMO-SM-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
        takedownToken: `IT79-REQ-${Date.now().toString().slice(-8)}`,
        incidentTimestamp: transaction.timestamp,
        dispatchedAt: new Date().toISOString(),
        platform: transaction.platform,
        suspectUrl: transaction.suspectUrl,
        legalSection: 'Section 79 IT Act, 2000',
        priorityScore: 'P1_HIGH',
        status: 'NOTICE_SERVED',
        grievanceOfficerEmail: 'Verified platform contact unavailable in prototype',
      });
    } finally {
      if (mountedRef.current) setIsDispatching(false);
    }
  };

  return (
    <div className="page-wrap page-stack flow-page">
      <p className="crumb">
        <button type="button" onClick={onBack}>{hi ? 'जाँच' : 'Check'}</button>
        <span className="crumb-sep" aria-hidden="true">/</span>
        <span>{hi ? 'डेमो नोटिस' : 'Demo notice'}</span>
      </p>
      <div className="dossier-head">
        <header>
          <h1>{hi ? 'डेमो टेकडाउन नोटिस।' : 'Demo takedown notice.'}</h1>
          <p className="lede">
            {hi
              ? `${formatTimeRemaining(secondsLeft)} · धारा 79 IT Act · प्लेटफ़ॉर्म को मेल नहीं जाता।`
              : `${formatTimeRemaining(secondsLeft)} · Section 79 IT Act · No email is sent to the platform.`}
          </p>
        </header>
      </div>

      <div className="action-split">
        <article className="action-panel">
          <p className="field-label">{hi ? 'प्लेटफ़ॉर्म' : 'Platform'}</p>
          <p className="detail-value">{transaction.platform}</p>
          <p className="detail-meta">{transaction.suspectUrl}</p>
          <p className="detail-meta">
            {hi
              ? 'IT Act धारा 79(3)(b) के तहत अवैध सामग्री तक पहुँच बंद करने का अनुरोध — सिमुलेटेड।'
              : 'Simulated request to disable access under Section 79(3)(b) of the IT Act.'}
          </p>
        </article>
        <article className="action-panel">
          <p className="field-label">{hi ? 'आगे की कार्रवाई' : 'If they do not comply'}</p>
          <p className="detail-value" style={{ fontWeight: 500 }}>
            {hi
              ? 'आप स्थानीय साइबर सेल के लिए FIR ड्राफ्ट देख सकते हैं। यह बिल्ड उसे फाइल नहीं करता।'
              : 'You can preview an FIR draft for the local cyber cell. This build does not file it.'}
          </p>
        </article>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl border border-line bg-card mt-8 space-y-5">
        <div>
          <p className="font-semibold text-sm text-ink">
            {hi ? 'कानूनी कार्रवाई कैसे काम करती है?' : 'How this takedown notice works:'}
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
            {hi
              ? 'यह प्रोटोटाइप दिखाता है कि प्लेटफॉर्म शिकायत अधिकारी को अनुरोध कैसे भेजा जा सकता है। इस बिल्ड में कोई वास्तविक प्लेटफॉर्म कॉल नहीं होती।'
              : 'This prototype shows how a request could be routed to a platform grievance officer. This build does not contact a live platform.'}
          </p>
          <p className="mt-2 text-xs text-subtle">
            {hi ? 'प्रोटोटाइप नोट: ईमेल व एपीआई प्रेषण सिमुलेटेड है।' : 'Prototype note: Platform API & email dispatch is simulated for demonstration.'}
          </p>
        </div>

        <div className="btn-group pt-1">
          <button
            type="button"
            onClick={handleExecuteDispatch}
            disabled={isDispatching}
            className="btn-emergency"
          >
            {isDispatching
              ? hi
                ? 'भेजा जा रहा है…'
                : 'Sending…'
              : hi
              ? 'डेमो टेकडाउन नोटिस देखें'
              : 'Preview demo takedown notice'}
          </button>
          <button type="button" onClick={onBack} className="btn-secondary" disabled={isDispatching}>
            {hi ? 'पीछे' : 'Back'}
          </button>
        </div>
      </div>

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
