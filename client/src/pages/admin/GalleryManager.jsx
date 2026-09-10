import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Image,
  Plus,
  Trash2,
  Upload,
  X,
  Check,
  Loader2,
  Calendar,
  MapPin
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function GalleryManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Quran',
    caption: '',
    location: '',
    event_date: new Date().toISOString().split('T')[0],
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: () => api.get('/gallery')
  });

  const items = data?.data || [];

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" from gallery?`)) return;
    try {
      await api.delete(`/gallery/${id}`);
      addToast('Image removed from gallery.');
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    } catch (err) {
      addToast(err.message || 'Failed to delete image', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('caption', formData.caption);
      data.append('location', formData.location);
      data.append('event_date', formData.event_date);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.image_url) {
        data.append('image_url', formData.image_url);
      } else {
        throw new Error('Please select an image file or provide an image URL.');
      }

      await api.post('/gallery', data);
      addToast('Image uploaded to gallery successfully.');
      setIsModalOpen(false);
      setImageFile(null);
      setFormData({
        title: '',
        category: 'Quran',
        caption: '',
        location: '',
        event_date: new Date().toISOString().split('T')[0],
        image_url: ''
      });
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    } catch (err) {
      addToast(err.message || 'Failed to add image', 'error');
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
            Gallery Management
          </h2>
          <p className="text-xs text-slate-500">
            Upload and organize field activity photos across all program categories.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Upload New Image
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading gallery items...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Image className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No images in gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-4/3 bg-slate-900 relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-950/85 text-gold-300">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-900 font-display truncate">
                      {item.title}
                    </h3>
                    {item.location && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold-600" />
                        {item.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.event_date || item.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="bg-brand-950 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Upload Gallery Image</h3>
                <p className="text-xs text-gold-400">Mariya Foundation Media Center</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Quran Distribution in Rigasa Madrasah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Quran">Qur'an Distribution</option>
                    <option value="Education">Education Support</option>
                    <option value="Empowerment">Vocational Empowerment</option>
                    <option value="Community">Community Welfare</option>
                    <option value="Events">Foundation Events</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Kaduna City"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Caption / Description</label>
                <textarea
                  rows="2"
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Short description of this field activity..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Local Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Or Paste Direct Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl shadow transition flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload Image
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
