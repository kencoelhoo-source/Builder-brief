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
      <div className="p-4 sm:p-5 rounded-2xl border border-line bg-card shadow-xs relative overflow-hidden">
        {/* Row 1: Live Status & SLA Timer Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-3.5 border-b border-line/60">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="anim-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <span className="whitespace-nowrap">
              {isFinancial
                ? (hi ? 'सक्रिय केस · बैंक नोटिस प्रेषित' : 'Live Case · Bank Freeze Dispatched')
                : (hi ? 'सक्रिय केस · धारा 79 नोटिस प्रेषित' : 'Live Case · Section 79 Takedown Dispatched')}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft border border-line text-xs font-medium text-muted shrink-0 shadow-2xs">
            <Clock size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-muted text-[11px] uppercase tracking-wider">
              {isFinancial ? (hi ? '12h SLA:' : '12h SLA:') : (hi ? '36h SLA:' : '36h SLA:')}
            </span>
            <span className="font-mono text-xs font-bold text-ink whitespace-nowrap tabular-nums">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* Row 2: Reference Number & Case Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3.5 pt-0.5">
          {/* Reference ID + Inline Copy Button */}
          <div className="flex items-center gap-2.5 min-w-0">
            <h2 className="text-lg sm:text-2xl font-black font-mono text-ink tracking-tight whitespace-nowrap m-0 p-0">
              {ackNumber}
            </h2>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-soft hover:bg-card border border-line text-xs font-semibold text-muted hover:text-ink transition-colors shrink-0 cursor-pointer shadow-2xs"
              title={hi ? 'पावती नंबर कॉपी करें' : 'Copy Reference Number'}
              aria-label="Copy Reference Number"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">{hi ? 'कॉपी किया' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-muted" />
                  <span className="text-[11px]">{hi ? 'कॉपी' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          {/* Metadata Chips / Single-Line */}
          <div className="flex items-center gap-2 text-xs text-muted font-medium flex-wrap">
            <span className="font-bold text-ink">{transaction.victimName}</span>
            <span className="text-line-strong">•</span>
            <span className="text-ink/90 font-medium">
              {isFinancial ? `${formatINR(transaction.amount)} · ${transaction.remitterBank}` : transaction.platform}
            </span>
            <span className="text-line-strong">•</span>
            <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
          {/* Level 1: Immediate Nodal / Platform Dispatch (Saffron) */}
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 pb-5 relative">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7 sm:w-8 self-stretch">
              <div className={`escalation-node escalation-node-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 ${
                activeLevel >= 1 ? 'is-active' : 'is-pending'
              }`}>
                {activeLevel > 1 ? '✓' : '1'}
              </div>
              {/* Seamless connecting line to Node 2 (Saffron to White/Slate) */}
              <div className="absolute top-3.5 -bottom-5 left-1/2 -translate-x-1/2 w-[3px] bg-line/40 z-0">
                <div
                  className="w-full bg-gradient-to-b from-[#ea580c] to-[#64748b] dark:to-[#94a3b8] transition-all duration-700 ease-out"
                  style={{ height: activeLevel >= 2 ? '100%' : '0%' }}
                />
              </div>
            </div>
            <div className={`escalation-card escalation-card-1 flex-1 p-4 rounded-xl min-w-0 ${
              activeLevel >= 1 ? 'is-active' : 'is-pending'
            }`}>
              <div className="escalation-card-header">
                <p className="text-sm font-bold text-ink">
                  {isFinancial
                    ? (hi ? 'स्तर 1: नोडल बैंक अधिकारी (0-2 घंटे)' : 'Level 1: Dual-Bank Freeze Dispatch (0-2 Hours)')
                    : (hi ? 'स्तर 1: धारा 79 टेकडाउन नोटिस (0-2 घंटे)' : 'Level 1: Section 79 Notice Served (0-2 Hours)')}
                </p>
              </div>
              <p className="text-xs text-muted mt-1.5 break-all">
                {officer?.bankName || 'Verified contact unavailable'} · <strong className="text-ink">{officer?.nodalEmail || 'Production integration required'}</strong>
              </p>
              <p className="text-xs text-muted mt-1">
                {isFinancial
                  ? (hi ? 'डेमो निर्देश दिखाया गया है; कोई लाइव लियन या फ्रीज जारी नहीं हुआ।' : 'Prototype bank freeze directive is shown for review; no live lien was issued.')
                  : (hi ? 'प्लेटफ़ॉर्म शिकायत अधिकारी को 36-घंटे का कानूनी नोटिस दर्ज किया गया।' : 'Statutory 36-hour takedown request recorded under Section 79(3)(b) IT Act.')}
              </p>
            </div>
          </div>

          {/* Level 2: Risk Desk / Platform Compliance SLA (White/Silver) */}
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 pb-5 relative">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7 sm:w-8 self-stretch">
              <div className={`escalation-node escalation-node-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 ${
                activeLevel >= 2 ? 'is-active' : 'is-pending'
              }`}>
                {activeLevel > 2 ? '✓' : '2'}
              </div>
              {/* Seamless connecting line to Node 3 (White/Slate to Ashoka Navy) */}
              <div className="absolute top-3.5 -bottom-5 left-1/2 -translate-x-1/2 w-[3px] bg-line/40 z-0">
                <div
                  className="w-full bg-gradient-to-b from-[#64748b] dark:from-[#94a3b8] to-[#1d4ed8] dark:to-[#3b82f6] transition-all duration-700 ease-out"
                  style={{ height: activeLevel >= 3 ? '100%' : '0%' }}
                />
              </div>
            </div>
            <div className={`escalation-card escalation-card-2 flex-1 p-4 rounded-xl min-w-0 ${
              activeLevel >= 2 ? 'is-active' : 'is-pending'
            }`}>
              <div className="escalation-card-header">
                <p className="text-sm font-bold text-ink">
                  {isFinancial
                    ? (hi ? 'स्तर 2: वरिष्ठ जोखिम डेस्क (24 घंटे)' : 'Level 2: Senior Risk Desk (24 Hours)')
                    : (hi ? 'स्तर 2: प्लेटफ़ॉर्म अनुपालन समीक्षा (36 घंटे SLA)' : 'Level 2: Platform Compliance Review (36h SLA)')}
                </p>
              </div>
              <p className="text-xs text-muted mt-1.5 break-all">
                {officer?.cyberCellHead || 'Verified escalation contact unavailable'} · <span className="font-mono text-ink">{officer?.escalationEmail || 'Production integration required'}</span>
              </p>
              <p className="text-xs text-muted mt-1">
                {isFinancial
                  ? (hi ? 'यदि नोडल अधिकारी 24 घंटे में पुष्टि नहीं करते, तो गैर-अनुपालन नोटिस सीधे CISO को भेजा जाएगा।' : 'A production system could notify the appropriate escalation desk if unacknowledged in 24h.')
                  : (hi ? 'यदि प्लेटफ़ॉर्म 36 घंटे में सामग्री नहीं हटाता, तो सेफ हार्बर सुरक्षा समाप्त हो सकती है।' : 'Failure to disable access within 36 hours forfeits Section 79 intermediary safe-harbour.')}
              </p>
            </div>
          </div>

          {/* Level 3: Cyber Police Station Escalation (Ashoka Navy Blue) */}
          <div className="escalation-step flex items-start gap-3.5 sm:gap-4 pb-5 relative">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7 sm:w-8 self-stretch">
              <div className={`escalation-node escalation-node-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono leading-none ring-4 ring-card select-none shadow-sm z-10 ${
                activeLevel >= 3 ? 'is-active' : 'is-pending'
              }`}>
                {activeLevel > 3 ? '✓' : '3'}
              </div>
              {/* Seamless connecting line to Node 4 (Navy to Green) */}
              <div className="absolute top-3.5 -bottom-5 left-1/2 -translate-x-1/2 w-[3px] bg-line/40 z-0">
                <div
                  className="w-full bg-gradient-to-b from-[#1d4ed8] dark:from-[#3b82f6] to-[#16a34a] dark:to-[#22c55e] transition-all duration-700 ease-out"
                  style={{ height: activeLevel >= 4 ? '100%' : '0%' }}
                />
              </div>
            </div>
            <div className={`escalation-card escalation-card-3 flex-1 p-4 rounded-xl min-w-0 ${
              activeLevel >= 3 ? 'is-active' : 'is-pending'
            }`}>
              <div className="escalation-card-header">
                <p className="text-sm font-bold text-ink">
                  {isFinancial
                    ? (hi ? 'स्तर 3: नियामक एवं साइबर पुलिस (72 घंटे)' : 'Level 3: Regulator & Cyber Police (72 Hours)')
                    : (hi ? 'स्तर 3: साइबर क्राइम पुलिस सेल (72 घंटे)' : 'Level 3: Cyber Crime Police Cell (72 Hours)')}
                </p>
              </div>
              <p className="text-xs text-muted mt-1.5">
                {officer?.jurisdiction || (hi ? 'क्षेत्रीय संपर्क उपलब्ध नहीं' : 'Regional Cyber Police Station')}
              </p>
              <p className="text-xs text-muted mt-1">
                {hi
                  ? 'वास्तविक मामले में सत्यापित डोजियर संबंधित नियामक या साइबर पुलिस तक भेजा जा सकता है।'
                  : 'In a production system, a verified dossier could be routed to the appropriate regulator or police authority.'}
              </p>
            </div>
          </div>

          {/* Level 4: Court / FIR Petition (Indian Green) */}
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
              <div className="escalation-card-header">
                <p className="text-sm font-bold text-ink">
                  {isFinancial
                    ? (hi ? 'स्तर 4: मुख्य न्यायिक मजिस्ट्रेट न्यायालय (धन वापसी आदेश)' : 'Level 4: Judicial Magistrate Court (Sec 457 CrPC / 503 BNSS)')
                    : (hi ? 'स्तर 4: धारा 154 साइबर पुलिस शिकायत (FIR ड्राफ्ट तैयार)' : 'Level 4: Section 154 Formal Cyber Complaint (FIR Ready)')}
                </p>
              </div>
              <p className="text-xs text-muted mt-1.5">
                {isFinancial
                  ? (hi ? 'वास्तविक बैंक कार्रवाई की पुष्टि के बाद समीक्षा के लिए कोर्ट याचिका का टेम्पलेट।' : 'A court petition template to review after confirmed bank action.')
                  : (hi ? 'साइबर सेल में प्रस्तुत करने हेतु धारा 154 / 173 BNSS औपचारिक पुलिस शिकायत ड्राफ्ट।' : 'Formal criminal complaint ready to file at the Cyber Crime Police Station.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Management & Return to Home Dock */}
      <div className="p-4 sm:p-5 rounded-2xl border border-line-strong bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon + Title + Reference Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
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
