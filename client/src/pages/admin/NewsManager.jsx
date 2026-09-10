import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Loader2,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function NewsManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Announcements',
    author: 'Mariya Foundation Secretariat',
    is_published: true,
    published_at: new Date().toISOString().slice(0, 16),
    featured_image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: () => api.get('/news/admin/all')
  });

  const articles = data?.data || [];

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      category: 'Announcements',
      author: 'Mariya Foundation Secretariat',
      is_published: true,
      published_at: new Date().toISOString().slice(0, 16),
      featured_image: ''
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (art) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      summary: art.summary,
      content: art.content,
      category: art.category,
      author: art.author || 'Mariya Foundation Secretariat',
      is_published: Boolean(art.is_published),
      published_at: art.published_at ? art.published_at.slice(0, 16) : new Date().toISOString().slice(0, 16),
      featured_image: art.featured_image || ''
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete article "${title}"?`)) return;
    try {
      await api.delete(`/news/${id}`);
      addToast('Article deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    } catch (err) {
      addToast(err.message || 'Failed to delete article', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('summary', formData.summary);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('author', formData.author);
      data.append('is_published', formData.is_published ? '1' : '0');
      data.append('published_at', formData.published_at);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.featured_image) {
        data.append('featured_image', formData.featured_image);
      }

      if (editingArticle) {
        await api.put(`/news/${editingArticle.id}`, data);
        addToast('Article updated successfully.');
      } else {
        await api.post('/news', data);
        addToast('Article published successfully.');
      }

      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    } catch (err) {
      addToast(err.message || 'Failed to save article', 'error');
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
            News & Updates Management
          </h2>
          <p className="text-xs text-slate-500">
            Publish official announcements, event recaps, and outreach stories.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Compose New Article
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No articles published yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-4">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.featured_image || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=150&q=80'}
                          alt={art.title}
                          className="w-12 h-9 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block text-sm font-display">{art.title}</span>
                          <span className="text-[11px] text-slate-400 truncate max-w-xs block">{art.summary}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-slate-100 text-slate-700">
                        {art.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {art.author}
                    </td>
                    <td className="p-4">
                      {art.is_published ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <Eye className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          <EyeOff className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500 text-[11px]">
                      {new Date(art.published_at || art.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(art)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compose / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
            
            <div className="bg-brand-950 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  {editingArticle ? 'Edit News Article' : 'Compose News Article'}
                </h3>
                <p className="text-xs text-gold-400">Mariya Foundation Newsroom</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mariya Foundation Launches 2026 Quran Distribution Drive"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Announcements">Announcements</option>
                    <option value="Program Update">Program Update</option>
                    <option value="Success Story">Success Story</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Publish Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.published_at}
                    onChange={e => setFormData({ ...formData, published_at: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Summary (1-2 sentences) *</label>
                <textarea
                  required
                  rows="2"
                  value={formData.summary}
                  onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="A concise summary for previews..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Article Content *</label>
                <textarea
                  required
                  rows="6"
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full text of the news article or press release..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Featured Photo Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Or Photo URL</label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={e => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded text-brand-900"
                  />
                  <span>Publish Immediately (Make public on website)</span>
                </label>
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
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Article
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
