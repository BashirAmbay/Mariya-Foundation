import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Image,
  Sparkles,
  MapPin,
  Calendar,
  Tag,
  ZoomIn,
  Filter
} from 'lucide-react';
import { api, getImageUrl } from '../api/client';
import SectionHeader from '../components/SectionHeader';
import LightboxModal from '../components/LightboxModal';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState(null);

  const { data: galleryData, isLoading } = useQuery({
    queryKey: ['gallery-items', selectedCategory],
    queryFn: () => api.get(`/gallery?category=${selectedCategory}`)
  });

  const categories = ['All', 'Quran', 'Education', 'Empowerment', 'Community', 'Events'];
  const items = galleryData?.data || [];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <Image className="w-3.5 h-3.5" /> Photographic Archive
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Mariya Nuuman Foundation Gallery
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Witness our on-the-ground interventions: Qur'an distribution drives, vocational training workshops, and community welfare handovers.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2.5 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                selectedCategory === cat
                  ? 'bg-brand-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'Quran' ? "Qur'an Distribution" : cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 max-w-md mx-auto">
            <Image className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 font-display">No images in this category yet</h3>
            <p className="text-xs text-slate-500">
              Administrators will upload field photos soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxItem(item)}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-200 shadow-soft hover:shadow-card cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-950/80 text-gold-400 border border-brand-800">
                      {item.category}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold font-display leading-tight text-white">
                      {item.title}
                    </h3>
                    {item.location && (
                      <p className="text-[11px] text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold-400" />
                        {item.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        item={activeLightboxItem}
        isOpen={!!activeLightboxItem}
        onClose={() => setActiveLightboxItem(null)}
      />

    </div>
  );
}
