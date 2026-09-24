import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  Tag,
  Clock
} from 'lucide-react';
import { api, getImageUrl } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function NewsDetail() {
  const { slug } = useParams();
  const { addToast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['news-detail', slug],
    queryFn: () => api.get(`/news/${slug}`)
  });

  const article = data?.data;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Article link copied to clipboard!', 'info');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-12 bg-slate-200 rounded w-full" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
        <div className="h-40 bg-slate-200 rounded" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-display">Article Not Found</h2>
        <p className="text-sm text-slate-600">The requested news update could not be located.</p>
        <Link
          to="/news"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News & Updates
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          <Share2 className="w-3.5 h-3.5" /> Share Article
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-900 border border-brand-200">
          <Tag className="w-3 h-3 text-gold-600" />
          {article.category}
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-display leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gold-600" />
            {new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-gold-600" />
            {article.author}
          </span>
        </div>
      </div>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="rounded-3xl overflow-hidden shadow-card border border-slate-200 aspect-16/9 bg-slate-900">
          <img
            src={getImageUrl(article.featured_image)}
            alt={article.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80';
            }}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Summary Lead */}
      <div className="p-6 rounded-2xl bg-brand-50/70 border-l-4 border-brand-800 text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
        {article.summary}
      </div>

      {/* Main Content Body */}
      <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
        {article.content}
      </div>

      {/* Bottom Footer / CTA */}
      <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/news"
          className="text-xs font-bold text-slate-600 hover:text-brand-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> All News & Updates
        </Link>
        <Link
          to="/donate"
          className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-brand-950 font-bold text-xs rounded-xl shadow hover:brightness-110 transition"
        >
          Support Mariya Nuuman Foundation Programs
        </Link>
      </div>

    </div>
  );
}
