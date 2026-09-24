import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Newspaper,
  Calendar,
  User,
  ArrowRight,
  Search,
  Tag,
  ChevronRight
} from 'lucide-react';
import { api, getImageUrl } from '../api/client';
import SectionHeader from '../components/SectionHeader';

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: newsData, isLoading } = useQuery({
    queryKey: ['news-list', selectedCategory, searchQuery],
    queryFn: () => {
      let url = '/news?';
      if (selectedCategory !== 'All') url += `category=${selectedCategory}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      return api.get(url);
    }
  });

  const categories = ['All', 'Announcements', 'Program Update', 'Success Story', 'Event'];
  const articles = newsData?.data || [];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <Newspaper className="w-3.5 h-3.5" /> Official Press & Updates
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            News & Foundation Updates
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Read the latest reports on our Qur'an distribution drives, vocational graduations, and humanitarian activities.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY & SEARCH FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          
          <div className="flex flex-wrap items-center gap-2">
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
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-800"
            />
          </div>

        </div>
      </section>

      {/* 3. NEWS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 max-w-md mx-auto">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 font-display">No articles found</h3>
            <p className="text-xs text-slate-500">
              Check back soon for new updates and announcements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-16/10 bg-slate-100 overflow-hidden relative">
                    <img
                      src={getImageUrl(article.featured_image) || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-brand-950/85 text-gold-300 backdrop-blur-md border border-brand-800">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-600" />
                        {new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gold-600" />
                        {article.author}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-brand-900 transition leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <Link
                    to={`/news/${article.slug || article.id}`}
                    className="text-xs font-bold text-brand-900 hover:text-gold-600 transition flex items-center gap-1"
                  >
                    Read Full Article
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
