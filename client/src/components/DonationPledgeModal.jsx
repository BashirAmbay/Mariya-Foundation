import React, { useState } from 'react';
import { X, Check, Copy, Heart, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function DonationPledgeModal({ isOpen, onClose, selectedPurpose = 'General Charity' }) {
  const { addToast } = useToast();
  const [copiedAccount, setCopiedAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    purposeCategory: selectedPurpose,
    amount: '',
    notes: ''
  });

  if (!isOpen) return null;

  const copyToClipboard = (text, identifier) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(identifier);
    addToast('Account details copied to clipboard!', 'info');
    setTimeout(() => setCopiedAccount(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/donations/pledge', {
        ...formData,
        paymentMethod: 'Bank Transfer'
      });
      setSuccessData({
        referenceNo: res.referenceNo,
        donorName: formData.donorName,
        purpose: formData.purposeCategory,
        amount: formData.amount
      });
      addToast('May Allah reward your generosity! Donation notification registered.');
    } catch (err) {
      setError(err.message || 'Failed to submit donation notification.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
              Sadaqah & Education Sponsorship
            </span>
          </div>
          <h3 className="text-2xl font-bold font-display mt-1 text-white">
            Support Mariya Nuuman Foundation
          </h3>
          <p className="text-xs text-white/90 mt-1">
            Official bank transfer payment information and donation notification form.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 font-display">
                Jazakallahu Khairan!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong className="text-slate-900">{successData.donorName}</strong>. Your donation notification for <span className="font-semibold text-brand-900">{successData.purpose}</span> has been logged.
              </p>
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left max-w-md mx-auto text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking Reference:</span>
                  <span className="font-mono font-bold text-brand-900">{successData.referenceNo}</span>
                </div>
                {successData.amount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pledged Amount:</span>
                    <span className="font-semibold text-slate-900">₦{Number(successData.amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-gold-600 font-semibold uppercase">Pending Verification</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic max-w-sm mx-auto">
                Please complete your bank transfer using the account details provided if you have not already done so.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-brand-900 text-white font-semibold rounded-xl hover:bg-brand-800 transition text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Bank Transfer Information Notice */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-brand-900 flex items-center gap-1.5">
                    Primary Bank Transfer Account
                  </span>
                  <span className="text-[11px] text-brand-700 bg-brand-100 px-2 py-0.5 rounded font-medium">
                    Non-Interest Banking
                  </span>
                </div>
                
                <div className="bg-white p-3.5 rounded-lg border border-emerald-100 shadow-sm space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                    <span className="text-slate-500 text-xs">Bank Name:</span>
                    <span className="font-bold text-slate-800">Jaiz Bank Plc</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                    <span className="text-slate-500 text-xs">Account Name:</span>
                    <span className="font-semibold text-slate-800">Mariya Nuuman Foundation</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500 text-xs block">Account Number (Placeholder):</span>
                      <span className="font-mono font-bold text-brand-900 text-base tracking-wider">0000000000</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('0000000000', 'jaiz')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 transition"
                    >
                      {copiedAccount === 'jaiz' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedAccount === 'jaiz' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  * Note: Official foundation bank details will be updated once active deployment verification is complete.
                </p>
              </div>

              {/* Notification Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Record Your Donation Notification / Pledge
                  </h4>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
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
                      placeholder="e.g. Alhaji Mustapha / Anonymous"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
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
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
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
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Donation Purpose *
                    </label>
                    <select
                      value={formData.purposeCategory}
                      onChange={e => setFormData({ ...formData, purposeCategory: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    >
                      <option value="Quran Distribution">Qur'an Distribution</option>
                      <option value="Student Books & Supplies">Student Books & Supplies</option>
                      <option value="Vocational Skills & Equipment">Vocational Skills & Tools</option>
                      <option value="Clean Water Borehole">Clean Water Borehole</option>
                      <option value="Ramadan & Food Relief">Ramadan / Food Relief</option>
                      <option value="General Charity">General Charity & Welfare</option>
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
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
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
                    placeholder="e.g. In memory of our late parents, for Tahfeez students"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 text-white text-sm font-bold rounded-xl shadow hover:brightness-110 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 fill-white" />
                        Notify Foundation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
