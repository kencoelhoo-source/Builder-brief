import React from 'react';
import { X, ShieldAlert, Image, Hash, MessageSquare, Zap } from 'lucide-react';
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
      num: '01',
      icon: Zap,
      titleEn: 'Report as quickly as possible',
      titleHi: 'जितनी जल्दी हो सके रिपोर्ट करें',
      descEn: (
        <>
          The faster you report, the easier it is for your bank to <strong className="font-bold text-ink">freeze the money</strong> before the scammer moves it to other accounts.
        </>
      ),
      descHi: (
        <>
          जितनी जल्दी आप रिपोर्ट करेंगे, बैंक के लिए धोखाधड़ी करने वाले के खाते में <strong className="font-bold text-ink">पैसे रोकना (फ्रीज करना)</strong> उतना ही आसान होगा।
        </>
      ),
    },
    {
      num: '02',
      icon: ShieldAlert,
      titleEn: 'Never enter your UPI PIN to receive money',
      titleHi: 'पैसे पाने के लिए कभी UPI पिन न डालें',
      descEn: (
        <>
          Receiving money or refunds <strong className="font-bold text-ink">NEVER requires entering your UPI PIN</strong> or sharing OTPs. If anyone asks you to enter a PIN to receive money, it is a scam.
        </>
      ),
      descHi: (
        <>
          पैसे या रिफंड प्राप्त करने के लिए <strong className="font-bold text-ink">कभी भी UPI पिन या OTP की ज़रूरत नहीं होती</strong>। अगर कोई पैसे देने के लिए पिन डालने को कहे, तो वह फ्रॉड है।
        </>
      ),
    },
    {
      num: '03',
      icon: Image,
      titleEn: 'Keep original, uncropped screenshots',
      titleHi: 'स्क्रीनशॉट को क्रॉप या एडिट न करें',
      descEn: (
        <>
          <strong className="font-bold text-ink">Do not crop, edit, or filter</strong> payment slips, transaction screens, or bank SMS. Full timestamps and account details help banks verify evidence faster.
        </>
      ),
      descHi: (
        <>
          पेमेंट रसीद या बैंक SMS के स्क्रीनशॉट को <strong className="font-bold text-ink">क्रॉप या एडिट न करें</strong>। पूरा समय और तारीख दिखने से बैंक और पुलिस को जांच में आसानी होती है।
        </>
      ),
    },
    {
      num: '04',
      icon: Hash,
      titleEn: 'Find your 12-digit UPI UTR number',
      titleHi: '12 अंकों का UPI UTR नंबर निकालें',
      descEn: (
        <>
          Open your payment app (Google Pay, PhonePe, Paytm, or banking app) and locate the <strong className="font-bold text-ink">12-digit UTR or transaction ID</strong>. This is the main reference banks use to trace the funds.
        </>
      ),
      descHi: (
        <>
          अपने पेमेंट ऐप (GPay, PhonePe, Paytm या बैंक ऐप) में जाकर लेन-देन का <strong className="font-bold text-ink">12-अंकों का UTR / Transaction ID</strong> निकालें। इसी नंबर से बैंक पैसे ट्रैक करता है।
        </>
      ),
    },
    {
      num: '05',
      icon: MessageSquare,
      titleEn: 'Save chat logs and profile links before blocking',
      titleHi: 'ब्लॉक करने से पहले चैट और प्रोफाइल लिंक सेव करें',
      descEn: (
        <>
          For fake accounts, threats, or harassment, <strong className="font-bold text-ink">take screenshots of full chats and copy their profile link</strong> before deleting messages or blocking the account.
        </>
      ),
      descHi: (
        <>
          फर्जी प्रोफाइल, धमकी या ब्लैकमेल के मामलों में आरोपी को ब्लॉक करने से पहले <strong className="font-bold text-ink">पूरी चैट के स्क्रीनशॉट लें और प्रोफाइल लिंक कॉपी करें</strong>।
        </>
      ),
    },
  ];

  const [isClosing, setIsClosing] = React.useState(false);

  const handleSmoothClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(onClose, 150);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-3 sm:p-5 overflow-y-auto overscroll-contain ${
        isClosing ? 'modal-backdrop-exit' : 'modal-backdrop-enter'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleSmoothClose();
      }}
    >
      <div
        className={`bg-card w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border border-line-strong shadow-2xl overflow-hidden overscroll-contain ${
          isClosing ? 'modal-content-exit' : 'modal-content-enter'
        }`}
      >
        {/* Calm, Clean Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-line">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
              {hi ? 'महत्वपूर्ण बातें और सुझाव' : 'Important Tips & Steps'}
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1 leading-normal">
              {hi
                ? 'पैसे सुरक्षित रखने और शिकायत को मजबूत बनाने के लिए जरूरी दिशानिर्देश।'
                : 'Simple, essential steps to help freeze fraud transactions and preserve evidence.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSmoothClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-soft hover:bg-line border border-line flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Minimalist, Clean Checklist */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain divide-y divide-line/60 flex flex-col text-ink">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.num}
                className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 sm:gap-3.5"
              >
                <Icon size={18} className="text-ink shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-ink leading-snug">
                    {hi ? tip.titleHi : tip.titleEn}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    {hi ? tip.descHi : tip.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean, Simple Footer */}
        <div className="p-4 sm:p-5 border-t border-line bg-soft/30 flex justify-end">
          <button
            type="button"
            onClick={handleSmoothClose}
            className="btn-primary !h-10 !px-8 !text-xs !font-bold !rounded-full w-full sm:w-auto cursor-pointer"
          >
            {hi ? 'समझ गया' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
