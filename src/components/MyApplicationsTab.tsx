import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, Clock, FileText, Scale } from 'lucide-react';
import type { CyberIncident, CFCFRMSPayload, Sec79Payload, Language } from '../types';
import { formatINR } from '../utils/formatters';
import { getBankNodalOfficer } from '../data/bankNodalDirectory';

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
  const [secondsRemaining, setSecondsRemaining] = useState<number>(23 * 3600 + 58 * 60 + 32);

  // Live countdown timer for Tier 2 Auto-Escalation SLA
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const isFinancial = transaction.incidentType === 'FINANCIAL';
  const cfcfrms = isFinancial ? (payload as CFCFRMSPayload) : null;
  const sec79 = !isFinancial ? (payload as Sec79Payload) : null;

  const ackNumber = cfcfrms?.ackNumber || sec79?.takedownToken || 'NCRP-2026-LIVE';
  const officer = isFinancial
    ? getBankNodalOfficer(transaction.beneficiaryBank)
    : {
        bankName: transaction.platform,
        nodalEmail: (sec79?.grievanceOfficerEmail) || 'grievance.officer@meta.com',
        escalationEmail: 'legal.compliance@meta.com',
        cyberCellHead: 'Designated Appellate Officer',
        jurisdiction: 'National Cyber Crime Command',
      };

  const handleCopy = () => {
    navigator.clipboard.writeText(ackNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                {hi ? 'सक्रिय कानूनी मामला (Active Intercept)' : 'Active Case Intercept'}
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

          {/* Auto-Escalation Countdown Capsule */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-soft border border-line flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 anim-live-glow">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {hi ? 'स्तर 2 स्वतः एस्केलेशन टाइमर' : 'Level 2 Auto-Escalate In'}
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
          {hi ? 'स्वचालित कानूनी एस्केलेशन सीढ़ी' : 'Automated Statutory Escalation Ladder'}
        </h3>
        <p className="text-xs text-muted mt-1">
          {hi
            ? 'यदि बैंक/मध्यस्थ समय पर जवाब नहीं देते, तो शिकायत स्वचालित रूप से वरिष्ठ अधिकारियों को प्रेषित होगी:'
            : 'If response is unverified within statutory SLA windows, the system automatically routes the dossier upwards:'}
        </p>

        <div className="mt-6 relative pl-6 sm:pl-8 space-y-6">
          {/* Animated Vertical Connector Beam */}
          <div className="absolute left-[11px] sm:left-[15px] top-4 bottom-4 w-0.5 anim-beam rounded-full" />

          {/* Level 1: Immediate Nodal Dispatch */}
          <div className="relative group">
            <div className="absolute -left-[23px] sm:-left-[27px] top-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-card">
              1
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 1: बैंक / प्लेटफ़ॉर्म नोडल अधिकारी (तत्काल)' : 'Level 1: Designated Nodal Officer (Immediate)'}
                </p>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full self-start sm:self-auto">
                  {hi ? '✓ प्रेषित / सक्रिय' : '✓ Dispatched / Active'}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5 break-all">
                {officer.bankName} · <strong className="text-ink">{officer.nodalEmail}</strong>
              </p>
              <p className="text-xs text-muted mt-1">
                {hi
                  ? 'धारा 91 CrPC / IT Act 79 के तहत डेबिट फ्रीज आदेश जारी किया गया।'
                  : 'Statutory directive issued for immediate lien lock / 36-hour content removal.'}
              </p>
            </div>
          </div>

          {/* Level 2: CISO & Senior Risk Desk */}
          <div className="relative group">
            <div className="absolute -left-[23px] sm:-left-[27px] top-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-card">
              2
            </div>
            <div className="p-4 rounded-xl border border-line bg-soft/50 transition-all hover:border-amber-500/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 2: CISO एवं धोखाधड़ी नियंत्रण प्रमुख (24 घंटे)' : 'Level 2: CISO & Fraud Risk VP Desk (24 Hours)'}
                </p>
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full self-start sm:self-auto">
                  {hi ? 'समयबद्ध ऑटो-ट्रिगर' : 'Auto-Escalation Armed'}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                {officer.cyberCellHead} · <span className="font-mono text-ink">{officer.escalationEmail}</span>
              </p>
              <p className="text-xs text-muted mt-1">
                {hi
                  ? 'यदि नोडल अधिकारी 24 घंटे में पुष्टि नहीं करते, तो गैर-अनुपालन नोटिस सीधे CISO को भेजा जाएगा।'
                  : 'Automated non-compliance alert transmits directly to the bank CISO if unacknowledged in 24h.'}
              </p>
            </div>
          </div>

          {/* Level 3: RBI Ombudsman & Cyber SP */}
          <div className="relative group">
            <div className="absolute -left-[23px] sm:-left-[27px] top-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-card">
              3
            </div>
            <div className="p-4 rounded-xl border border-line bg-soft/50 transition-all hover:border-indigo-500/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 3: RBI बैंकिंग लोकपाल एवं पुलिस अधीक्षक (साइबर क्राइम)' : 'Level 3: RBI Banking Ombudsman & Cyber Crime SP (72 Hours)'}
                </p>
                <span className="text-[11px] font-semibold text-muted bg-soft px-2 py-0.5 rounded-full self-start sm:self-auto">
                  {hi ? 'वैधानिक ओवरसाइट' : 'Statutory Oversight'}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                {officer.jurisdiction}
              </p>
              <p className="text-xs text-muted mt-1">
                {hi
                  ? 'संपूर्ण डिजिटल केस डोजियर नियामक एवं पुलिस अधीक्षक को औपचारिक शिकायत के रूप में प्रेषित होगा।'
                  : 'Full cryptographically signed dossier automatically filed with RBI Banking Ombudsman.'}
              </p>
            </div>
          </div>

          {/* Level 4: Magistrate Court */}
          <div className="relative group">
            <div className="absolute -left-[23px] sm:-left-[27px] top-1 w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold ring-4 ring-card">
              4
            </div>
            <div className="p-4 rounded-xl border border-line bg-soft/50 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-ink">
                  {hi ? 'स्तर 4: मुख्य न्यायिक मजिस्ट्रेट न्यायालय (धन वापसी आदेश)' : 'Level 4: Judicial Magistrate Court (Sec 457 CrPC / 503 BNSS)'}
                </p>
                <span className="text-[11px] font-semibold text-ink bg-card border border-line px-2 py-0.5 rounded-full self-start sm:self-auto">
                  {hi ? 'अंतिम आदेश' : 'Final Order'}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                {hi
                  ? 'फ्रीज की गई राशि को सीधे आपके खाते में रिलीज कराने हेतु न्यायालय याचिका।'
                  : 'Formal court petition for the unconditional de-freeze and restoration of funds.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="p-5 rounded-2xl border border-line bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-ink">
            {hi ? 'दस्तावेज़ एवं पावती' : 'Documents & Formal Slips'}
          </h4>
          <p className="text-xs text-muted mt-0.5">
            {hi ? 'अपने रिकॉर्ड और न्यायालय हेतु आधिकारिक प्रतियों को डाउनलोड करें।' : 'Download official copies for your legal and bank records.'}
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
          <button onClick={onViewReceipt} className="btn-secondary">
            <ShieldCheck size={15} />
            <span>{hi ? 'पावती रसीद' : 'NCRP Receipt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
