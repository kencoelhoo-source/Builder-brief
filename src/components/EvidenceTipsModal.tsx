import React from 'react';
import { X, FileCheck2, Clock, MessageSquare, Hash, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';
import type { Language } from '../types';

interface EvidenceTipsModalProps {
  currentLang: Language;
  onClose: () => void;
}

export const EvidenceTipsModal: React.FC<EvidenceTipsModalProps> = ({
  currentLang,
  onClose,
}) => {
  const hi = currentLang === 'hi';

  const tips = [
    {
      id: 'unedited-proof',
      icon: FileCheck2,
      badge: hi ? 'साक्ष्य अखंडता' : 'Evidence Integrity',
      title: hi ? 'मूल साक्ष्य को क्रॉप या एडिट न करें' : 'Keep original unedited evidence',
      desc: hi
        ? 'लेनदेन के स्क्रीनशॉट, पेमेंट रसीद या बैंक SMS को कभी एडिट या क्रॉप न करें। स्पष्ट टाइमस्टैम्प और मूल फाइल मेटाडेटा से बैंक व पुलिस प्रक्रिया तेज होती है।'
        : 'Do not crop, edit, or filter your transaction screenshots, payment slips, or bank SMS messages. Unedited metadata and visible timestamps ensure fastest Section 91 CrPC notice dispatch.',
      highlight: hi ? 'धारा 91 CrPC / BNS साक्ष्य' : 'Sec 91 CrPC Legal Proof',
    },
    {
      id: 'golden-hour',
      icon: Clock,
      badge: hi ? 'गोल्डन ऑवर (2 घंटे)' : 'Golden Hour (2 Hours)',
      title: hi ? 'पहले 2 घंटों के भीतर रिपोर्ट करें' : 'Report within the first 2 hours',
      desc: hi
        ? 'वित्तीय धोखाधड़ी की तुरंत रिपोर्ट करें। पहले 2 घंटों में रिपोर्ट करने से दोनों बैंकों (डेबिट व क्रेडिट) के बीच नोडल होल्ड लगाना और म्यूल खातों में पैसा फंसने से पहले फ्रीज करना सबसे आसान होता है।'
        : 'Report financial cyber fraud immediately. Prompt reporting enables dual-bank lien holds (CFCFRMS) before fraudsters disperse illicit funds across multi-tier mule account rings.',
      highlight: hi ? 'नोडल बैंक लियन होल्ड' : 'Dual-Bank Hold Protocol',
    },
    {
      id: 'social-proof',
      icon: MessageSquare,
      badge: hi ? 'सोशल साक्ष्य' : 'Social Cybercrime',
      title: hi ? 'चैट और प्रोफाइल URL सुरक्षित रखें' : 'Preserve raw chat logs & profile URLs',
      desc: hi
        ? 'फेक प्रोफाइल, ब्लैकमेल या मानहानि के मामलों में चैट का एक्सपोर्ट लें, प्रोफाइल लिंक (URL) कॉपी करें और फोन नंबर नोट करें। आरोपी को ब्लॉक करने से पहले चैट का बैकअप लें।'
        : 'For impersonation, extortion, or defamatory threats, export raw chat logs with phone numbers, voice notes, and exact profile URLs before deleting or blocking accounts.',
      highlight: hi ? 'धारा 79 IT Act 36h टेकडाउन' : 'Sec 79 IT Act 36h Takedown',
    },
    {
      id: 'utr-tracking',
      icon: Hash,
      badge: hi ? 'ट्रैकिंग पहचानकर्ता' : 'Telemetry Identifier',
      title: hi ? '12-अंकीय UPI UTR नंबर संभाल कर रखें' : 'Keep 12-digit UPI UTR number ready',
      desc: hi
        ? 'बैंक ऐप या पासबुक में 12 अंकों का UPI UTR / RRN नंबर दर्ज होता है। यह नंबर राष्ट्रीय साइबर क्राइम पोर्टल और बैंक फ्रॉड रडार पर फंड ट्रेल ट्रेस करने के लिए आवश्यक है।'
        : 'Locate the 12-digit UPI UTR (Unique Transaction Reference) or IMPS RRN in your banking app. This cryptographic reference enables instant telemetry tracking on national cyber portals.',
      highlight: hi ? 'फंड रडार ट्रैकिंग' : 'Fund Trail Telemetry',
    },
    {
      id: 'never-otp',
      icon: ShieldAlert,
      badge: hi ? 'सुरक्षा नियम' : 'Crucial Safety Rule',
      title: hi ? 'रिफंड के लिए कभी OTP या UPI पिन न डालें' : 'Never enter UPI PIN to receive refunds',
      desc: hi
        ? 'पैसे प्राप्त करने या रिफंड के लिए कभी भी UPI पिन दर्ज करने की आवश्यकता नहीं होती। कोई भी बैंक अधिकारी या पुलिस कर्मी आपसे डेबिट OTP या पासवर्ड नहीं मांगता।'
        : 'Receiving money or getting a refund NEVER requires entering your UPI PIN or sharing OTPs. Legitimate banks and cyber police officers will never request verification PINs.',
      highlight: hi ? 'एंटी-फ़िशिंग नियम' : 'Zero-Trust Verification',
    },
    {
      id: 'court-petition',
      icon: Scale,
      badge: hi ? 'न्यायिक धनवापसी' : 'Fund Recovery Protocol',
      title: hi ? 'फ्रीज फंड वापसी हेतु धारा 457 CrPC याचिका' : 'Recover frozen funds via Sec 457 CrPC petition',
      desc: hi
        ? 'यदि आपका पैसा पुलिस द्वारा संदिग्ध खाते में फ्रीज कर लिया गया है, तो मजिस्ट्रेट न्यायालय में धारा 457 CrPC के तहत याचिका दायर कर कानूनी रूप से अपना पैसा वापस प्राप्त करें।'
        : 'Once police secure and freeze the defrauded amount in destination mule accounts under Section 102 CrPC, file a Section 457 CrPC refund petition in court to release the seized funds.',
      highlight: hi ? 'धारा 457 CrPC कोर्ट रिफंड' : 'Sec 457 CrPC Judicial Return',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-card w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border border-line-strong shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-soft border border-line text-[11px] font-bold text-ink mb-1.5">
              <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>{hi ? 'दिशानिर्देश व सर्वोत्तम प्रथाएं' : 'Guidelines & Best Practices'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
              {hi ? 'साक्ष्य व रिपोर्टिंग सुरक्षा सुझाव' : 'Evidence & Reporting Tips'}
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              {hi
                ? 'साइबर अपराध रिपोर्टिंग और त्वरित धनवापसी के लिए कानूनी व डिजिटल सुरक्षा नियम।'
                : 'Statutory guidelines and digital hygiene to ensure fast bank freezes and strong legal evidence.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-soft hover:bg-card-hover border border-line flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable Tips Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-3.5 sm:gap-4 text-ink">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.id}
                className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-line hover:border-line-strong transition-all shadow-2xs flex items-start gap-3.5"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-soft border border-line flex items-center justify-center shrink-0 text-ink mt-0.5">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-soft border border-line text-muted">
                      {tip.badge}
                    </span>
                    <span className="text-[10px] font-semibold text-accent dark:text-[#d4a359]">
                      {tip.highlight}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-ink">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    {tip.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-line flex items-center justify-between gap-4 bg-soft/40">
          <span className="text-xs text-muted hidden sm:inline">
            {hi ? 'कवच · नागरिक साइबर सहायता' : 'Kavach · Citizen Cyber Defense'}
          </span>
          <div className="w-full sm:w-auto ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary !h-10 !px-6 !text-xs !font-bold !rounded-full w-full sm:w-auto cursor-pointer"
            >
              {hi ? 'समझ गया, वापस जाएं' : 'Got it, continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
