import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, Clock, CheckCircle2, Home, RotateCcw } from 'lucide-react';
import type { CyberIncident, CFCFRMSPayload, Sec79Payload, Language } from '../types';
import { formatINR } from '../utils/formatters';
import { getBankNodalOfficer } from '../data/bankNodalDirectory';
import { copyText } from '../utils/browser';

interface MyApplicationsTabProps {
  transaction: CyberIncident;
  payload: CFCFRMSPayload | Sec79Payload;
  currentLang: Language;
  onViewReceipt?: () => void;
  onReturnHome?: () => void;
}

export const MyApplicationsTab: React.FC<MyApplicationsTabProps> = ({
  transaction,
  payload,
  currentLang,
  onViewReceipt,
  onReturnHome,
}) => {
  const hi = currentLang === 'hi';
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState(true);

  // Live countdown timer for Tier 2 Auto-Escalation SLA
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time live moving line progression from Level 1 -> 2 -> 3 -> 4
  useEffect(() => {
    if (!isSimulating) return;
    const t1 = setTimeout(() => setActiveLevel(2), 2000);
    const t2 = setTimeout(() => setActiveLevel(3), 4200);
    const t3 = setTimeout(() => setActiveLevel(4), 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isSimulating]);

  const handleRestartTrace = () => {
    setActiveLevel(1);
    setIsSimulating(false);
    setTimeout(() => setIsSimulating(true), 100);
  };

  const dispatchedAt = Date.parse(payload.dispatchedAt);
  const escalationDeadline = Number.isFinite(dispatchedAt)
    ? dispatchedAt + 12 * 60 * 60 * 1000
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
        jurisdiction: 'National Cyber Command',
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
      <div className="p-4 sm:p-5 rounded-2xl border border-line-strong bg-card shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            {/* Clean Status Text (No pill container) */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="anim-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
              </span>
              <span className="whitespace-nowrap">
                {hi ? 'सक्रिय केस · बैंक नोटिस प्रेषित' : 'Live Case · Bank Freeze Dispatched'}
              </span>
            </div>

            {/* Reference Number and Copy Button (Same Line) */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight whitespace-nowrap m-0 p-0">
                {ackNumber}
              </h2>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-soft hover:bg-soft-hover border border-line text-xs font-semibold text-ink transition-colors shrink-0 shadow-2xs cursor-pointer"
                title={hi ? 'पावती नंबर कॉपी करें' : 'Copy Acknowledgment Number'}
                aria-label="Copy Acknowledgment"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{hi ? 'कॉपी किया' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-muted" />
                    <span className="text-muted">{hi ? 'कॉपी' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Metadata Single-Line Strip */}
            <div className="flex items-center gap-2 text-xs text-muted mt-2 font-medium flex-wrap">
              <span className="font-bold text-ink">{transaction.victimName}</span>
              <span className="text-line-strong">•</span>
              <span>{isFinancial ? `${formatINR(transaction.amount)} · ${transaction.remitterBank}` : transaction.platform}</span>
              <span className="text-line-strong">•</span>
              <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Compact 12h SLA Countdown Widget */}
          <div className="px-3.5 py-2.5 rounded-xl bg-soft border border-line flex items-center gap-3 shrink-0 shadow-2xs self-start sm:self-center">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-700 dark:text-amber-300">
              <Clock size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted whitespace-nowrap leading-none">
                {hi ? '12h SLA टाइमर' : '12h SLA Timer'}
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-ink mt-1 tracking-tight whitespace-nowrap tabular-nums leading-none">
                {formatCountdown(secondsRemaining)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Animated Escalation Timeline with Live Moving Line */}
      <div className="p-5 sm:p-6 rounded-2xl border border-line bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h3 className="text-base font-bold text-ink">
              {hi ? 'लाइव सिमुलेटेड एस्केलेशन ट्रैकर' : 'Live Escalation Process Tracker'}
            </h3>
            <p className="text-xs text-muted mt-1">
              {hi
                ? `रीयल-टाइम प्रक्रिया चल रही है: वर्तमान में स्तर ${activeLevel}/4 सक्रिय है।`
                : `Real-time process in progress: currently Level ${activeLevel} of 4 is active.`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRestartTrace}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-soft hover:bg-card border border-line text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>{hi ? 'पुनः ट्रेस देखें' : 'Replay Trace'}</span>
          </button>
        </div>

        <div className="mt-6 escalation-timeline">
          {/* Level 1: Immediate Nodal Dispatch */}
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 pb-5 relative">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7 sm:w-8 self-stretch">
              <div className={`escalation-node escalation-node-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 ${
                activeLevel >= 1 ? 'is-active' : 'is-pending'
              }`}>
                {activeLevel > 1 ? '✓' : '1'}
              </div>
              {/* Seamless connecting line to Node 2 */}
              <div className="absolute top-3.5 -bottom-5 left-1/2 -translate-x-1/2 w-[3px] bg-line/40 z-0">
                <div
                  className="w-full bg-gradient-to-b from-[#059669] to-[#d97706] transition-all duration-700 ease-out"
                  style={{ height: activeLevel >= 2 ? '100%' : '0%' }}
                />
              </div>
            </div>
            <div className={`escalation-card escalation-card-1 flex-1 p-4 rounded-xl min-w-0 ${
              activeLevel >= 1 ? 'is-active' : 'is-pending'
            }`}>
              <div className="escalation-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 1: नोडल अधिकारी (डेमो)' : 'Level 1: Nodal Officer (Demo)'}
                </p>
                <span className="escalation-status escalation-status-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {activeLevel >= 1 ? (hi ? 'नोटिस तैयार' : 'Notice Dispatched') : (hi ? 'लंबित' : 'Pending')}
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
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 pb-5 relative">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7 sm:w-8 self-stretch">
              <div className={`escalation-node escalation-node-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 ${
                activeLevel >= 2 ? 'is-active' : 'is-pending'
              }`}>
                {activeLevel > 2 ? '✓' : '2'}
              </div>
              {/* Seamless connecting line to Node 3 */}
              <div className="absolute top-3.5 -bottom-5 left-1/2 -translate-x-1/2 w-[3px] bg-line/40 z-0">
                <div
                  className="w-full bg-gradient-to-b from-[#d97706] to-[#2563eb] transition-all duration-700 ease-out"
                  style={{ height: activeLevel >= 3 ? '100%' : '0%' }}
                />
              </div>
            </div>
            <div className={`escalation-card escalation-card-2 flex-1 p-4 rounded-xl min-w-0 ${
              activeLevel >= 2 ? 'is-active' : 'is-pending'
            }`}>
              <div className="escalation-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 2: वरिष्ठ जोखिम डेस्क (24 घंटे)' : 'Level 2: Senior Risk Desk (24 Hours)'}
                </p>
                <span className="escalation-status escalation-status-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {activeLevel >= 2 ? (hi ? '24h SLA सक्रिय' : '24h SLA Active') : (hi ? '24h में सक्रिय' : 'Queued for 24h')}
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
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 pb-5 relative">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7 sm:w-8 self-stretch">
              <div className={`escalation-node escalation-node-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 ${
                activeLevel >= 3 ? 'is-active' : 'is-pending'
              }`}>
                {activeLevel > 3 ? '✓' : '3'}
              </div>
              {/* Seamless connecting line to Node 4 */}
              <div className="absolute top-3.5 -bottom-5 left-1/2 -translate-x-1/2 w-[3px] bg-line/40 z-0">
                <div
                  className="w-full bg-gradient-to-b from-[#2563eb] to-[#7e22ce] transition-all duration-700 ease-out"
                  style={{ height: activeLevel >= 4 ? '100%' : '0%' }}
                />
              </div>
            </div>
            <div className={`escalation-card escalation-card-3 flex-1 p-4 rounded-xl min-w-0 ${
              activeLevel >= 3 ? 'is-active' : 'is-pending'
            }`}>
              <div className="escalation-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 3: नियामक एवं साइबर पुलिस (72 घंटे)' : 'Level 3: Regulator & Cyber Police (72 Hours)'}
                </p>
                <span className="escalation-status escalation-status-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {activeLevel >= 3 ? (hi ? 'साइबर सेल अग्रसारित' : 'Routed to Cyber Cell') : (hi ? 'संभावित अगला मार्ग' : 'Possible next route')}
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
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 relative">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7 sm:w-8">
              <div className={`escalation-node escalation-node-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 ${
                activeLevel >= 4 ? 'is-active' : 'is-pending'
              }`}>
                {activeLevel >= 4 ? '✓' : '4'}
              </div>
              {/* Terminal node - strictly no connecting rail below */}
            </div>
            <div className={`escalation-card escalation-card-4 flex-1 p-4 rounded-xl min-w-0 ${
              activeLevel >= 4 ? 'is-active' : 'is-pending'
            }`}>
              <div className="escalation-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 4: मुख्य न्यायिक मजिस्ट्रेट न्यायालय (धन वापसी आदेश)' : 'Level 4: Judicial Magistrate Court (Sec 457 CrPC / 503 BNSS)'}
                </p>
                <span className="escalation-status escalation-status-4 text-[11px] font-semibold px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {activeLevel >= 4 ? (hi ? 'कोर्ट याचिका तैयार' : 'Court Petition Ready') : (hi ? 'अंतिम आदेश' : 'Final Order')}
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

      {/* Case Management & Return to Home Dock */}
      <div className="p-4 sm:p-5 rounded-2xl border border-line-strong bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon + Title + Reference Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
            <CheckCircle2 size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-extrabold text-ink leading-tight m-0 p-0">
              {hi ? 'केस आधिकारिक रूप से दर्ज व सक्रिय है' : 'Official Case Active & Recorded'}
            </h4>
            <p className="text-xs text-muted font-medium mt-0.5 truncate">
              {hi ? `रेफरेंस: ${ackNumber} · 24h SLA सक्रिय` : `Ref: ${ackNumber} · 24h SLA Active`}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="btn-group shrink-0 flex items-center gap-2.5 w-full sm:w-auto">
          {onViewReceipt && (
            <button
              type="button"
              onClick={onViewReceipt}
              className="btn-primary flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 !px-4 !py-2.5 text-xs sm:text-sm whitespace-nowrap shadow-sm cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>{hi ? 'डेमो रसीद' : 'View Receipt'}</span>
            </button>
          )}

          {onReturnHome && (
            <button
              type="button"
              onClick={onReturnHome}
              className="btn-secondary flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 !px-4 !py-2.5 text-xs sm:text-sm whitespace-nowrap cursor-pointer"
            >
              <Home size={16} />
              <span>{hi ? 'होम पर लौटें' : 'Return to Home'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
