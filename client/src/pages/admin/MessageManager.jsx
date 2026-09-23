import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MessageSquare,
  Search,
  Check,
  Trash2,
  Mail,
  Phone,
  Calendar,
  X,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function MessageManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-messages', search, filterRead],
    queryFn: () => {
      let url = '/contact?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (filterRead !== '') url += `is_read=${filterRead}&`;
      return api.get(url);
    }
  });

  const messages = data?.data || [];
  const unreadCount = data?.unreadCount || 0;

  const openMessage = async (msg) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.admin_notes || '');

    // Mark as read automatically if not already
    if (!msg.is_read) {
      try {
        await api.put(`/contact/${msg.id}`, { is_read: true });
        queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      } catch (e) {
        console.error('Failed to mark message read:', e);
      }
    }
  };

  const handleUpdateStatus = async (id, status, notes) => {
    try {
      await api.put(`/contact/${id}`, { status, admin_notes: notes });
      addToast('Message status updated.');
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status, admin_notes: notes });
      }
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete message from "${name}"?`)) return;
    try {
      await api.delete(`/contact/${id}`);
      addToast('Message deleted.');
      if (selectedMessage?.id === id) setSelectedMessage(null);
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    } catch (err) {
      addToast(err.message || 'Failed to delete message', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2.5">
            Contact Messages & Inquiries
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {unreadCount} Unread
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500">
            Incoming inquiries from website visitors, prospective donors, and community leaders.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={filterRead}
            onChange={e => setFilterRead(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
          >
            <option value="">All Inquiries</option>
            <option value="0">Unread Only</option>
            <option value="1">Read Only</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No contact messages received.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-4">Sender</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`cursor-pointer transition ${
                      !msg.is_read ? 'bg-emerald-50/40 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {!msg.is_read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                        )}
                        <div>
                          <span className="text-slate-900 block font-display">{msg.full_name}</span>
                          <span className="text-[11px] text-slate-400 font-normal">{msg.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-800 block truncate max-w-sm">{msg.subject}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-sm font-normal block">{msg.message}</span>
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        msg.status === 'replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-gold-100 text-gold-800'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg.id, msg.full_name);
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Reader Drawer Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
            
            <div className="bg-brand-950 text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                  Message Details
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-1">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs">
              
              {/* Sender Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">From:</span>
                  <span className="font-bold text-slate-800 text-sm font-display">{selectedMessage.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email:</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-brand-900 font-semibold hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone:</span>
                  <span className="text-slate-700">{selectedMessage.phone || 'N/A'}</span>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Message Content:</span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status Update & Admin Notes */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Internal Admin Notes & Response Status</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'reviewed', adminNotes)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'replied', adminNotes)}
                      className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px]"
                    >
                      Mark Replied
                    </button>
                  </div>
                </div>

                <textarea
                  rows="2"
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Record internal notes or follow-up summary..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply via Email Client
                </a>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
