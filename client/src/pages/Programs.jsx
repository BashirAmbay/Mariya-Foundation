import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Sparkles,
  Heart,
  Search,
  CheckCircle2,
  Users,
  Target,
  Activity,
  ArrowRight,
  Filter,
  X,
  ChevronRight
} from 'lucide-react';
import { api, getImageUrl } from '../api/client';
import SectionHeader from '../components/SectionHeader';
import ProgramApplyModal from '../components/ProgramApplyModal';
import DonationPledgeModal from '../components/DonationPledgeModal';

export default function Programs() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [detailProgram, setDetailProgram] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['program-categories'],
    queryFn: () => api.get('/programs/categories')
  });

  // Fetch Programs
  const { data: programsData, isLoading } = useQuery({
    queryKey: ['programs-list', selectedCategory, searchQuery],
    queryFn: () => {
      let url = '/programs?';
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      return api.get(url);
    }
  });

  const categories = categoriesData?.data || [];
  const programs = programsData?.data || [];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Our Initiatives
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Mariya Nuuman Foundation Programs
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Discover our comprehensive educational assistance, Qur'anic outreach, vocational training hubs, and community welfare programs.
          </p>
        </div>
      </section>

      {/* 2. SEARCH & CATEGORY FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                selectedCategory === 'all'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Programs ({programs.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 3. PROGRAM LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 font-display">No programs found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any programs matching your current category filter or search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-brand-900 text-white text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    <img
                      src={getImageUrl(prog.image_url)}
                      alt={prog.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-950/85 text-gold-300 backdrop-blur-md border border-brand-800">
                        {prog.category_name}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        prog.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200'
                      }`}>
                        {prog.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-brand-900 transition leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {prog.short_description}
                    </p>

                    {/* Quick highlights preview */}
                    {prog.objectives && prog.objectives.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Key Focus:
                        </span>
                        <div className="text-xs text-slate-700 flex items-start gap-2 line-clamp-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{prog.objectives[0]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => setDetailProgram(prog)}
                    className="text-xs font-bold text-slate-700 hover:text-brand-900 transition"
                  >
                    View Details
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProgram(prog);
                        setIsApplyOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 font-bold text-xs transition"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setIsDonateOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold text-xs shadow-sm transition"
                    >
                      Sponsor
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. PROGRAM DETAIL MODAL DRAWER */}
      {detailProgram && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
            
            {/* Header Image Banner */}
            <div className="relative aspect-21/9 max-h-64 overflow-hidden bg-slate-900">
              <img
                src={getImageUrl(detailProgram.image_url) || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80'}
                alt={detailProgram.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setDetailProgram(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-brand-950">
                  {detailProgram.category_name}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display leading-tight text-white">
                  {detailProgram.title}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
              
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
                  Program Overview
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {detailProgram.full_description}
                </p>
              </div>

              {/* Objectives */}
              {detailProgram.objectives && detailProgram.objectives.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display flex items-center gap-2">
                    <Target className="w-4 h-4 text-brand-800" />
                    Key Objectives
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {detailProgram.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Beneficiaries */}
              {detailProgram.target_beneficiaries && detailProgram.target_beneficiaries.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-800" />
                    Target Beneficiaries
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {detailProgram.target_beneficiaries.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Activities */}
              {detailProgram.activities && detailProgram.activities.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-800" />
                    Core Activities & Roadmap
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {detailProgram.activities.map((act, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setDetailProgram(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const prog = detailProgram;
                    setDetailProgram(null);
                    setSelectedProgram(prog);
                    setIsApplyOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs transition"
                >
                  Apply for This Program
                </button>
                <button
                  onClick={() => {
                    setDetailProgram(null);
                    setIsDonateOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold text-xs shadow transition"
                >
                  Sponsor This Program
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Program Apply & Donate Modals */}
      <ProgramApplyModal
        program={selectedProgram}
        isOpen={isApplyOpen}
        onClose={() => {
          setIsApplyOpen(false);
          setSelectedProgram(null);
        }}
      />

      <DonationPledgeModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />

    </div>
  );
}
