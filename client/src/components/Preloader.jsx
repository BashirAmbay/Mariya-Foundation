import React, { useState, useEffect } from 'react';
import preloaderLogo from '../../image/image 5.jpg';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Keep visible briefly for smooth branding presentation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    // Completely remove from DOM after fade-out transition
    const unmountTimer = setTimeout(() => {
      setShouldRender(false);
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-950 transition-all duration-700 ease-out ${
        loading ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
      }`}
      aria-label="Loading Mariya Nuuman Foundation"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-emerald-pattern opacity-20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-brand-600/15 blur-3xl pointer-events-none animate-pulse" />

      {/* Central Brand Container */}
      <div className="relative z-10 flex flex-col items-center space-y-5 text-center px-4">
        
        {/* Logo with animated glowing ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-brand-500 via-gold-400 to-brand-600 opacity-60 blur-md animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 shadow-2xl flex items-center justify-center overflow-hidden border-2 border-white/80">
            <img
              src={preloaderLogo}
              alt="Mariya Nuuman Foundation"
              className="w-full h-full object-contain animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
            />
          </div>
        </div>

        {/* Foundation Name & Tagline */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white drop-shadow-md">
            Mariya Nuuman Foundation
          </h2>
          <p className="text-xs sm:text-sm font-medium text-emerald-200/80 tracking-wide">
            Empowering Women, Children & Communities
          </p>
        </div>

        {/* Sleek Progress / Loader Bar */}
        <div className="w-48 sm:w-56 h-1.5 bg-brand-900/80 rounded-full overflow-hidden border border-brand-800/60 shadow-inner mt-2">
          <div className="h-full bg-gradient-to-r from-brand-400 via-gold-400 to-brand-500 rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
        </div>

      </div>
    </div>
  );
}
