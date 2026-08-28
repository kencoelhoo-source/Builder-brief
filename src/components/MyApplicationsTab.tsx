import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, Clock, FileText, Scale } from 'lucide-react';
import type { CyberIncident, CFCFRMSPayload, Sec79Payload, Language } from '../types';
import { formatINR } from '../utils/formatters';
import { getBankNodalOfficer } from '../data/bankNodalDirectory';
import { copyText } from '../utils/browser';

interface MyApplicationsTabProps {
  transaction: CyberIncident;
  payload: CFCFRMSPayload | Sec79Payload;
  currentLang: Language;
  onOpenCourtPetition: () => void;
  onViewReceipt: () => void;
}

export const MyApplicationsTab: React.FC<MyApplicationsTabProps> = ({
  transaction,
  payload,
  currentLang,
  onOpenCourtPetition,
  onViewReceipt,
}) => {
  const hi = currentLang === 'hi';
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Live countdown timer for Tier 2 Auto-Escalation SLA
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dispatchedAt = Date.parse(payload.dispatchedAt);
  const escalationDeadline = Number.isFinite(dispatchedAt)
    ? dispatchedAt + 24 * 60 * 60 * 1000
    : now;
  const secondsRemaining = Math.max(0, Math.ceil((escalationDeadline - now) / 1000));

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const isFinancial = transaction.incidentType === 'FINANCIAL';
  const cfcfrms = isFinancial ? (payload as CFCFRMSPayload) : null;
  const sec79 = !isFinancial ? (payload as Sec79Payload) : null;

  const ackNumber = cfcfrms?.ackNumber || sec79?.ackNumber || 'DEMO-CASE';
  const officer = isFinancial
    ? getBankNodalOfficer(transaction.beneficiaryBank)
    : {
        bankName: transaction.platform,
        nodalEmail: (sec79?.grievanceOfficerEmail) || 'Verified platform contact unavailable',
        escalationEmail: 'Production integration required',
        cyberCellHead: 'Designated Appellate Officer',
        jurisdiction: 'National Cyber Crime Command',
      };

  const handleCopy = () => {
    void copyText(ackNumber).then((ok) => {
      if (!ok) return;
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Case Overview Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-line bg-card shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="anim-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {hi ? 'प्रोटोटाइप केस (सिमुलेशन)' : 'Prototype Case (Simulation)'}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl sm:text-2xl font-mono font-bold text-ink tracking-tight">
                {ackNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-icon !w-8 !h-8 text-muted hover:text-ink transition-transform active:scale-95"
                title={hi ? 'पावती नंबर कॉपी करें' : 'Copy Acknowledgment Number'}
                aria-label="Copy Acknowledgment"
              >
                {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
              </button>
            </div>

            <p className="text-xs text-muted mt-1">
              {transaction.victimName} · {isFinancial ? `${formatINR(transaction.amount)} · ${transaction.remitterBank}` : transaction.platform} · {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          {/* Demo countdown derived from the dispatch timestamp */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-soft border border-line flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 anim-live-glow">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                 {hi ? 'डेमो स्तर 2 टाइमर' : 'Demo Level 2 Timer'}
              </p>
              <p className="text-base font-mono font-bold text-ink mt-0.5">
                {formatCountdown(secondsRemaining)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Animated Escalation Timeline */}
      <div className="p-5 sm:p-6 rounded-2xl border border-line bg-card shadow-sm">
        <h3 className="text-base font-bold text-ink">
          {hi ? 'सिमुलेटेड एस्केलेशन सीढ़ी' : 'Simulated Escalation Ladder'}
        </h3>
        <p className="text-xs text-muted mt-1">
            {hi
              ? 'यह प्रोटोटाइप दिखाता है कि समयबद्ध एस्केलेशन कैसे व्यवस्थित की जा सकती है:'
              : 'This prototype shows how a time-bound escalation plan could be organized:'}
        </p>

        <div className="mt-6 escalation-timeline">
          {/* Level 1: Immediate Nodal Dispatch */}
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 pb-4">
            <div className="flex flex-col items-center self-stretch flex-shrink-0 w-7 sm:w-8">
              <div className="escalation-node escalation-node-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 mt-2">
                1
              </div>
            </div>
            <div className="escalation-card escalation-card-1 flex-1 p-4 rounded-xl min-w-0">
              <div className="escalation-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 1: नोडल अधिकारी (डेमो)' : 'Level 1: Nodal Officer (Demo)'}
                </p>
                <span className="escalation-status escalation-status-1 text-[11px] font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto">
                  {hi ? '✓ डेमो तैयार' : '✓ Demo ready'}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5 break-all">
                {officer?.bankName || 'Verified contact unavailable'} · <strong className="text-ink">{officer?.nodalEmail || 'Production integration required'}</strong>
              </p>
              <p className="text-xs text-muted mt-1">
                {hi
                  ? 'डेमो निर्देश दिखाया गया है; कोई लाइव लियन या टेकडाउन जारी नहीं हुआ।'
                  : 'A prototype directive is shown for review; no live lien or takedown was issued.'}
              </p>
            </div>
          </div>

          {/* Level 2: CISO & Senior Risk Desk */}
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 pb-4">
            <div className="flex flex-col items-center self-stretch flex-shrink-0 w-7 sm:w-8">
              <div className="escalation-node escalation-node-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 mt-2">
                2
              </div>
            </div>
            <div className="escalation-card escalation-card-2 flex-1 p-4 rounded-xl min-w-0">
              <div className="escalation-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 2: वरिष्ठ जोखिम डेस्क (24 घंटे)' : 'Level 2: Senior Risk Desk (24 Hours)'}
                </p>
                <span className="escalation-status escalation-status-2 text-[11px] font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto">
                  {hi ? 'डेमो टाइमर' : 'Demo timer'}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5 break-all">
                {officer?.cyberCellHead || 'Verified escalation contact unavailable'} · <span className="font-mono text-ink">{officer?.escalationEmail || 'Production integration required'}</span>
              </p>
              <p className="text-xs text-muted mt-1">
                {hi
                  ? 'यदि नोडल अधिकारी 24 घंटे में पुष्टि नहीं करते, तो गैर-अनुपालन नोटिस सीधे CISO को भेजा जाएगा।'
                  : 'A production system could notify the appropriate escalation desk if unacknowledged in 24h.'}
              </p>
            </div>
          </div>

          {/* Level 3: RBI Ombudsman & Cyber SP */}
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 pb-4">
            <div className="flex flex-col items-center self-stretch flex-shrink-0 w-7 sm:w-8">
              <div className="escalation-node escalation-node-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 mt-2">
                3
              </div>
            </div>
            <div className="escalation-card escalation-card-3 flex-1 p-4 rounded-xl min-w-0">
              <div className="escalation-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 3: नियामक एवं साइबर पुलिस (72 घंटे)' : 'Level 3: Regulator & Cyber Police (72 Hours)'}
                </p>
                <span className="escalation-status escalation-status-3 text-[11px] font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto">
                {hi ? 'संभावित अगला मार्ग' : 'Possible next route'}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                {officer?.jurisdiction || (hi ? 'क्षेत्रीय संपर्क उपलब्ध नहीं' : 'Regional contact unavailable')}
              </p>
              <p className="text-xs text-muted mt-1">
                {hi
                  ? 'वास्तविक मामले में सत्यापित डोजियर संबंधित नियामक या साइबर पुलिस तक भेजा जा सकता है।'
                  : 'In a production system, a verified dossier could be routed to the appropriate regulator or police authority.'}
              </p>
            </div>
          </div>

          {/* Level 4: Magistrate Court */}
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4">
            <div className="flex flex-col items-center self-stretch flex-shrink-0 w-7 sm:w-8">
              <div className="escalation-node escalation-node-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 mt-2">
                4
              </div>
            </div>
            <div className="escalation-card escalation-card-4 flex-1 p-4 rounded-xl min-w-0">
              <div className="escalation-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 4: मुख्य न्यायिक मजिस्ट्रेट न्यायालय (धन वापसी आदेश)' : 'Level 4: Judicial Magistrate Court (Sec 457 CrPC / 503 BNSS)'}
                </p>
                <span className="escalation-status escalation-status-4 text-[11px] font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto">
                  {hi ? 'अंतिम आदेश' : 'Final Order'}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                {hi
                  ? 'वास्तविक बैंक कार्रवाई की पुष्टि के बाद समीक्षा के लिए कोर्ट याचिका का टेम्पलेट।'
                  : 'A court petition template to review after confirmed bank action and legal advice.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="p-5 rounded-2xl border border-line bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-ink">
            {hi ? 'डेमो दस्तावेज़' : 'Demo documents'}
          </h4>
          <p className="text-xs text-muted mt-0.5">
            {hi ? 'प्रोटोटाइप से तैयार किए गए रिकॉर्ड डाउनलोड करें।' : 'Download prototype-generated copies for review.'}
          </p>
        </div>
        <div className="btn-group sm:ml-auto">
          {isFinancial ? (
            <button onClick={onOpenCourtPetition} className="btn-primary">
              <Scale size={15} />
              <span>{hi ? 'न्यायालय याचिका' : 'Court Petition'}</span>
            </button>
          ) : (
            <button onClick={onOpenCourtPetition} className="btn-primary">
              <FileText size={15} />
              <span>{hi ? 'FIR ड्राफ्ट' : 'FIR Draft'}</span>
            </button>
          )}
          {isFinancial && (
            <button onClick={onViewReceipt} className="btn-secondary">
              <ShieldCheck size={15} />
              <span>{hi ? 'डेमो रसीद' : 'Demo receipt'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
