import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  HeartHandshake,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function DonationManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountForm, setAccountForm] = useState({
    bank_name: '',
    account_name: 'Mariya Nuuman Foundation',
    account_number: '',
    routing_or_iban: '',
    currency: 'NGN',
    instructions: '',
    is_primary: false,
    is_active: true
  });
  const [savingAccount, setSavingAccount] = useState(false);

  // 1. Fetch Accounts
  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['admin-donation-accounts'],
    queryFn: () => api.get('/donations/accounts/all')
  });

  // 2. Fetch Pledges
  const { data: pledgesData, isLoading: pledgesLoading } = useQuery({
    queryKey: ['admin-donation-pledges'],
    queryFn: () => api.get('/donations/pledges')
  });

  const accounts = accountsData?.data || [];
  const pledges = pledgesData?.data || [];

  const openCreateAccountModal = () => {
    setEditingAccount(null);
    setAccountForm({
      bank_name: '',
      account_name: 'Mariya Nuuman Foundation',
      account_number: '',
      routing_or_iban: '',
      currency: 'NGN',
      instructions: '',
      is_primary: false,
      is_active: true
    });
    setIsAccountModalOpen(true);
  };

  const openEditAccountModal = (acc) => {
    setEditingAccount(acc);
    setAccountForm({
      bank_name: acc.bank_name,
      account_name: acc.account_name,
      account_number: acc.account_number,
      routing_or_iban: acc.routing_or_iban || '',
      currency: acc.currency || 'NGN',
      instructions: acc.instructions || '',
      is_primary: Boolean(acc.is_primary),
      is_active: Boolean(acc.is_active)
    });
    setIsAccountModalOpen(true);
  };

  const handleDeleteAccount = async (id, bank) => {
    if (!window.confirm(`Delete bank account "${bank}"?`)) return;
    try {
      await api.delete(`/donations/accounts/${id}`);
      addToast('Account deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin-donation-accounts'] });
    } catch (err) {
      addToast(err.message || 'Failed to delete account', 'error');
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setSavingAccount(true);

    try {
      if (editingAccount) {
        await api.put(`/donations/accounts/${editingAccount.id}`, accountForm);
        addToast('Donation account updated.');
      } else {
        await api.post('/donations/accounts', accountForm);
        addToast('Donation account created.');
      }
      setIsAccountModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-donation-accounts'] });
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleUpdatePledgeStatus = async (id, status) => {
    try {
      await api.put(`/donations/pledges/${id}`, { status });
      addToast(`Pledge status updated to ${status}.`);
      queryClient.invalidateQueries({ queryKey: ['admin-donation-pledges'] });
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="space-y-10">
      
      {/* 1. BANK ACCOUNTS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Donation Bank Accounts
            </h2>
            <p className="text-xs text-slate-500">
              Manage bank accounts displayed to donors for direct wire transfers.
            </p>
          </div>
          <button
            onClick={openCreateAccountModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Bank Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`p-5 rounded-2xl border shadow-soft flex flex-col justify-between space-y-4 ${
                acc.is_primary ? 'bg-brand-950 text-white border-brand-800' : 'bg-white text-slate-900 border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    acc.is_primary ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {acc.is_primary ? '★ Primary Account' : 'Secondary Account'}
                  </span>
                  <span className="text-xs font-bold font-mono">{acc.currency}</span>
                </div>

                <h3 className="font-bold text-base font-display">{acc.bank_name}</h3>
                <p className={`text-xs ${acc.is_primary ? 'text-emerald-200' : 'text-slate-500'}`}>{acc.account_name}</p>

                <div className={`p-2.5 rounded-xl border text-xs font-mono font-bold ${
                  acc.is_primary ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'
                }`}>
                  {acc.account_number}
                </div>

                {acc.instructions && (
                  <p className={`text-[11px] leading-relaxed ${acc.is_primary ? 'text-emerald-100/70' : 'text-slate-400'}`}>
                    {acc.instructions}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/20 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditAccountModal(acc)}
                  className={`p-1.5 rounded-lg text-xs font-semibold ${
                    acc.is_primary ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteAccount(acc.id, acc.bank_name)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DONATION PLEDGES / NOTICES TABLE */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Donation Notifications & Tracking Logs
          </h2>
          <p className="text-xs text-slate-500">
            Log of donors who submitted bank transfer notifications and references.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          {pledgesLoading ? (
            <div className="p-12 text-center text-slate-400">Loading donation notices...</div>
          ) : pledges.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No donation notices logged yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Donor Details</th>
                    <th className="p-4">Purpose Category</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pledges.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-mono font-bold text-brand-900">
                        {p.reference_no}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800 block text-sm font-display">{p.donor_name}</span>
                        <span className="text-[11px] text-slate-400 block">{p.email} • {p.phone || 'N/A'}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {p.purpose_category}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {p.amount ? `₦${Number(p.amount).toLocaleString()}` : 'Unspecified'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gold-100 text-gold-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status !== 'verified' && (
                            <button
                              onClick={() => handleUpdatePledgeStatus(p.id, 'verified')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10.5px]"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Account Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="bg-brand-950 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  {editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}
                </h3>
              </div>
              <button onClick={() => setIsAccountModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAccountSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  value={accountForm.bank_name}
                  onChange={e => setAccountForm({ ...accountForm, bank_name: e.target.value })}
                  placeholder="e.g. Jaiz Bank Plc"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Name *</label>
                <input
                  type="text"
                  required
                  value={accountForm.account_name}
                  onChange={e => setAccountForm({ ...accountForm, account_name: e.target.value })}
                  placeholder="Mariya Nuuman Foundation"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Number *</label>
                  <input
                    type="text"
                    required
                    value={accountForm.account_number}
                    onChange={e => setAccountForm({ ...accountForm, account_number: e.target.value })}
                    placeholder="0000000000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={accountForm.currency}
                    onChange={e => setAccountForm({ ...accountForm, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions / Description</label>
                <textarea
                  rows="2"
                  value={accountForm.instructions}
                  onChange={e => setAccountForm({ ...accountForm, instructions: e.target.value })}
                  placeholder="For general charity and Quran distribution..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountForm.is_primary}
                    onChange={e => setAccountForm({ ...accountForm, is_primary: e.target.checked })}
                    className="rounded text-brand-900"
                  />
                  <span>Set as Primary Bank Account</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAccount}
                  className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl shadow transition"
                >
                  {savingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Account'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
