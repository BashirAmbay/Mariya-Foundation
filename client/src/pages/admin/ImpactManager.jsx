import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Quote,
  Star,
  MapPin
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function ImpactManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyForm, setStoryForm] = useState({
    title: '',
    beneficiary_name: '',
    category: 'Education',
    before_situation: '',
    after_situation: '',
    quote: '',
    story_content: '',
    location: '',
    is_featured: true,
    image_url: ''
  });
  const [storyImageFile, setStoryImageFile] = useState(null);
  const [savingStory, setSavingStory] = useState(false);

  // Edit stat inline state
  const [editingStatId, setEditingStatId] = useState(null);
  const [statValue, setStatValue] = useState('');

  // 1. Fetch Stats
  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/impact/stats/all')
  });

  // 2. Fetch Stories
  const { data: storiesData } = useQuery({
    queryKey: ['admin-stories'],
    queryFn: () => api.get('/impact/stories')
  });

  const stats = statsData?.data || [];
  const stories = storiesData?.data || [];

  const handleUpdateStat = async (stat) => {
    try {
      await api.put(`/impact/stats/${stat.id}`, {
        value: parseInt(statValue, 10)
      });
      addToast(`Metric "${stat.label}" updated to ${statValue}.`);
      setEditingStatId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    } catch (err) {
      addToast(err.message || 'Failed to update stat', 'error');
    }
  };

  const openCreateStoryModal = () => {
    setEditingStory(null);
    setStoryForm({
      title: '',
      beneficiary_name: '',
      category: 'Education',
      before_situation: '',
      after_situation: '',
      quote: '',
      story_content: '',
      location: '',
      is_featured: true,
      image_url: ''
    });
    setStoryImageFile(null);
    setIsStoryModalOpen(true);
  };

  const openEditStoryModal = (story) => {
    setEditingStory(story);
    setStoryForm({
      title: story.title,
      beneficiary_name: story.beneficiary_name,
      category: story.category,
      before_situation: story.before_situation || '',
      after_situation: story.after_situation || '',
      quote: story.quote || '',
      story_content: story.story_content,
      location: story.location || '',
      is_featured: Boolean(story.is_featured),
      image_url: story.image_url || ''
    });
    setStoryImageFile(null);
    setIsStoryModalOpen(true);
  };

  const handleDeleteStory = async (id, title) => {
    if (!window.confirm(`Delete impact story "${title}"?`)) return;
    try {
      await api.delete(`/impact/stories/${id}`);
      addToast('Story deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-stories'] });
    } catch (err) {
      addToast(err.message || 'Failed to delete story', 'error');
    }
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    setSavingStory(true);

    try {
      const data = new FormData();
      data.append('title', storyForm.title);
      data.append('beneficiary_name', storyForm.beneficiary_name);
      data.append('category', storyForm.category);
      data.append('before_situation', storyForm.before_situation);
      data.append('after_situation', storyForm.after_situation);
      data.append('quote', storyForm.quote);
      data.append('story_content', storyForm.story_content);
      data.append('location', storyForm.location);
      data.append('is_featured', storyForm.is_featured ? '1' : '0');

      if (storyImageFile) {
        data.append('image', storyImageFile);
      } else if (storyForm.image_url) {
        data.append('image_url', storyForm.image_url);
      }

      if (editingStory) {
        await api.put(`/impact/stories/${editingStory.id}`, data);
        addToast('Impact story updated.');
      } else {
        await api.post('/impact/stories', data);
        addToast('Impact story added.');
      }

      setIsStoryModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-stories'] });
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setSavingStory(false);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* 1. IMPACT STATS METRIC MANAGEMENT */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Impact Statistics & Counters
          </h2>
          <p className="text-xs text-slate-500">
            Edit the live public impact numbers displayed on the homepage and impact page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {stat.label}
              </span>
              
              {editingStatId === stat.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={statValue}
                    onChange={(e) => setStatValue(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm font-bold border rounded-lg focus:ring-2 focus:ring-brand-800"
                  />
                  <button
                    onClick={() => handleUpdateStat(stat)}
                    className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingStatId(null)}
                    className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold font-display text-brand-900">
                    {stat.prefix}{Number(stat.value).toLocaleString()}{stat.suffix}
                  </span>
                  <button
                    onClick={() => {
                      setEditingStatId(stat.id);
                      setStatValue(String(stat.value));
                    }}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BENEFICIARY STORIES MANAGEMENT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Beneficiary Stories & Case Studies
            </h2>
            <p className="text-xs text-slate-500">
              Publish before-and-after success narratives from students, widows, and apprentices.
            </p>
          </div>
          <button
            onClick={openCreateStoryModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Beneficiary Story
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/9 bg-slate-100 relative">
                  <img
                    src={story.image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'}
                    alt={story.beneficiary_name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-brand-950/80 text-gold-300 backdrop-blur-md">
                    {story.category}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-slate-700">{story.beneficiary_name}</span>
                    <span>{story.location}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display leading-snug">
                    {story.title}
                  </h3>
                  {story.quote && (
                    <p className="text-xs text-slate-600 italic line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{story.quote}"
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                <span className="text-[11px] text-slate-400">
                  {story.is_featured ? '★ Featured Story' : 'Standard'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditStoryModal(story)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStory(story.id, story.title)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Create/Edit Modal */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
            
            <div className="bg-brand-950 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  {editingStory ? 'Edit Beneficiary Story' : 'Add Impact Story'}
                </h3>
                <p className="text-xs text-gold-400">Mariya Nuuman Foundation Case Study</p>
              </div>
              <button onClick={() => setIsStoryModalOpen(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStorySubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Story Headline *</label>
                  <input
                    type="text"
                    required
                    value={storyForm.title}
                    onChange={e => setStoryForm({ ...storyForm, title: e.target.value })}
                    placeholder="e.g. From Struggle to a Thriving Fashion Workshop"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Beneficiary Name *</label>
                  <input
                    type="text"
                    required
                    value={storyForm.beneficiary_name}
                    onChange={e => setStoryForm({ ...storyForm, beneficiary_name: e.target.value })}
                    placeholder="e.g. Fatima Abubakar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={storyForm.category}
                    onChange={e => setStoryForm({ ...storyForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Education">Education Support</option>
                    <option value="Empowerment">Vocational Empowerment</option>
                    <option value="Community">Community Welfare</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location / District</label>
                  <input
                    type="text"
                    value={storyForm.location}
                    onChange={e => setStoryForm({ ...storyForm, location: e.target.value })}
                    placeholder="e.g. Zaria Community Hub"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Before Situation (Short)</label>
                  <textarea
                    rows="2"
                    value={storyForm.before_situation}
                    onChange={e => setStoryForm({ ...storyForm, before_situation: e.target.value })}
                    placeholder="Single mother with no steady income..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">After Intervention (Short)</label>
                  <textarea
                    rows="2"
                    value={storyForm.after_situation}
                    onChange={e => setStoryForm({ ...storyForm, after_situation: e.target.value })}
                    placeholder="Now runs sewing shop employing 2 apprentices..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Direct Beneficiary Quote</label>
                <input
                  type="text"
                  value={storyForm.quote}
                  onChange={e => setStoryForm({ ...storyForm, quote: e.target.value })}
                  placeholder="Mariya Nuuman Foundation gave me dignity and hope..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Narrative Story *</label>
                <textarea
                  required
                  rows="4"
                  value={storyForm.story_content}
                  onChange={e => setStoryForm({ ...storyForm, story_content: e.target.value })}
                  placeholder="Comprehensive narrative of the beneficiary's journey..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Upload Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setStoryImageFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Or Photo URL</label>
                  <input
                    type="url"
                    value={storyForm.image_url}
                    onChange={e => setStoryForm({ ...storyForm, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStoryModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStory}
                  className="px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl shadow transition flex items-center gap-2"
                >
                  {savingStory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Impact Story
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
