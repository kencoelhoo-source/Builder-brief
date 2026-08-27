import React, { useEffect, useState } from 'react';
import type { ExtractedTransaction, Language, CFCFRMSPayload, RadarNode } from '../types';
import { formatINR } from '../utils/formatters';
import { getBankNodalOfficer } from '../data/bankNodalDirectory';

interface FundTrailRadarProps {
  transaction: ExtractedTransaction;
  payload: CFCFRMSPayload;
  currentLang: Language;
  onOpenCourtPetition: () => void;
  onViewReceipt: () => void;
  onBack: () => void;
}

export const FundTrailRadar: React.FC<FundTrailRadarProps> = ({
  transaction,
  payload,
  currentLang,
  onOpenCourtPetition,
  onViewReceipt,
  onBack,
}) => {
  const hi = currentLang === 'hi';
  const [, setActiveStep] = useState<number>(1);
  const benOfficer = getBankNodalOfficer(transaction.beneficiaryBank);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const nodes: RadarNode[] = [
    {
      id: 'node-0',
      label: hi ? 'पीड़ित का खाता' : 'Your account',
      subLabel: `${transaction.victimName} (${transaction.remitterBank})`,
      tier: 0,
      amount: transaction.amount,
      status: 'DISPATCHED',
      statusLabel: 'Debit confirmed',
      statusLabelHi: 'डेबिट पुष्टि',
      bankName: transaction.remitterBank,
      accountMasked: transaction.remitterAccount,
    },
    {
      id: 'node-1',
      label: hi ? 'संदिग्ध खाता' : 'Suspect account',
      subLabel: `${transaction.beneficiaryVpa} (${transaction.beneficiaryBank})`,
      tier: 1,
      amount: transaction.amount,
      status: 'LIEN_LOCKED',
      statusLabel: 'Lien marked — frozen',
      statusLabelHi: 'लियन — फ्रीज',
      bankName: transaction.beneficiaryBank,
      accountMasked: 'XXXX-8921',
      frozenAt: 'Intercepted',
    },
    {
      id: 'node-2',
      label: hi ? 'मध्यस्थ खाता' : 'Intermediary account',
      subLabel: 'IndusInd Bank',
      tier: 2,
      amount: Math.round(transaction.amount * 0.45),
      status: 'INTERCEPTED',
      statusLabel: 'Transfer intercepted',
      statusLabelHi: 'अंतरण रोका गया',
      bankName: 'IndusInd Bank',
      accountMasked: 'XXXX-5512',
    },
    {
      id: 'node-3',
      label: hi ? 'नकद निकासी' : 'Cash withdrawal',
      subLabel: 'ATM switch',
      tier: 3,
      amount: Math.round(transaction.amount * 0.55),
      status: 'BLOCKED',
      statusLabel: 'Withdrawal blocked',
      statusLabelHi: 'निकासी ब्लॉक',
      bankName: 'ATM Switch Terminal',
      accountMasked: 'Card #4912',
    },
  ];

  return (
    <div className="page-wrap page-stack max-w-3xl">
      <p className="mb-6">
        <button type="button" className="btn-link" onClick={onBack}>
          ← {hi ? 'फ्रीज पर लौटें' : 'Back to freeze'}
        </button>
      </p>
      <p className="text-success font-bold">
        {hi ? 'आदेश लागू हो गया' : 'The order has been applied'}
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mt-2">
        {hi
          ? `${formatINR(transaction.amount)} फ्रीज कर दी गई है`
          : `${formatINR(transaction.amount)} has been frozen`}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {hi
          ? `पावती ${payload.ackNumber}। राशि मजिस्ट्रेट आदेश तक सुरक्षित है।`
          : `Acknowledgment ${payload.ackNumber}. The funds stay held until a magistrate restoration order.`}
      </p>

      {/* Intercept Trail Nodes */}
      <ol className="mt-10 border-t border-line">
        {nodes.map((node) => (
          <li key={node.id} className="py-5 border-b border-line flex flex-col sm:flex-row sm:justify-between gap-2">
            <div>
              <p className="font-bold text-lg">{node.label}</p>
              <p className="text-muted mt-1">{node.subLabel}</p>
            </div>
            <div className="sm:text-right">
              <p className="font-mono font-bold">₹{node.amount.toLocaleString('en-IN')}</p>
              <p className="text-muted mt-1">{hi ? node.statusLabelHi : node.statusLabel}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Automated Senior Escalation Ladder */}
      <div className="mt-10 pt-8 border-t border-line">
        <h2 className="text-xl font-bold">
          {hi ? 'स्वचालित वरिष्ठ अधिकारी एस्केलेशन (Escalation Ladder)' : 'Automated Senior Escalation Ladder'}
        </h2>
        <p className="mt-2 text-muted text-sm leading-relaxed">
          {hi
            ? 'यदि बैंक या नोडल अधिकारी निर्धारित समय सीमा में कार्रवाई नहीं करते, तो प्रणाली शिकायत को स्वचालित रूप से वरिष्ठ अधिकारियों को प्रेषित करती है:'
            : 'If initial freeze actions are unacknowledged or unverified, this case is automatically routed up the statutory hierarchy:'}
        </p>

        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl border border-line bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#15803d]" />
                <p className="font-bold text-sm text-ink">{hi ? 'स्तर 1: नोडल अधिकारी (तत्काल)' : 'Level 1: Bank Nodal Officer (Immediate)'}</p>
              </div>
              <p className="text-xs text-muted mt-1">{benOfficer.bankName} · {benOfficer.nodalEmail}</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-soft text-[#15803d] border border-line">
              {hi ? 'प्रेषित / सक्रिय' : 'Dispatched / Active'}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-line bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <p className="font-bold text-sm text-ink">{hi ? 'स्तर 2: मुख्य सूचना सुरक्षा अधिकारी (CISO) व धोखाधड़ी नियंत्रण प्रमुख' : 'Level 2: CISO & Head of Fraud Risk'}</p>
              </div>
              <p className="text-xs text-muted mt-1">{benOfficer.cyberCellHead} · {benOfficer.escalationEmail}</p>
            </div>
            <span className="text-xs font-medium text-muted">
              {hi ? '24 घंटे में स्वतः एस्केलेट' : 'Auto-escalates in 24h'}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-line bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6b7280]" />
                <p className="font-bold text-sm text-ink">{hi ? 'स्तर 3: RBI बैंकिंग लोकपाल एवं साइबर क्राइम कमांड' : 'Level 3: RBI Banking Ombudsman & Cyber Crime SP'}</p>
              </div>
              <p className="text-xs text-muted mt-1">{benOfficer.jurisdiction}</p>
            </div>
            <span className="text-xs font-medium text-muted">
              {hi ? '72 घंटे में वैधानिक रिपोर्ट' : 'Statutory dossier in 72h'}
            </span>
          </div>
        </div>
      </div>

      {/* Next Step / Court Petition */}
      <h2 className="text-xl font-bold mt-10">
        {hi ? 'धन वापसी (अगला कानूनी कदम)' : 'Get the money back (Next Legal Step)'}
      </h2>
      <p className="mt-2 text-muted text-sm leading-relaxed">
        {hi
          ? 'राशि बैंकिंग लेयर में सुरक्षित फ्रीज हो चुकी है। अब धारा 457 CrPC / 503 BNSS के तहत मजिस्ट्रेट याचिका द्वारा यह रकम आपके खाते में लौटाई जाएगी।'
          : 'Funds are securely locked in the banking layer. A Magistrate Restoration Petition (under Section 457 CrPC / 503 BNSS) is now required to legally release and restore the frozen money directly to your account.'}
      </p>
      <div className="btn-group mt-6">
        <button type="button" onClick={onOpenCourtPetition} className="btn-primary">
          {hi ? 'न्यायालय याचिका' : 'Generate court petition'}
        </button>
        <button type="button" onClick={onViewReceipt} className="btn-secondary">
          {hi ? 'पावती' : 'Download receipt'}
        </button>
      </div>
    </div>
  );
};
