import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Quote,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { api, getImageUrl } from '../api/client';
import SectionHeader from '../components/SectionHeader';

export default function Impact() {
  const { data: statsData } = useQuery({
    queryKey: ['impact-stats'],
    queryFn: () => api.get('/impact/stats')
  });

  const { data: storiesData } = useQuery({
    queryKey: ['impact-stories'],
    queryFn: () => api.get('/impact/stories')
  });

  const stats = statsData?.data || [];
  const stories = storiesData?.data || [];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <TrendingUp className="w-3.5 h-3.5" /> Measurable Change
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Our Impact & Community Outcomes
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Real stories, verified figures, and enduring transformations powered by compassionate donors and community partners.
          </p>
        </div>
      </section>

      {/* 2. LIVE IMPACT METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-8 sm:p-12 space-y-8">
          
          <SectionHeader
            badge="Verified Figures"
            title="Impact by the Numbers"
            subtitle="Cumulative milestone metrics recorded across our active humanitarian and educational initiatives."
            centered={true}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-2"
              >
                <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-brand-900 block">
                  {item.prefix}{Number(item.value).toLocaleString()}{item.suffix}
                </span>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">
                  {item.label}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 max-w-xl mx-auto">
            * Note: These metrics represent actual field distributions and beneficiary cohort logs maintained in our database.
          </div>

        </div>
      </section>

      {/* 3. BEFORE & AFTER BENEFICIARY CASE STUDIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Human Stories"
          title="Lives Transformed: Before & After Stories"
          subtitle="Behind every metric is an individual who now memorizes the Qur'an or runs a thriving trade."
          centered={true}
        />

        <div className="space-y-12">
          {stories.map((story, i) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card transition overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Image Col */}
              <div className="lg:col-span-5 relative aspect-4/3 lg:aspect-auto lg:h-full bg-slate-100">
                <img
                  src={getImageUrl(story.image_url) || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'}
                  alt={story.beneficiary_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-950/85 text-gold-300 backdrop-blur-md">
                    {story.category}
                  </span>
                </div>
              </div>

              {/* Story Content Col */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:pr-10 space-y-6">
                
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-600" />
                    <span>{story.location || 'Community Settlement'}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{story.beneficiary_name}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900 leading-snug">
                    {story.title}
                  </h3>
                </div>

                {/* Quote */}
                {story.quote && (
                  <div className="p-4 rounded-2xl bg-gold-50/70 border-l-4 border-gold-500 text-slate-800 text-sm italic space-y-1">
                    <Quote className="w-5 h-5 text-gold-600 mb-1 opacity-60" />
                    <p>"{story.quote}"</p>
                  </div>
                )}

                {/* Before / After Comparison Grid */}
                {(story.before_situation || story.after_situation) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {story.before_situation && (
                      <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1 text-xs">
                        <span className="font-bold text-rose-800 uppercase tracking-wider block">
                          Before Intervention:
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          {story.before_situation}
                        </p>
                      </div>
                    )}
                    {story.after_situation && (
                      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1 text-xs">
                        <span className="font-bold text-emerald-800 uppercase tracking-wider block">
                          After Support:
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          {story.after_situation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {story.story_content}
                </p>

              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 4. TRANSPARENCY & COMMUNITY ACCOUNTABILITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-950 text-white text-center space-y-6 max-w-4xl mx-auto relative overflow-hidden border border-brand-800">
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-gold-500/20 text-gold-400 rounded-xl flex items-center justify-center mx-auto border border-gold-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Strict Accountability in Every Project
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
              Mariya Nuuman Foundation operates with clear field documentation, photography, and community committee receipts for every distribution drive.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
