import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Heart,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  HelpCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import SectionHeader from '../components/SectionHeader';

export default function Donate() {
  const { addToast } = useToast();
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    purposeCategory: "Quran Distribution",
    amount: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [error, setError] = useState('');

  // Fetch Bank Accounts from DB
  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['donation-accounts'],
    queryFn: () => api.get('/donations/accounts')
  });

  const accounts = accountsData?.data || [];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Account number copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/donations/pledge', {
        ...formData,
        paymentMethod: 'Direct Bank Transfer'
      });
      setSuccessReceipt({
        referenceNo: res.referenceNo,
        donorName: formData.donorName,
        purpose: formData.purposeCategory,
        amount: formData.amount,
        email: formData.email
      });
      addToast('May Allah reward your generosity! Donation notification registered.');
    } catch (err) {
      setError(err.message || 'Failed to submit donation notification.');
    } finally {
      setLoading(false);
    }
  };

  const purposes = [
    {
      title: "Qur'an Distribution",
      desc: "Endow durable Tajweed copies of the Holy Qur'an to community Madrasahs.",
      icon: BookOpen
    },
    {
      title: "Student Books & Study Packs",
      desc: "Supply notebooks, textbooks, backpacks, and writing materials.",
      icon: Sparkles
    },
    {
      title: "Vocational Skills Toolkits",
      desc: "Fund industrial sewing machines and digital kits for graduating apprentices.",
      icon: Building2
    },
    {
      title: "Clean Water Borehole",
      desc: "Construct solar-powered water boreholes for remote rural settlements.",
      icon: Heart
    },
    {
      title: "General Charity & Welfare",
      desc: "Unrestricted support directed to where urgent grassroots needs arise.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <Heart className="w-3.5 h-3.5 fill-gold-400" /> Sawaab-e-Jariyah
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Support Mariya Foundation
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Your generous charitable donation helps empower people to become self-reliant and provides students with Qur'ans and education materials.
          </p>
        </div>
      </section>

      {/* 2. PURPOSES / CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeader
          badge="Donation Categories"
          title="Select Your Designated Area of Impact"
          subtitle="Direct your charitable support to the specific program close to your heart."
          centered={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {purposes.map((p, i) => {
            const Icon = p.icon;
            const isSelected = formData.purposeCategory.toLowerCase().includes(p.title.toLowerCase().slice(0, 5));
            return (
              <div
                key={i}
                onClick={() => setFormData({ ...formData, purposeCategory: p.title })}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-gold-500 bg-gold-50/50 shadow-md ring-2 ring-gold-400/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-soft'
                }`}
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-gold-500 text-brand-950 font-bold' : 'bg-brand-50 text-brand-900'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="text-[11px] font-bold text-brand-900 flex items-center gap-1">
                  {isSelected ? '✓ Selected Category' : 'Click to Select'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. OFFICIAL BANK TRANSFER ACCOUNTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          badge="Payment Methods"
          title="Direct Bank Transfer Accounts"
          subtitle="Transfer directly to the foundation's non-interest bank accounts. Use one-click copy below."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`p-6 rounded-3xl border transition shadow-soft flex flex-col justify-between space-y-5 ${
                acc.is_primary ? 'bg-brand-950 text-white border-brand-800' : 'bg-white text-slate-900 border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    acc.is_primary ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {acc.is_primary ? '★ Primary Account' : 'Designated Account'}
                  </span>
                  <span className={`text-xs font-bold ${acc.is_primary ? 'text-gold-400' : 'text-brand-900'}`}>
                    {acc.currency}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold font-display">{acc.bank_name}</h4>
                  <p className={`text-xs mt-0.5 ${acc.is_primary ? 'text-emerald-200/80' : 'text-slate-500'}`}>
                    {acc.account_name}
                  </p>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                  acc.is_primary ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className={`text-[10px] uppercase font-bold block ${acc.is_primary ? 'text-slate-300' : 'text-slate-400'}`}>
                      Account Number:
                    </span>
                    <span className="font-mono font-bold text-base tracking-wider">
                      {acc.account_number}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(acc.account_number.replace(/\D/g, '') || acc.account_number, acc.id)}
                    className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      acc.is_primary
                        ? 'bg-gold-500 hover:bg-gold-400 text-brand-950'
                        : 'bg-brand-900 hover:bg-brand-800 text-white'
                    }`}
                    title="Copy account number"
                  >
                    {copiedId === acc.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {acc.instructions && (
                  <p className={`text-xs leading-relaxed ${acc.is_primary ? 'text-emerald-100/70' : 'text-slate-500'}`}>
                    {acc.instructions}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-slate-800 text-xs text-center max-w-2xl mx-auto space-y-1">
          <p className="font-semibold text-amber-900">
            * Note on Official Foundation Bank Details:
          </p>
          <p className="text-slate-600">
            Clearly marked placeholder account numbers are shown above for this demo. Official banking information will be published upon live deployment.
          </p>
        </div>
      </section>

      {/* 4. DONATION NOTIFICATION / PLEDGE FORM */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          
          <div className="bg-gradient-to-r from-gold-600 via-amber-600 to-gold-500 text-white p-8 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full">
              Donation Receipt & Confirmation
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Notify Us of Your Donation / Pledge
            </h3>
            <p className="text-xs text-white/90 max-w-md mx-auto">
              Please submit this quick form after making your bank transfer to receive your confirmation tracking reference.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            {successReceipt ? (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 font-display">
                  Jazakallahu Khairan!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  May Allah bless and multiply your wealth. Your donation notification has been registered for:
                </p>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500 font-sans">Reference:</span>
                    <span className="font-bold text-brand-900">{successReceipt.referenceNo}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500 font-sans">Donor:</span>
                    <span className="font-bold text-slate-800">{successReceipt.donorName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500 font-sans">Purpose:</span>
                    <span className="font-bold text-brand-900">{successReceipt.purpose}</span>
                  </div>
                  {successReceipt.amount && (
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-slate-500 font-sans">Amount:</span>
                      <span className="font-bold text-slate-800">₦{Number(successReceipt.amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500 font-sans">Verification:</span>
                    <span className="text-amber-600 font-bold uppercase font-sans">Logged / Awaiting Audit</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSuccessReceipt(null);
                      setFormData({
                        donorName: '',
                        email: '',
                        phone: '',
                        purposeCategory: "Quran Distribution",
                        amount: '',
                        notes: ''
                      });
                    }}
                    className="px-6 py-2.5 bg-brand-900 text-white font-bold rounded-xl text-xs"
                  >
                    Submit Another Notification
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit} className="space-y-4">
                
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name / Org Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.donorName}
                      onChange={e => setFormData({ ...formData, donorName: e.target.value })}
                      placeholder="e.g. Alhaji Mustapha or Anonymous"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="donor@example.com"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="08012345678"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Donation Purpose *
                    </label>
                    <select
                      value={formData.purposeCategory}
                      onChange={e => setFormData({ ...formData, purposeCategory: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    >
                      <option value="Quran Distribution">Qur'an Distribution</option>
                      <option value="Student Books & Study Packs">Student Books & Study Packs</option>
                      <option value="Vocational Skills Toolkits">Vocational Skills Toolkits</option>
                      <option value="Clean Water Borehole">Clean Water Borehole</option>
                      <option value="General Charity & Welfare">General Charity & Welfare</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Amount (₦ Optional)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="e.g. 50000"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Note or Dedication (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Sadaqah Jariyah for late parents, or specific Madrasah request"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 via-amber-600 to-gold-500 text-white font-bold text-sm shadow-md hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Logging Notification...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 fill-white" />
                        Submit Donation Notification
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* 5. FUTURE PAYSTACK ONLINE CARD GATEWAY INTEGRATION NOTICE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 shadow-sm flex-shrink-0">
              <CreditCard className="w-5 h-5 text-brand-800" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">Online Payment Gateway Integration (Paystack / Stripe)</span>
              <span>The architecture is configured to support direct automated debit card donations in upcoming releases.</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold uppercase tracking-wider whitespace-nowrap text-[10px]">
            Future Expansion Ready
          </span>
        </div>
      </section>

    </div>
  );
}
