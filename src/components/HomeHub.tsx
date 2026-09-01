import React, { useMemo } from 'react';
import {
  Bot,
  Globe,
  HeartHandshake,
  LayoutDashboard,
  Lock,
  MessageSquareWarning,
  Radar,
  Scale,
  ShieldAlert,
  TrendingUp,
  UserX,
  Zap
} from 'lucide-react';
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
    enSub: 'No complicated forms or confusing jargon, just straightforward, step-by-step support for citizens.',
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
        icon: <Zap size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />,
        accentHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
        tag: hi ? '₹४८.५K · फ्रीज' : '₹48.5K · Freeze',
        sub: hi
          ? 'फर्जी बिजली बिल रिफंड व त्वरित बैंक फ्रीज।'
          : 'Fake utility refund & instant dual-bank freeze.',
      };
    case 'investment-fraud':
      return {
        icon: <TrendingUp size={17} className="text-amber-600 dark:text-amber-400 shrink-0" />,
        accentHover: 'group-hover:text-amber-700 dark:group-hover:text-amber-300',
        tag: hi ? '₹१.५L · राडार' : '₹1.5L · Radar',
        sub: hi
          ? 'म्यूल खाता फंड ट्रांसफर एवं ट्रैकिंग राडार।'
          : 'Mule bank account transfer & fund radar.',
      };
    case 'instagram-fake':
      return {
        icon: <UserX size={17} className="text-purple-600 dark:text-purple-400 shrink-0" />,
        accentHover: 'group-hover:text-purple-700 dark:group-hover:text-purple-300',
        tag: hi ? 'धारा ७९ · टेकडाउन' : 'Sec 79 · Takedown',
        sub: hi
          ? 'क्लोन प्रोफाइल व ३६-घंटे वैधानिक टेकडाउन।'
          : 'Cloned profile & 36h statutory takedown.',
      };
    case 'cyber-stalking':
      return {
        icon: <MessageSquareWarning size={17} className="text-rose-600 dark:text-rose-400 shrink-0" />,
        accentHover: 'group-hover:text-rose-700 dark:group-hover:text-rose-300',
        tag: hi ? 'धारा १५४ · FIR' : 'Sec 154 · Cyber FIR',
        sub: hi
          ? 'जबरन वसूली व साइबर पुलिस FIR ड्राफ्ट।'
          : 'Extortion calls & Cyber Police FIR petition.',
      };
    default:
      return {
        icon: <ShieldAlert size={17} className="text-ink shrink-0" />,
        accentHover: 'group-hover:text-amber-700 dark:group-hover:text-amber-300',
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

  return (
    <div className="page-wrap page-stack hub w-full mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* 1. Hero Reassurance Banner */}
      <section className="hub-hero-banner p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-line-strong shadow-sm relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          {/* Left Column: Reassuring Empathetic Message */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink min-h-[32px] sm:min-h-[44px] flex items-center flex-wrap leading-tight">
              <span>{targetTitle}</span>
            </h1>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base text-muted leading-snug sm:leading-relaxed min-h-[30px] sm:min-h-[44px] font-medium max-w-2xl">
              <span>{targetSub}</span>
            </p>

            {/* Mobile Pill Strip for 3 Pillars */}
            <div className="grid grid-cols-3 gap-1.5 sm:hidden mt-3.5 pt-3 border-t border-line/60">
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-card/85 dark:bg-[#18181d] border border-line/60 dark:border-white/[0.08]">
                <HeartHandshake size={12} className="shrink-0 text-ink" />
                <span className="text-[10px] font-bold text-ink truncate">{hi ? 'नागरिक सहायता' : 'Support'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-card/85 dark:bg-[#18181d] border border-line/60 dark:border-white/[0.08]">
                <Scale size={12} className="shrink-0 text-ink" />
                <span className="text-[10px] font-bold text-ink truncate">{hi ? 'कानूनी नोटिस' : 'Notices'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-card/85 dark:bg-[#18181d] border border-line/60 dark:border-white/[0.08]">
                <Lock size={12} className="shrink-0 text-ink" />
                <span className="text-[10px] font-bold text-ink truncate">{hi ? '१००% सुरक्षित' : '100% Safe'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Trust Pillars (Tablet & Desktop) */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-1 lg:col-span-5 gap-2.5 lg:gap-3">
            {/* Pillar 1 */}
            <div className="p-3 lg:p-3.5 rounded-xl bg-card/85 dark:bg-[#18181d] border border-line/70 dark:border-white/[0.08] hover:border-line-strong hover:bg-card dark:hover:bg-[#202026] transition-all flex items-start gap-2.5 shadow-2xs">
              <HeartHandshake size={18} className="text-ink shrink-0 mt-0.5" />
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
            <div className="p-3 lg:p-3.5 rounded-xl bg-card/85 dark:bg-[#18181d] border border-line/70 dark:border-white/[0.08] hover:border-line-strong hover:bg-card dark:hover:bg-[#202026] transition-all flex items-start gap-2.5 shadow-2xs">
              <Scale size={18} className="text-ink shrink-0 mt-0.5" />
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
            <div className="p-3 lg:p-3.5 rounded-xl bg-card/85 dark:bg-[#18181d] border border-line/70 dark:border-white/[0.08] hover:border-line-strong hover:bg-card dark:hover:bg-[#202026] transition-all flex items-start gap-2.5 shadow-2xs">
              <Lock size={18} className="text-ink shrink-0 mt-0.5" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
        {/* Card 1: Report a complaint (HERO CTA) */}
        <button
          type="button"
          className="hub-card hub-card-primary group !p-5 sm:!p-6 cursor-pointer text-left flex flex-col justify-between w-full h-full transition-all relative overflow-hidden"
          onClick={onReport}
        >
          <div className="w-full flex-1 flex flex-col items-start">
            {/* Icon */}
            <ShieldAlert size={28} className="text-orange-700 dark:text-orange-400 mb-3.5 sm:mb-4 shrink-0" />

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight leading-tight m-0 p-0">
              {hi ? 'शिकायत दर्ज करें' : 'Report an incident'}
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-muted font-normal mt-1.5 leading-relaxed">
              {hi
                ? 'बैंक फ्रीज नोटिस और आधिकारिक साइबर सेल शिकायत तुरंत तैयार करें।'
                : 'Generate immediate bank freeze notices and official cyber complaints.'}
            </p>

            {/* Minimal Inline Workflow Summary (No pills) */}
            <div className="flex items-center gap-2 text-xs text-muted mt-3.5 flex-wrap">
              <span className="font-semibold text-ink">{hi ? 'UTR निष्कर्षण' : 'UTR Extraction'}</span>
              <span className="text-line-strong">•</span>
              <span className="font-semibold text-ink">{hi ? 'बैंक फ्रीज' : 'Bank Freeze'}</span>
              <span className="text-line-strong">•</span>
              <span className="font-semibold text-ink">{hi ? 'धारा 154 FIR' : 'Sec 154 FIR'}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-5 pt-3.5 border-t border-orange-500/20 dark:border-orange-500/30 flex items-center justify-between gap-2 w-full">
            <span className="text-xs text-muted font-medium flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
              <span className="truncate">{hi ? 'डिवाइस-प्राइवेट · २४/७' : 'Device-Private · 24/7 Active'}</span>
            </span>
            <div className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-orange-700 dark:text-orange-400 group-hover:text-orange-800 dark:group-hover:text-orange-300 transition-colors shrink-0">
              <span>{hi ? 'रिपोर्ट शुरू करें' : 'Start incident report'}</span>
              <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
            </div>
          </div>
        </button>

        {/* Card 2: Track a complaint */}
        <button
          type="button"
          className="hub-card hub-card-track group !p-5 sm:!p-6 cursor-pointer text-left flex flex-col justify-between w-full h-full transition-all relative overflow-hidden"
          onClick={onTrack}
        >
          <div className="w-full flex-1 flex flex-col items-start">
            {/* Icon */}
            <Radar size={28} className="text-emerald-700 dark:text-emerald-300 mb-3.5 sm:mb-4 shrink-0" />

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight leading-tight m-0 p-0">
              {hi ? 'शिकायत ट्रैक करें' : 'Track complaint'}
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-muted font-normal mt-1.5 leading-relaxed">
              {hi
                ? 'बैंक नोडल अधिकारी और कोर्ट स्तर पर रिकवरी की प्रगति देखें।'
                : 'Follow statutory recovery progress across bank nodal desks and court.'}
            </p>

            {/* Minimal Inline Milestone Flow (No pills) */}
            <div className="flex items-center gap-2 text-xs text-muted mt-3.5 flex-wrap">
              <span className="font-semibold text-ink">{hi ? 'नोडल (0-2h)' : 'Nodal (0-2h)'}</span>
              <span className="text-line-strong">•</span>
              <span className="font-semibold text-ink">{hi ? 'रिस्क डेस्क (24h)' : 'Risk Desk (24h)'}</span>
              <span className="text-line-strong">•</span>
              <span className="font-semibold text-ink">{hi ? 'कोर्ट (72h)' : 'Court (72h)'}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-5 pt-3.5 border-t border-emerald-600/20 dark:border-emerald-400/20 flex items-center justify-between gap-2 w-full">
            <span className="text-xs text-muted font-medium flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">{canTrack ? `Ref: ${ackNumber}` : (hi ? '3-स्तरीय वैधानिक SLA' : 'Real-time SLA Timeline')}</span>
            </span>
            <div className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors shrink-0">
              <span>
                {canTrack
                  ? (hi ? 'लाइव स्थिति देखें' : 'View Live Status')
                  : (hi ? 'केस ट्रैक करें' : 'Track case')}
              </span>
              <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
            </div>
          </div>
        </button>
      </div>

      {/* 3. Simulated Reviewer Studio (Compact Single-Line Action Tiles) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {hi ? 'मॉक केस व डेमो (१-क्लिक)' : 'Mock Cases (1-Click Demo)'}
          </p>
        </div>

        {/* 2-Col Mobile / 4-Col Desktop Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {MOCK_PERSONAS.map((persona) => {
            const meta = getPersonaMeta(persona, hi);
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => onSelectPreset(persona.id)}
                className="mock-scenario-card group p-3 sm:p-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer w-full rounded-xl transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {meta.icon}
                  <h3 className="text-xs sm:text-sm font-bold text-ink truncate m-0 p-0 leading-tight">
                    {hi ? persona.nameHi : persona.name}
                  </h3>
                </div>

                <span className={`text-[11px] font-bold text-ink ${meta.accentHover} shrink-0 whitespace-nowrap transition-colors`}>
                  {hi ? 'डेमो चलाएं' : 'Simulate case'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Secondary Cyber Safety Utilities (Single-Line Inline Action Tiles) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {hi ? 'त्वरित सुरक्षा टूल्स' : 'Cyber Safety Utilities'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {/* Tool 1: AI scam analyzer */}
          <button
            type="button"
            className="hub-utility-card group cursor-pointer text-left w-full rounded-xl transition-all"
            onClick={onOpenScamAnalyzer}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Bot size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-ink truncate m-0 p-0 leading-tight">
                {hi ? 'AI स्कैम विश्लेषक' : 'AI scam analyzer'}
              </h3>
            </div>
            <span className="hub-utility-action text-amber-700 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors">
              {hi ? 'संदेश जांचें' : 'Analyze message'}
            </span>
          </button>

          {/* Tool 2: Suspicious link checker */}
          <button
            type="button"
            className="hub-utility-card group cursor-pointer text-left w-full rounded-xl transition-all"
            onClick={onOpenLinkChecker}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Globe size={18} className="text-sky-600 dark:text-sky-400 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-ink truncate m-0 p-0 leading-tight">
                {hi ? 'संदिग्ध लिंक चेकर' : 'Suspicious link checker'}
              </h3>
            </div>
            <span className="hub-utility-action text-sky-700 dark:text-sky-300 group-hover:text-sky-800 dark:group-hover:text-sky-200 transition-colors">
              {hi ? 'लिंक जांचें' : 'Check link'}
            </span>
          </button>

          {/* Tool 3: Cyber safety dashboard */}
          <button
            type="button"
            className="hub-utility-card group cursor-pointer text-left w-full rounded-xl transition-all"
            onClick={onOpenDashboard}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <LayoutDashboard size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-ink truncate m-0 p-0 leading-tight">
                {hi ? 'सुरक्षा डैशबोर्ड' : 'Cyber safety dashboard'}
              </h3>
            </div>
            <span className="hub-utility-action text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors">
              {hi ? 'डैशबोर्ड खोलें' : 'Open dashboard'}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

