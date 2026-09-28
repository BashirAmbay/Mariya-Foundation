import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Sliders,
  Plus,
  Trash2,
  Upload,
  X,
  Check,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  RefreshCw,
  ZoomIn,
  Image as ImageIcon,
  RotateCcw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { api, getImageUrl } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function HeroSlidesManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Modals & Active Selections
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [replacingSlide, setReplacingSlide] = useState(null);
  const [previewZoomImage, setPreviewZoomImage] = useState(null);
  const [viewMode, setViewMode] = useState('clear'); // 'clear' or 'overlay'

  // Add Form State
  const [addFormData, setAddFormData] = useState({
    title: '',
    image_url: '',
    display_order: 0
  });
  const [addImageFile, setAddImageFile] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState('');
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Replace Form State
  const [replaceFormData, setReplaceFormData] = useState({
    title: '',
    image_url: '',
    display_order: 0
  });
  const [replaceImageFile, setReplaceImageFile] = useState(null);
  const [replaceImagePreview, setReplaceImagePreview] = useState('');
  const [submittingReplace, setSubmittingReplace] = useState(false);

  // Bulk actions state
  const [isResetting, setIsResetting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Fetch all slides (active + inactive) for admin
  const { data, isLoading } = useQuery({
    queryKey: ['admin-hero-slides'],
    queryFn: () => api.get('/hero-slides?all=true')
  });

  const slides = data?.data || [];
  const activeSlides = slides.filter((s) => s.is_active === 1);

  // Mini live slideshow preview ticker
  const [livePreviewIndex, setLivePreviewIndex] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setLivePreviewIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  // Handle Add Image File Selection
  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddImageFile(file);
      setAddImagePreview(URL.createObjectURL(file));
      setAddFormData((prev) => ({ ...prev, image_url: '' }));
    }
  };

  // Handle Replace Image File Selection
  const handleReplaceFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplaceImageFile(file);
      setReplaceImagePreview(URL.createObjectURL(file));
      setReplaceFormData((prev) => ({ ...prev, image_url: '' }));
    }
  };

  // Open Replace Modal
  const openReplaceModal = (slide) => {
    setReplacingSlide(slide);
    setReplaceFormData({
      title: slide.title || '',
      image_url: slide.image_url || '',
      display_order: slide.display_order || 0
    });
    setReplaceImageFile(null);
    setReplaceImagePreview('');
  };

  // Submit Replace / Update Slide
  const handleReplaceSubmit = async (e) => {
    e.preventDefault();
    if (!replacingSlide) return;
    setSubmittingReplace(true);

    try {
      const payload = new FormData();
      payload.append('title', replaceFormData.title);
      payload.append('display_order', replaceFormData.display_order);

      if (replaceImageFile) {
        payload.append('image', replaceImageFile);
      } else if (replaceFormData.image_url) {
        payload.append('image_url', replaceFormData.image_url);
      }

      await api.put(`/hero-slides/${replacingSlide.id}`, payload);
      addToast('Hero background image successfully replaced.');
      setReplacingSlide(null);
      setReplaceImageFile(null);
      setReplaceImagePreview('');
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    } catch (err) {
      addToast(err.message || 'Failed to replace hero slide image', 'error');
    } finally {
      setSubmittingReplace(false);
    }
  };

  // Submit Add Slide
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmittingAdd(true);

    try {
      const payload = new FormData();
      payload.append('title', addFormData.title);
      payload.append('display_order', addFormData.display_order);

      if (addImageFile) {
        payload.append('image', addImageFile);
      } else if (addFormData.image_url) {
        payload.append('image_url', addFormData.image_url);
      } else {
        throw new Error('Please select an image file or provide an image URL.');
      }

      await api.post('/hero-slides', payload);
      addToast('New background image added to hero slideshow.');
      setIsAddModalOpen(false);
      setAddImageFile(null);
      setAddImagePreview('');
      setAddFormData({
        title: '',
        image_url: '',
        display_order: 0
      });
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    } catch (err) {
      addToast(err.message || 'Failed to add hero slide', 'error');
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Toggle Slide Active/Inactive
  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/hero-slides/${id}/toggle`);
      addToast(res.message || 'Slide visibility updated.');
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    } catch (err) {
      addToast(err.message || 'Failed to toggle slide status', 'error');
    }
  };

  // Delete Slide
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title || 'this background image'}" from the slideshow?`)) return;
    try {
      await api.delete(`/hero-slides/${id}`);
      addToast('Hero background image deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    } catch (err) {
      addToast(err.message || 'Failed to delete slide', 'error');
    }
  };

  // Reset to Default Sample Slides
  const handleResetDefaults = async () => {
    if (!window.confirm('Restore the 4 default sample background student slides? This will replace current slides.')) return;
    setIsResetting(true);
    try {
      await api.post('/hero-slides/reset-defaults', {});
      addToast('Default sample background slides restored.');
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    } catch (err) {
      addToast(err.message || 'Failed to reset sample slides', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Clear All Slides
  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL background slides from the slideshow?')) return;
    setIsClearing(true);
    try {
      await api.delete('/hero-slides/clear-all');
      addToast('All background slides removed.');
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    } catch (err) {
      addToast(err.message || 'Failed to clear slides', 'error');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Header & Management Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-900 border border-brand-200">
            <Clock className="w-3.5 h-3.5 text-pink-500" /> 5-Second Hero Slideshow Manager
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Hero Background Slideshow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            These background images rotate every 5 seconds behind the homepage hero. The initial images below are <strong>sample student photos</strong> — click <strong>"Replace with My Photo"</strong> or <strong>"Delete"</strong> on any slide to customize the slideshow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-pink-400" /> Add New Slide
          </button>

          <button
            onClick={handleResetDefaults}
            disabled={isResetting}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5 disabled:opacity-50"
            title="Restore the 4 original sample student images"
          >
            {isResetting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
            Restore Sample Slides
          </button>

          {slides.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={isClearing}
              className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition flex items-center gap-1.5 disabled:opacity-50"
              title="Delete all background slides"
            >
              {isClearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 text-rose-500" />}
              Clear All Slides
            </button>
          )}
        </div>
      </div>

      {/* Notice Banner Explaining Sample Images */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">
            Sample Images Ready for Replacement:
          </p>
          <p className="text-amber-800">
            The 4 student slides displayed below are sample photos currently showing on your live homepage. You can <strong>delete any sample image</strong> you don't want, or click <strong>"Replace with My Photo"</strong> to swap it with your own pictures directly from your computer. All website layouts, dark purple backgrounds, and text remain fully preserved.
          </p>
        </div>
      </div>

      {/* 2. Live Rotating Slideshow Preview Monitor */}
      {activeSlides.length > 0 && (
        <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 text-white rounded-3xl p-6 border border-brand-800 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold font-display tracking-wide uppercase text-pink-300">
                Live Website Slideshow Preview ({activeSlides.length} Images Active)
              </h3>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Auto-cycling every 5 seconds • Currently showing Slide #{livePreviewIndex + 1}
            </div>
          </div>

          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/15 bg-black/40">
            {activeSlides.map((slide, idx) => (
              <img
                key={slide.id || idx}
                src={getImageUrl(slide.image_url)}
                alt={slide.title}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                  idx === livePreviewIndex ? 'opacity-70' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-transparent pointer-events-none" />

            {/* Overlay Simulated Website Text */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pointer-events-none">
              <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs font-bold rounded-full w-max border border-pink-500/30 mb-2">
                Active Slide: {activeSlides[livePreviewIndex]?.title || 'Hero Background'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                Mariya Nuuman Foundation
              </h2>
              <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl line-clamp-2">
                Empowering women and children to reach their full potential, breaking cycles of poverty, and supporting students through quality education.
              </p>
            </div>

            {/* Jump-to slide indicators */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              {activeSlides.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => setLivePreviewIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === livePreviewIndex ? 'bg-pink-400 scale-125' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  title={`View Slide #${idx + 1}: ${s.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Grid of Slides with Clear Previews & "Replace Image" Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              Current Homepage Slides ({slides.length} in System)
            </h3>
            <p className="text-xs text-slate-500">
              Click <strong>"Replace with My Photo"</strong> to change any picture, or click the trash icon to delete.
            </p>
          </div>

          {/* View Mode Toggle: Clear Photos vs Website Overlay Effect */}
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
            <button
              onClick={() => setViewMode('clear')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'clear'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Clear Photos (Original)
            </button>
            <button
              onClick={() => setViewMode('overlay')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'overlay'
                  ? 'bg-brand-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Hero Website Effect
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-900" />
            Loading background slides...
          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
            <Sliders className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-700">No background slides in slideshow.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                All slides have been deleted. You can upload your own custom photos now, or restore the 4 default sample student slides.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-brand-900 text-white text-xs font-bold rounded-xl shadow"
              >
                Add Your First Photo
              </button>
              <button
                onClick={handleResetDefaults}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200"
              >
                Restore 4 Sample Slides
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {slides.map((slide, index) => {
              const isSample = slide.image_url?.includes('unsplash.com') || slide.title?.toLowerCase().includes('sample');

              return (
                <div
                  key={slide.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-card transition duration-200"
                >
                  {/* Image Display Area */}
                  <div className="relative aspect-16/10 bg-slate-900 overflow-hidden group">
                    <img
                      src={getImageUrl(slide.image_url)}
                      alt={slide.title || 'Hero Background'}
                      className={`w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-102 ${
                        viewMode === 'overlay'
                          ? 'opacity-65 mix-blend-luminosity'
                          : 'opacity-100'
                      }`}
                    />

                    {viewMode === 'overlay' && (
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-transparent pointer-events-none" />
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                          slide.is_active === 1
                            ? 'bg-emerald-600/90 text-white'
                            : 'bg-slate-800/90 text-slate-200'
                        }`}>
                          {slide.is_active === 1 ? '● Active' : '○ Paused'}
                        </span>

                        {isSample ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
                            Sample Image
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500/90 text-white backdrop-blur-md shadow-sm">
                            Custom Upload
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewZoomImage(getImageUrl(slide.image_url))}
                          className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition"
                          title="Zoom / View Full Size"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/60 text-white backdrop-blur-md">
                          Slide #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Quick Replace Overlay Button on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                      <button
                        onClick={() => openReplaceModal(slide)}
                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0"
                      >
                        <RefreshCw className="w-4 h-4" /> Replace This Photo
                      </button>
                      <button
                        onClick={() => setPreviewZoomImage(getImageUrl(slide.image_url))}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-md transition flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0"
                      >
                        <ZoomIn className="w-4 h-4" /> View Full
                      </button>
                    </div>
                  </div>

                  {/* Content & Action Bar */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base font-bold text-slate-900 line-clamp-1">
                          {slide.title || 'Untitled Background Image'}
                        </h4>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          Order: {slide.display_order}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 truncate font-mono">
                        {slide.image_url}
                      </p>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      {/* Replace with My Photo Button */}
                      <button
                        type="button"
                        onClick={() => openReplaceModal(slide)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-pink-400" />
                        Replace with My Photo
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Active Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggle(slide.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                            slide.is_active === 1
                              ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title={slide.is_active === 1 ? 'Pause in slideshow' : 'Activate in slideshow'}
                        >
                          {slide.is_active === 1 ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(slide.id, slide.title)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition"
                          title="Delete this background image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. REPLACE IMAGE MODAL */}
      {replacingSlide && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600 block">
                  Homepage Background Slideshow
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Replace Background Image
                </h3>
                <p className="text-xs text-slate-500">
                  Select a photo from your computer or enter a URL to replace this image in the 5-second slideshow.
                </p>
              </div>
              <button
                onClick={() => setReplacingSlide(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReplaceSubmit} className="space-y-5 text-xs">
              
              {/* Current Image vs New Replacement Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Current Image Being Replaced
                  </label>
                  <div className="aspect-16/10 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={getImageUrl(replacingSlide.image_url)}
                      alt="Current"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block truncate">
                    {replacingSlide.title}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    New Replacement Preview
                  </label>
                  <div className="aspect-16/10 rounded-xl overflow-hidden border-2 border-dashed border-brand-300 bg-brand-50/50 flex items-center justify-center">
                    {replaceImagePreview ? (
                      <img
                        src={replaceImagePreview}
                        alt="New Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : replaceFormData.image_url && !replaceImageFile ? (
                      <img
                        src={getImageUrl(replaceFormData.image_url)}
                        alt="URL Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="p-3 text-center text-slate-400 space-y-1">
                        <ImageIcon className="w-6 h-6 mx-auto text-brand-300" />
                        <p className="text-[11px] font-medium text-slate-500">Choose or paste new photo</p>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-pink-600 font-semibold mt-1 block">
                    {replaceImageFile ? replaceImageFile.name : replaceFormData.image_url ? 'Using specified URL' : 'Awaiting new photo'}
                  </span>
                </div>
              </div>

              {/* Option 1: Upload File From Device */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block font-bold text-slate-800">
                  Option 1: Upload Photo from Your Computer
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="replace-file-input"
                    accept="image/*"
                    onChange={handleReplaceFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="replace-file-input"
                    className="cursor-pointer px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-pink-400" />
                    Select Image File
                  </label>
                  <span className="text-[11px] text-slate-500 truncate max-w-xs">
                    {replaceImageFile ? replaceImageFile.name : 'No file chosen'}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  Supported formats: JPG, PNG, WEBP.
                </p>
              </div>

              {/* Option 2: Enter New Image URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Option 2: Or Paste Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://..."
                  value={replaceFormData.image_url}
                  onChange={(e) => {
                    setReplaceFormData({ ...replaceFormData, image_url: e.target.value });
                    setReplaceImageFile(null);
                    setReplaceImagePreview('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white"
                />
              </div>

              {/* Title & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Slide Description / Title
                  </label>
                  <input
                    type="text"
                    value={replaceFormData.title}
                    onChange={(e) => setReplaceFormData({ ...replaceFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-900"
                    placeholder="e.g. Students in Foundation Program"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={replaceFormData.display_order}
                    onChange={(e) => setReplaceFormData({ ...replaceFormData, display_order: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplacingSlide(null)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReplace}
                  className="px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingReplace ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                      Saving Replacement...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-pink-400" />
                      Save & Replace Image
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. ADD SLIDE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Add Background Image
                </h3>
                <p className="text-xs text-slate-500">
                  This image will be added to the 5-second automatic hero slideshow.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Slide Title / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Students in Class Receiving Qur'an Aids"
                  value={addFormData.title}
                  onChange={(e) => setAddFormData({ ...addFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>

              {/* Upload File */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block font-bold text-slate-800">
                  Upload Background Photo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="add-file-input"
                    accept="image/*"
                    onChange={handleAddFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="add-file-input"
                    className="cursor-pointer px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-pink-400" />
                    Choose File
                  </label>
                  <span className="text-[11px] text-slate-500 truncate max-w-xs">
                    {addImageFile ? addImageFile.name : 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Live Image Preview */}
              {addImagePreview && (
                <div className="aspect-16/9 rounded-xl overflow-hidden border border-slate-200">
                  <img src={addImagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Image URL fallback */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Or Provide Direct Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={addFormData.image_url}
                  onChange={(e) => {
                    setAddFormData({ ...addFormData, image_url: e.target.value });
                    setAddImageFile(null);
                    setAddImagePreview('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={addFormData.display_order}
                  onChange={(e) => setAddFormData({ ...addFormData, display_order: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd}
                  className="px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingAdd ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-pink-400" />
                      Add to Slideshow
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. FULLSCREEN ZOOM MODAL */}
      {previewZoomImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewZoomImage(null)}
            className="absolute top-5 right-5 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
            title="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
            <img
              src={previewZoomImage}
              alt="Zoomed Background"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <p className="text-white/60 text-xs mt-3 text-center">
              Original full-resolution background photo
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
