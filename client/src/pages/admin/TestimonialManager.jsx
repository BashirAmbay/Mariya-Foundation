import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Quote,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Loader2
} from 'lucide-react';
import { api, getImageUrl } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function TestimonialManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role_title: '',
    location: '',
    content: '',
    rating: 5,
    is_published: true,
    avatar_url: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => api.get('/testimonials/all')
  });

  const testimonials = data?.data || [];

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role_title: '',
      location: '',
      content: '',
      rating: 5,
      is_published: true,
      avatar_url: ''
    });
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role_title: item.role_title,
      location: item.location || '',
      content: item.content,
      rating: item.rating || 5,
      is_published: Boolean(item.is_published),
      avatar_url: item.avatar_url || ''
    });
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await api.delete(`/testimonials/${id}`);
      addToast('Testimonial deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    } catch (err) {
      addToast(err.message || 'Failed to delete testimonial', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('role_title', formData.role_title);
      data.append('location', formData.location);
      data.append('content', formData.content);
      data.append('rating', formData.rating);
      data.append('is_published', formData.is_published ? '1' : '0');

      if (avatarFile) {
        data.append('avatar', avatarFile);
      } else if (formData.avatar_url) {
        data.append('avatar_url', formData.avatar_url);
      }

      if (editingItem) {
        await api.put(`/testimonials/${editingItem.id}`, data);
        addToast('Testimonial updated.');
      } else {
        await api.post('/testimonials', data);
        addToast('Testimonial added.');
      }

      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Testimonials Management
          </h2>
          <p className="text-xs text-slate-500">
            Manage beneficiary remarks, headteacher endorsements, and community feedback.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 p-12 text-center text-slate-400">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-3 bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Quote className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No testimonials logged.</p>
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gold-500">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                    ))}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {t.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-4">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={getImageUrl(t.avatar_url)}
                    alt={t.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                    }}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{t.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{t.role_title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="bg-brand-950 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mallam Usman Ahmad"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Affiliation</label>
                  <input
                    type="text"
                    value={formData.role_title}
                    onChange={e => setFormData({ ...formData, role_title: e.target.value })}
                    placeholder="e.g. Head Teacher"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Rigasa"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Testimonial Content *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="The impact Mariya Nuuman Foundation made on our school..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                      className="rounded text-brand-900"
                    />
                    <span>Publish Online</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700">Avatar Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setAvatarFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-brand-50"
                />
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={e => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="Or image URL..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl shadow transition"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Testimonial'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
