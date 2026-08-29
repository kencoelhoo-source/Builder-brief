import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, BarChart3, CreditCard, FilePlus, HeartHandshake, Link2, Lock, Scale, Search, ShieldAlert, UserX } from 'lucide-react';
import type { Language, FraudPersona } from '../types';
import { MOCK_PERSONAS } from '../data/mockPersonas';

interface HomeHubProps {
  currentLang: Language;
  onReport: () => void;
  onTrack: () => void;
  canTrack: boolean;
  ackNumber?: string | null;
  onSelectPreset: (personaId: string) => void;
  onOpenScamAnalyzer: () => void;
  onOpenLinkChecker: () => void;
  onOpenDashboard: () => void;
}

interface HeroMessagePair {
  enTitle: string;
  enSub: string;
  hiTitle: string;
  hiSub: string;
}

const HERO_MESSAGES: HeroMessagePair[] = [
  {
    enTitle: 'You are not alone. Take a deep breath.',
    enSub: 'Stay calm. We are here to guide you step-by-step through freezing the transfer and securing your case.',
    hiTitle: 'आप अकेले नहीं हैं। घबराएं नहीं।',
    hiSub: 'शांत रहें। हम आपके पैसे रोकने और शिकायत दर्ज करने की हर प्रक्रिया में आपका पूरा साथ देंगे।',
  },
  {
    enTitle: 'Don’t panic. We will handle this together.',
    enSub: 'If money was debited or someone created a fake profile, we will help you assemble the evidence and legal notices.',
    hiTitle: 'चिंता न करें। हम मिलकर समाधान करेंगे।',
    hiSub: 'यदि पैसे कटे हैं या फ़ेक प्रोफाइल बना है, तो हम साक्ष्य जुटाने और कानूनी नोटिस तैयार करने में आपकी मदद करेंगे।',
  },
  {
    enTitle: 'You are safe here. Let’s take action.',
    enSub: 'We will help you extract the UTR, prepare your bank freeze letter, and draft your cyber cell petition.',
    hiTitle: 'आप यहाँ सुरक्षित हैं। आइए कार्रवाई शुरू करें।',
    hiSub: 'हम आपका UTR निकालने, बैंक को खाता फ्रीज नोटिस भेजने और पुलिस शिकायत तैयार करने में आपकी मदद करेंगे।',
  },
  {
    enTitle: 'Help is right here. We’ve got your back.',
    enSub: 'No complicated forms or confusing jargon—just straightforward, step-by-step support for citizens.',
    hiTitle: 'सहायता आपके साथ है। परेशान न हों।',
    hiSub: 'बिना किसी जटिल फॉर्म के, सीधे और आसान चरणों में अपनी शिकायत दर्ज करें और कानूनी दस्तावेज पाएं।',
  },
  {
    enTitle: 'Stay calm. Every step is guided.',
    enSub: 'From your payment screenshot to the official bank notice, we are right beside you through the whole process.',
    hiTitle: 'धैर्य रखें। हर कदम पर हमारा मार्गदर्शन।',
    hiSub: 'स्क्रीनशॉट से लेकर बैंक के आधिकारिक नोटिस तक, हम पूरी प्रक्रिया में आपके साथ हैं।',
  },
];

const getPersonaMeta = (persona: FraudPersona, hi: boolean) => {
  switch (persona.id) {
    case 'gpay-phishing':
      return {
        icon: <CreditCard className="w-4 h-4 text-emerald-800 dark:text-emerald-300" />,
        iconBg: 'bg-emerald-900/10 dark:bg-emerald-400/10 border-emerald-800/20',
        footCls: 'text-ink group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
        tag: hi ? '₹४८.५K · फ्रीज' : '₹48,500 · Freeze',
        sub: hi
          ? 'फर्जी बिजली बिल रिफंड व त्वरित बैंक फ्रीज।'
          : 'Fake utility refund & instant dual-bank freeze.',
      };
    case 'investment-fraud':
      return {
        icon: <Scale className="w-4 h-4 text-amber-800 dark:text-amber-300" />,
        iconBg: 'bg-amber-900/10 dark:bg-amber-400/10 border-amber-800/20',
        footCls: 'text-ink group-hover:text-amber-700 dark:group-hover:text-amber-300',
        tag: hi ? '₹१.५L · राडार' : '₹1,50,000 · Radar',
        sub: hi
          ? 'म्यूल खाता फंड ट्रांसफर एवं ट्रैकिंग राडार।'
          : 'Mule bank account transfer & fund radar.',
      };
    case 'instagram-fake':
      return {
        icon: <UserX className="w-4 h-4 text-stone-700 dark:text-stone-300" />,
        iconBg: 'bg-stone-500/10 dark:bg-stone-400/10 border-stone-500/20',
        footCls: 'text-ink group-hover:text-stone-800 dark:group-hover:text-stone-200',
        tag: hi ? 'धारा ७९ · टेकडाउन' : 'Sec 79 · Takedown',
        sub: hi
          ? 'क्लोन प्रोफाइल व ३६-घंटे वैधानिक टेकडाउन।'
          : 'Cloned profile & 36h statutory takedown.',
      };
    case 'cyber-stalking':
      return {
        icon: <ShieldAlert className="w-4 h-4 text-amber-900 dark:text-amber-200" />,
        iconBg: 'bg-amber-900/10 dark:bg-amber-400/10 border-amber-800/20',
        footCls: 'text-ink group-hover:text-amber-800 dark:group-hover:text-amber-300',
        tag: hi ? 'धारा १५४ · FIR' : 'Sec 154 · Cyber FIR',
        sub: hi
          ? 'जबरन वसूली व साइबर पुलिस FIR ड्राफ्ट।'
          : 'Extortion calls & Cyber Police FIR petition.',
      };
    default:
      return {
        icon: <ShieldAlert className="w-4 h-4 text-ink" />,
        iconBg: 'bg-soft border-line',
        footCls: 'text-ink',
        tag: hi ? 'टेस्ट' : 'Test Persona',
        sub: persona.description,
      };
  }
};

export const HomeHub: React.FC<HomeHubProps> = ({
  currentLang,
  onReport,
  onTrack,
  canTrack,
  ackNumber,
  onSelectPreset,
  onOpenScamAnalyzer,
  onOpenLinkChecker,
  onOpenDashboard,
}) => {
  const hi = currentLang === 'hi';

  // Pick a reassuring fresh message on every mount
  const activePair = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * HERO_MESSAGES.length);
    return HERO_MESSAGES[randomIndex];
  }, []);

  const targetTitle = hi ? activePair.hiTitle : activePair.enTitle;
  const targetSub = hi ? activePair.hiSub : activePair.enSub;

  // Smooth Typewriter State
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedSub, setDisplayedSub] = useState('');
  const [isTitleDone, setIsTitleDone] = useState(false);

  const titleTimeoutRef = useRef<number | null>(null);
  const subTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayedTitle('');
    setDisplayedSub('');
    setIsTitleDone(false);

    let charIdx = 0;
    const typeSpeed = 36;

    const typeNextTitleChar = () => {
      if (charIdx < targetTitle.length) {
        setDisplayedTitle(targetTitle.slice(0, charIdx + 1));
        charIdx++;
        titleTimeoutRef.current = window.setTimeout(typeNextTitleChar, typeSpeed);
      } else {
        setIsTitleDone(true);
      }
    };

    titleTimeoutRef.current = window.setTimeout(typeNextTitleChar, 80);

    return () => {
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
      if (subTimeoutRef.current) clearTimeout(subTimeoutRef.current);
    };
  }, [targetTitle]);

  useEffect(() => {
    if (!isTitleDone) return;

    let subIdx = 0;
    const subSpeed = 16;

    const typeNextSubChar = () => {
      if (subIdx < targetSub.length) {
        setDisplayedSub(targetSub.slice(0, subIdx + 1));
        subIdx++;
        subTimeoutRef.current = window.setTimeout(typeNextSubChar, subSpeed);
      }
    };

    subTimeoutRef.current = window.setTimeout(typeNextSubChar, 120);

    return () => {
      if (subTimeoutRef.current) clearTimeout(subTimeoutRef.current);
    };
  }, [isTitleDone, targetSub]);

  return (
    <div className="page-wrap page-stack hub w-full mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* 1. Hero Reassurance Banner */}
      <section className="p-5 sm:p-8 lg:p-9 rounded-2xl sm:rounded-3xl border border-line-strong bg-card shadow-sm relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          {/* Left Column: Reassuring Empathetic Message */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink min-h-[32px] sm:min-h-[44px] flex items-center flex-wrap leading-tight">
              <span>{displayedTitle}</span>
              {!isTitleDone && <span className="inline-block w-0.5 h-4 sm:h-7 bg-ink ml-1.5 animate-pulse" />}
            </h1>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base text-muted leading-snug sm:leading-relaxed min-h-[30px] sm:min-h-[44px] font-medium max-w-2xl">
              <span>{displayedSub}</span>
              {isTitleDone && displayedSub.length < targetSub.length && (
                <span className="inline-block w-0.5 h-3.5 bg-ink/80 ml-1 animate-pulse" />
              )}
            </p>

            {/* Mobile Pill Strip for 3 Pillars */}
            <div className="grid grid-cols-3 gap-1.5 sm:hidden mt-3.5 pt-3 border-t border-line/60">
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-soft/80 border border-line">
                <HeartHandshake size={12} className="shrink-0 text-ink" />
                <span className="text-[10px] font-bold text-ink truncate">{hi ? 'नागरिक सहायता' : 'Support'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-soft/80 border border-line">
                <Scale size={12} className="shrink-0 text-ink" />
                <span className="text-[10px] font-bold text-ink truncate">{hi ? 'कानूनी नोटिस' : 'Notices'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-soft/80 border border-line">
                <Lock size={12} className="shrink-0 text-ink" />
                <span className="text-[10px] font-bold text-ink truncate">{hi ? '१००% सुरक्षित' : '100% Safe'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Trust Pillars (Tablet & Desktop) */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-1 lg:col-span-5 gap-2.5 lg:gap-3">
            {/* Pillar 1 */}
            <div className="p-3 lg:p-3.5 rounded-xl bg-canvas/60 dark:bg-canvas/50 border border-line/80 hover:border-line-strong transition-colors flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-soft border border-line text-ink flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <HeartHandshake size={15} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-ink">
                  {hi ? 'नागरिक सहायता' : 'Guided Citizen Support'}
                </h2>
                <p className="text-[11px] text-muted leading-snug mt-0.5">
                  {hi
                    ? 'कदम-दर-कदम शिकायत व बैंक नोटिस तैयार करें।'
                    : 'Step-by-step guidance to freeze transactions and document your case.'}
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-3 lg:p-3.5 rounded-xl bg-canvas/60 dark:bg-canvas/50 border border-line/80 hover:border-line-strong transition-colors flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-soft border border-line text-ink flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Scale size={15} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-ink">
                  {hi ? 'तैयार कानूनी दस्तावेज' : 'Ready-to-Use Legal Notices'}
                </h2>
                <p className="text-[11px] text-muted leading-snug mt-0.5">
                  {hi
                    ? 'बैंक खाता फ्रीज व प्लेटफॉर्म टेकडाउन नोटिस तुरंत पाएं।'
                    : 'Instantly generates official bank freeze and platform takedown notices.'}
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-3 lg:p-3.5 rounded-xl bg-canvas/60 dark:bg-canvas/50 border border-line/80 hover:border-line-strong transition-colors flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-soft border border-line text-ink flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Lock size={15} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-ink">
                  {hi ? '१००% निजी व सुरक्षित' : '100% Private & Confidential'}
                </h2>
                <p className="text-[11px] text-muted leading-snug mt-0.5">
                  {hi
                    ? 'सभी सबूत आपके डिवाइस पर प्रोसेस होते हैं, पूर्णतः निजी।'
                    : 'Your evidence is parsed on your device and remains completely confidential.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Primary Incident Actions (High-Contrast Full-Width 2-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
        {/* Card 1: Report a complaint (HERO CTA) */}
        <button
          type="button"
          className="hub-card hub-card-primary group !p-5 sm:!p-6 cursor-pointer text-left flex flex-col justify-between h-full"
          onClick={onReport}
        >
          <div className="flex flex-col">
            {/* Header: Soft Warm Icon + Title */}
            <div className="flex items-center gap-3.5 mb-3">
              <span className="hub-card-icon !w-11 !h-11 shrink-0 flex items-center justify-center rounded-xl shadow-xs">
                <FilePlus className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </span>
              <h3 className="hub-card-title text-base sm:text-xl font-extrabold text-ink tracking-tight leading-tight m-0 p-0">
                {hi ? 'शिकायत दर्ज करें' : 'Report an incident'}
              </h3>
            </div>

            {/* Meta Description */}
            <p className="hub-card-meta text-xs sm:text-sm leading-relaxed text-muted mt-1">
              {hi
                ? 'रसीद फोटो, चैट स्क्रीनशॉट, या SMS विवरण अपलोड करें।'
                : 'Upload a payment receipt photo, WhatsApp chat screenshot, or SMS.'}
            </p>
          </div>

          {/* Action Footer */}
          <div className="hub-card-foot mt-5 pt-3 border-t border-amber-500/20 text-xs sm:text-sm font-bold flex items-center justify-between text-ink group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
            <span>{hi ? 'शुरू करें' : 'Start complaint report'}</span>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-all group-hover:translate-x-1.5" />
          </div>
        </button>

        {/* Card 2: Track a complaint */}
        <button
          type="button"
          className="hub-card group !p-5 sm:!p-6 cursor-pointer text-left flex flex-col justify-between h-full relative"
          onClick={onTrack}
        >
          <div className="flex flex-col">
            {/* Header: Icon + Title + Active Live Badge */}
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-3.5">
                <span className="hub-card-icon !w-11 !h-11 shrink-0 flex items-center justify-center bg-soft border border-line rounded-xl shadow-xs">
                  <Search className="w-6 h-6 text-ink" />
                </span>
                <div>
                  <h3 className="hub-card-title text-base sm:text-xl font-extrabold text-ink tracking-tight leading-tight m-0 p-0">
                    {hi ? 'शिकायत ट्रैक करें' : 'Track complaint'}
                  </h3>
                  <p className="text-[11px] text-muted font-medium mt-0.5">
                    {canTrack ? (hi ? 'रीयल-टाइम एस्केलेशन ट्रैकर' : 'Live escalation tracker') : (hi ? 'स्थिति एवं समयसीमा' : 'Real-time timeline')}
                  </p>
                </div>
              </div>
              {canTrack ? (
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 inline-flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  {hi ? 'केस सक्रिय' : 'Active Case'}
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md bg-soft border border-line text-muted shrink-0">
                  {hi ? 'लाइव मॉनिटर' : 'Live Monitor'}
                </span>
              )}
            </div>

            {/* Case Details Badge Strip / Micro Tracker */}
            {canTrack ? (
              <div className="mt-2.5 p-2.5 sm:p-3 rounded-xl bg-soft/70 border border-line/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-muted">{hi ? 'केस संदर्भ:' : 'Ref ID:'}</span>
                  <span className="font-mono text-xs font-bold text-ink">{ackNumber}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{hi ? 'स्तर 1-4 सक्रिय' : 'Level 1-4 Active'}</span>
                </div>
              </div>
            ) : (
              <p className="hub-card-meta text-xs sm:text-sm leading-relaxed mt-2 text-muted">
                {hi
                  ? 'रिपोर्ट सबमिट करने के बाद आपकी लाइव शिकायत स्थिति, बैंक SLA टाइमर व न्यायालय याचिका यहाँ दिखेगी।'
                  : 'Monitor real-time bank freeze notices, 24h SLA timers, and legal escalation after filing.'}
              </p>
            )}
          </div>

          {/* Action Footer */}
          <div className="hub-card-foot mt-5 pt-3 border-t border-line/60 text-xs sm:text-sm font-bold flex items-center justify-between text-ink group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
            <span>{canTrack ? (hi ? 'लाइव स्थिति व SLA देखें' : 'View live status & SLA') : (hi ? 'केस ट्रैक करें' : 'Track complaint progress')}</span>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-all group-hover:translate-x-1.5" />
          </div>
        </button>
      </div>

      {/* 3. Simulated Reviewer Studio (Balanced 2-Col Mobile Grid) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {hi ? 'समीक्षा एवं टेस्ट परिदृश्य' : 'Simulated Reviewer Scenarios (1-Click)'}
          </p>
        </div>

        {/* 2-Col Mobile / 4-Col Desktop Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {MOCK_PERSONAS.map((persona) => {
            const meta = getPersonaMeta(persona, hi);
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => onSelectPreset(persona.id)}
                className="mock-scenario-card group !p-3.5 sm:!p-5 text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Header Row: Warm Icon + Extra-Bold Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-2.5">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${meta.iconBg} border flex items-center justify-center shrink-0 shadow-2xs !mb-0 transition-transform group-hover:scale-105`}>
                      {meta.icon}
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-ink leading-snug m-0 p-0 line-clamp-1 sm:line-clamp-none">
                      {hi ? persona.nameHi : persona.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-muted leading-relaxed line-clamp-2 mt-1">
                    {meta.sub}
                  </p>
                </div>

                {/* Footer Action */}
                <div className={`mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-line/60 flex items-center justify-between text-[11px] sm:text-xs font-bold ${meta.footCls} w-full transition-colors`}>
                  <span>{hi ? 'टेस्ट करें' : 'Test Persona'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-all group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Secondary Cyber Safety Utilities */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {hi ? 'त्वरित सुरक्षा टूल्स' : 'Cyber Safety Utilities'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5">
          {/* Tool 1: AI scam analyzer */}
          <button type="button" className="hub-card group !p-4 sm:!p-5 cursor-pointer text-left flex flex-col justify-between" onClick={onOpenScamAnalyzer}>
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="hub-card-icon !w-9 !h-9 sm:!w-10 sm:!h-10 !mb-0 shrink-0 flex items-center justify-center bg-stone-500/10 dark:bg-stone-400/10 border border-stone-500/20 rounded-xl shadow-xs">
                  <ShieldAlert className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                </span>
                <h3 className="hub-card-title text-sm sm:text-base font-extrabold text-ink leading-snug m-0 p-0 flex items-center">
                  {hi ? 'AI स्कैम विश्लेषक' : 'AI scam analyzer'}
                </h3>
              </div>
              <p className="hub-card-meta text-xs leading-relaxed text-muted">
                {hi
                  ? 'संदिग्ध SMS, ईमेल, व्हाट्सएप चैट व कॉल संदेश जांचें।'
                  : 'Check SMS, email, WhatsApp, or call descriptions for fraud signals.'}
              </p>
            </div>
            <div className="hub-card-foot mt-4 pt-2 text-xs font-bold flex items-center justify-between text-ink group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
              <span>{hi ? 'जांचें' : 'Analyze'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-all group-hover:translate-x-1" />
            </div>
          </button>

          {/* Tool 2: Suspicious link checker */}
          <button type="button" className="hub-card group !p-4 sm:!p-5 cursor-pointer text-left flex flex-col justify-between" onClick={onOpenLinkChecker}>
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="hub-card-icon !w-9 !h-9 sm:!w-10 sm:!h-10 !mb-0 shrink-0 flex items-center justify-center bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 rounded-xl shadow-xs">
                  <Link2 className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                </span>
                <h3 className="hub-card-title text-sm sm:text-base font-extrabold text-ink leading-snug m-0 p-0 flex items-center">
                  {hi ? 'संदिग्ध लिंक चेकर' : 'Suspicious link checker'}
                </h3>
              </div>
              <p className="hub-card-meta text-xs leading-relaxed text-muted">
                {hi
                  ? 'डोमेन, HTTPS व फ़िशिंग संकेतों की सुरक्षित जांच करें।'
                  : 'Assess domain, HTTPS, and impersonation signals safely without opening the URL.'}
              </p>
            </div>
            <div className="hub-card-foot mt-4 pt-2 text-xs font-bold flex items-center justify-between text-ink group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
              <span>{hi ? 'जांचें' : 'Check link'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-all group-hover:translate-x-1" />
            </div>
          </button>

          {/* Tool 3: Cyber safety dashboard */}
          <button type="button" className="hub-card group !p-4 sm:!p-5 cursor-pointer text-left flex flex-col justify-between" onClick={onOpenDashboard}>
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="hub-card-icon !w-9 !h-9 sm:!w-10 sm:!h-10 !mb-0 shrink-0 flex items-center justify-center bg-stone-500/10 dark:bg-stone-400/10 border border-stone-500/20 rounded-xl shadow-xs">
                  <BarChart3 className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                </span>
                <h3 className="hub-card-title text-sm sm:text-base font-extrabold text-ink leading-snug m-0 p-0 flex items-center">
                  {hi ? 'सुरक्षा डैशबोर्ड' : 'Cyber safety dashboard'}
                </h3>
              </div>
              <p className="hub-card-meta text-xs leading-relaxed text-muted">
                {hi
                  ? 'अपने सुरक्षा विश्लेषण, स्कोर व जरूरी सलाह देखें।'
                  : 'View your safety score, past analyses, and personalized protection tips.'}
              </p>
            </div>
            <div className="hub-card-foot mt-4 pt-2 text-xs font-bold flex items-center justify-between text-ink group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
              <span>{hi ? 'डैशबोर्ड खोलें' : 'Open dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-all group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
