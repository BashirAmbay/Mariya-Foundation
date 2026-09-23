import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Sparkles, BookOpen, ChevronRight, Phone, Mail, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Education Support', path: '/education' },
    { name: 'Empowerment', path: '/empowerment' },
    { name: 'Impact', path: '/impact' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News & Updates', path: '/news' },
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top micro-bar for quick contact */}
      <div className="bg-brand-950 text-pink-100/90 text-xs py-1.5 px-4 sm:px-8 border-b border-brand-800/40 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-pink-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Nurturing Qur'anic Education & Building Self-Reliance
            </span>
            <span className="text-white/20">|</span>
            <a href="mailto:info@mariyafoundation.org" className="hover:text-pink-300 transition flex items-center gap-1">
              <Mail className="w-3 h-3" /> Mariyanuumanfoundation@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/donate" className="text-pink-300 hover:text-gold-200 transition font-medium flex items-center gap-1">
              <Heart className="w-3 h-3 fill-pink-400 text-gold-400" /> Support a Student
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/admin/login" className="hover:text-white transition flex items-center gap-1 text-emerald-200/70">
              <User className="w-3 h-3" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-4 border-b border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Mariya Nuuman Foundation Logo"
              className="h-10 w-auto rounded-xl object-contain shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-brand-950 font-display tracking-tight leading-none group-hover:text-brand-800 transition">
                Mariya Nuuman Foundation
              </span>
              <span className="text-[10.5px] uppercase tracking-wider text-gold-700 font-semibold mt-0.5">
                Empowerment & Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-[13.5px] font-medium rounded-lg transition-colors duration-150 ${isActive
                    ? 'text-brand-900 bg-brand-50 font-semibold'
                    : 'text-slate-600 hover:text-brand-800 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action / Donate Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/donate"
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 rounded-xl shadow-sm hover:shadow-gold hover:scale-[1.02] active:scale-[0.98] group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                Donate Now
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Mobile Hamburger Button for Tablet */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:text-brand-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Hamburger Button for Phones */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/donate"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-gold-600 rounded-lg shadow-sm flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              Donate
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[60px] md:top-[88px] bg-white border-b border-slate-200 shadow-2xl z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl transition ${isActive
                    ? 'text-brand-900 bg-brand-50 font-bold border-l-4 border-brand-800'
                    : 'text-slate-700 hover:text-brand-900 hover:bg-slate-50'
                  }`
                }
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            ))}

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                to="/donate"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-gold-600 to-gold-500 rounded-xl shadow"
              >
                <Heart className="w-5 h-5 fill-white" />
                Donate & Support Our Programs
              </Link>
              <div className="flex justify-between items-center px-4 py-2 text-xs text-slate-500">
                <span>admin@mariyafoundation.org</span>
                <Link to="/admin/login" className="text-brand-800 font-semibold hover:underline">
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
