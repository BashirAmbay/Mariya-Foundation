import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Image,
  Loader2,
  AlertCircle,
  Eye,
  Star
} from 'lucide-react';
import { api, getImageUrl } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function ProgramManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '1',
    short_description: '',
    full_description: '',
    objectives: '',
    target_beneficiaries: '',
    activities: '',
    status: 'active',
    is_featured: false,
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Categories
  const { data: catData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/programs/categories')
  });

  // 2. Fetch Programs
  const { data: programsData, isLoading } = useQuery({
    queryKey: ['admin-programs'],
    queryFn: () => api.get('/programs')
  });

  const categories = catData?.data || [];
  const programs = programsData?.data || [];

  const openCreateModal = () => {
    setEditingProgram(null);
    setFormData({
      title: '',
      category_id: categories[0]?.id ? String(categories[0].id) : '1',
      short_description: '',
      full_description: '',
      objectives: '',
      target_beneficiaries: '',
      activities: '',
      status: 'active',
      is_featured: false,
      image_url: ''
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prog) => {
    setEditingProgram(prog);
    setFormData({
      title: prog.title,
      category_id: String(prog.category_id),
      short_description: prog.short_description,
      full_description: prog.full_description,
      objectives: Array.isArray(prog.objectives) ? prog.objectives.join('\n') : '',
      target_beneficiaries: Array.isArray(prog.target_beneficiaries) ? prog.target_beneficiaries.join('\n') : '',
      activities: Array.isArray(prog.activities) ? prog.activities.join('\n') : '',
      status: prog.status,
      is_featured: Boolean(prog.is_featured),
      image_url: prog.image_url || ''
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the program "${title}"?`)) return;
    try {
      await api.delete(`/programs/${id}`);
      addToast(`Program "${title}" deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
    } catch (err) {
      addToast(err.message || 'Failed to delete program', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category_id', formData.category_id);
      data.append('short_description', formData.short_description);
      data.append('full_description', formData.full_description);
      data.append('objectives', formData.objectives);
      data.append('target_beneficiaries', formData.target_beneficiaries);
      data.append('activities', formData.activities);
      data.append('status', formData.status);
      data.append('is_featured', formData.is_featured ? '1' : '0');

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.image_url) {
        data.append('image_url', formData.image_url);
      }

      if (editingProgram) {
        await api.put(`/programs/${editingProgram.id}`, data);
        addToast('Program updated successfully.');
      } else {
        await api.post('/programs', data);
        addToast('Program created successfully.');
      }

      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Program Management
          </h2>
          <p className="text-xs text-slate-500">
            Create, update, and manage foundation education and empowerment initiatives.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Program
        </button>
      </div>

      {/* Program Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading programs...</div>
        ) : programs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No programs in database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-4">Program Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((prog) => (
                  <tr key={prog.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(prog.image_url) || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=150&q=80'}
                          alt={prog.title}
                          className="w-12 h-9 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block text-sm font-display">{prog.title}</span>
                          <span className="text-[11px] text-slate-400 truncate max-w-xs block">{prog.short_description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-brand-50 text-brand-900 border border-brand-200">
                        {prog.category_name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        prog.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {prog.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {prog.is_featured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-600">
                          <Star className="w-3.5 h-3.5 fill-gold-500" /> Featured
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prog)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Edit Program"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prog.id, prog.title)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                          title="Delete Program"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
            
            <div className="bg-brand-950 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  {editingProgram ? 'Edit Program' : 'Create New Program'}
                </h3>
                <p className="text-xs text-gold-400">Mariya Nuuman Foundation Initiative Editor</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Program Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Quran Distribution & Tajweed Study"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-800 text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description (for cards) *</label>
                <textarea
                  required
                  rows="2"
                  value={formData.short_description}
                  onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Concise 1-2 sentence summary"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-800 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full In-Depth Description *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.full_description}
                  onChange={e => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="Comprehensive program breakdown"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Objectives (1 per line)</label>
                  <textarea
                    rows="3"
                    value={formData.objectives}
                    onChange={e => setFormData({ ...formData, objectives: e.target.value })}
                    placeholder="Objective 1&#10;Objective 2"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Beneficiaries</label>
                  <textarea
                    rows="3"
                    value={formData.target_beneficiaries}
                    onChange={e => setFormData({ ...formData, target_beneficiaries: e.target.value })}
                    placeholder="Tahfeez students&#10;Rural Madrasahs"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Activities (1 per line)</label>
                  <textarea
                    rows="3"
                    value={formData.activities}
                    onChange={e => setFormData({ ...formData, activities: e.target.value })}
                    placeholder="Distribution drive&#10;Classroom setup"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Image Upload or URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Upload Program Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Or Provide Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded text-brand-900 focus:ring-brand-800"
                    />
                    <span>Highlight on Home Page</span>
                  </label>
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
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Program
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
