import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Mail, Phone, MapPin, Sparkles, ArrowUpRight, MessageSquare } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-slate-300 relative overflow-hidden border-t border-brand-900">
      {/* Decorative Islamic subtle background overlay */}
      <div className="absolute inset-0 bg-emerald-pattern opacity-10 pointer-events-none" />

      {/* Top Banner Call to Action */}
      <div className="relative border-b border-brand-900/80 bg-brand-900/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Empower a Student. Uplift a Community.
            </h3>
            <p className="text-emerald-100/70 text-sm max-w-xl mt-1">
              Your charitable support helps provide sacred Qur'ans, student study kits, and vocational equipment for sustainable self-reliance.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-brand-950 font-bold hover:brightness-110 transition shadow-lg text-sm"
            >
              <Heart className="w-4 h-4 fill-brand-950" />
              Donate to Mariya Nuuman Foundation
            </Link>
            <Link
              to="/get-involved"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-800/80 hover:bg-brand-800 text-white font-semibold border border-brand-700 transition text-sm"
            >
              Volunteer With Us
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Mariya Nuuman Foundation Logo"
                className="h-11 w-auto rounded-xl object-contain shadow-md"
              />
              <span className="text-2xl font-bold text-white font-display tracking-tight">
                Mariya Nuuman Foundation
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              A community-focused charitable organization dedicated to empowering people to become self-reliant and supporting students through Qur'anic and general education.
            </p>
            <div className="pt-2">
              <div className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-2">
                Subtle Islamic Humanitarian Values
              </div>
              <p className="text-xs text-emerald-200/60 leading-relaxed italic">
                "The best among you are those who learn the Qur'an and teach it." — Prophetic Tradition
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-gold-400 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-gold-400 transition">Our Programs</Link></li>
              <li><Link to="/impact" className="hover:text-gold-400 transition">Impact & Stories</Link></li>
              <li><Link to="/gallery" className="hover:text-gold-400 transition">Media Gallery</Link></li>
              <li><Link to="/news" className="hover:text-gold-400 transition">News & Updates</Link></li>
              <li><Link to="/get-involved" className="hover:text-gold-400 transition">Get Involved</Link></li>
            </ul>
          </div>

          {/* Programs & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Focus Areas
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/education" className="hover:text-gold-400 transition">Qur'an Distribution</Link></li>
              <li><Link to="/education" className="hover:text-gold-400 transition">School Supplies & Kits</Link></li>
              <li><Link to="/education" className="hover:text-gold-400 transition">Student Assistance</Link></li>
              <li><Link to="/empowerment" className="hover:text-gold-400 transition">Vocational Skills Training</Link></li>
              <li><Link to="/empowerment" className="hover:text-gold-400 transition">Women Empowerment</Link></li>
              <li><Link to="/empowerment" className="hover:text-gold-400 transition">Youth Tech & Trades</Link></li>
              <li><Link to="/programs" className="hover:text-gold-400 transition">Clean Water & Relief</Link></li>
            </ul>
          </div>

          {/* Contact & Community */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <span>Danbatta Local Government, Kano State</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href="mailto:info@mariyafoundation.org" className="hover:text-white transition">mariyanuumanfoundation@gmail.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>+234  806 863 9972</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold border border-emerald-700 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-brand-900/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Mariya Nuuman Foundation. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Non-Profit & Community Charitable Trust</span>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300 transition">Privacy & Transparency</Link>
            <span>•</span>
            <Link to="/admin/login" className="text-gold-500/80 hover:text-gold-400 transition">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
