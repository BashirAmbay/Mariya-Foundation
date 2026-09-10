import React from 'react';

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  dark = false,
  className = ''
}) {
  return (
    <div className={`space-y-3 ${centered ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          dark 
            ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30' 
            : 'bg-brand-50 text-brand-900 border border-brand-200'
        }`}>
          {badge}
        </div>
      )}
      {title && (
        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight leading-tight ${
          dark ? 'text-white' : 'text-slate-900'
        }`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`text-base sm:text-lg leading-relaxed ${
          dark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
