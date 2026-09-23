import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Check,
  Trash2,
  Mail,
  Phone,
  Calendar,
  X,
  Clock,
  CheckCircle2,
  MapPin,
  Briefcase
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function VolunteerManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-volunteers', search, statusFilter],
    queryFn: () => {
      let url = '/volunteers?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (statusFilter) url += `status=${statusFilter}&`;
      return api.get(url);
    }
  });

  const applications = data?.data || [];
  const pendingCount = data?.pendingCount || 0;

  const openVolunteer = (vol) => {
    setSelectedVolunteer(vol);
    setAdminNotes(vol.admin_notes || '');
  };

  const handleUpdateStatus = async (id, status, notes) => {
    try {
      await api.put(`/volunteers/${id}`, { status, admin_notes: notes });
      addToast(`Status updated to "${status}".`);
      queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] });
      if (selectedVolunteer?.id === id) {
        setSelectedVolunteer({ ...selectedVolunteer, status, admin_notes: notes });
      }
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete application for "${name}"?`)) return;
    try {
      await api.delete(`/volunteers/${id}`);
      addToast('Application deleted.');
      if (selectedVolunteer?.id === id) setSelectedVolunteer(null);
      queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] });
    } catch (err) {
      addToast(err.message || 'Failed to delete application', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2.5">
            Volunteer Applications
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-500 text-brand-950">
                {pendingCount} Pending Review
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500">
            Review community volunteers offering teaching, logistics, vocational mentoring, and media skills.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="contacted">Contacted</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading volunteer applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No volunteer applications logged.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Area of Interest</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((vol) => (
                  <tr
                    key={vol.id}
                    onClick={() => openVolunteer(vol)}
                    className="cursor-pointer hover:bg-slate-50 transition"
                  >
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 text-sm font-display block">{vol.full_name}</span>
                        <span className="text-[11px] text-slate-400 block">{vol.email} • {vol.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-brand-900">
                      {vol.area_of_interest}
                    </td>
                    <td className="p-4 text-slate-600">
                      {vol.availability}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        vol.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        vol.status === 'pending' ? 'bg-gold-100 text-gold-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {vol.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(vol.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(vol.id, vol.full_name);
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        title="Delete Application"
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

      {/* Volunteer Modal Drawer */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
            
            <div className="bg-brand-950 text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                  Volunteer Application Profile
                </span>
                <h3 className="text-xl font-bold font-display text-white mt-1">
                  {selectedVolunteer.full_name}
                </h3>
              </div>
              <button onClick={() => setSelectedVolunteer(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="font-bold text-slate-800">{selectedVolunteer.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Interest</span>
                  <span className="font-bold text-brand-900">{selectedVolunteer.area_of_interest}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Availability</span>
                  <span className="font-bold text-slate-800">{selectedVolunteer.availability}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Status</span>
                  <span className="font-bold text-gold-700 uppercase">{selectedVolunteer.status}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Skills & Profession:</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {selectedVolunteer.skills}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Motivation & Statement:</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed font-sans">
                  {selectedVolunteer.motivation}
                </p>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-700">Set Application Status:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['pending', 'reviewed', 'shortlisted', 'accepted', 'contacted'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedVolunteer.id, st, adminNotes)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                          selectedVolunteer.status === st
                            ? 'bg-brand-900 text-white shadow'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Administrative Notes / Interview Feedback</label>
                  <textarea
                    rows="2"
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    placeholder="Log orientation date or contact notes..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <a
                  href={`mailto:${selectedVolunteer.email}?subject=Mariya Nuuman Foundation Volunteer Inquiry`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Volunteer via Email
                </a>
                <button
                  onClick={() => setSelectedVolunteer(null)}
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
