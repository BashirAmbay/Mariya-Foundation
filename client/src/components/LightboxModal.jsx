import React from 'react';
import { X, Calendar, MapPin, Tag } from 'lucide-react';

export default function LightboxModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Media */}
        <div className="relative aspect-video max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Caption & Metadata */}
        <div className="p-6 bg-slate-900/90 border-t border-slate-800 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-brand-900/80 text-emerald-300 border border-brand-700">
              <Tag className="w-3 h-3" />
              {item.category}
            </span>
            {item.location && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                {item.location}
              </span>
            )}
            {item.event_date && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                {new Date(item.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold font-display text-white">
            {item.title}
          </h3>

          {item.caption && (
            <p className="text-sm text-slate-300 leading-relaxed">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
