import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Heart,
  BookOpen,
  Sparkles,
  Handshake,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import SectionHeader from '../components/SectionHeader';

export default function GetInvolved() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    availability: 'Part-time',
    areaOfInterest: 'Teaching & Education',
    motivation: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const waysToHelp = [
    {
      title: "Volunteer Your Time & Skills",
      desc: "Lend your teaching, technical, administrative, medical, or event coordination talents to our field outreaches.",
      icon: Users,
      action: "Fill Application Below"
    },
    {
      title: "Sponsor Qur'an & Study Kits",
      desc: "Provide durable Tajweed Mushafs, backpacks, and curriculum textbooks for community Madrasah students.",
      icon: BookOpen,
      action: "Donate Online / Bank Transfer",
      link: "/donate"
    },
    {
      title: "Fund Vocational Startup Toolkits",
      desc: "Gift heavy-duty sewing machines, carpentry kits, or tech lab equipment to graduating vocational apprentices.",
      icon: Sparkles,
      action: "Sponsor a Graduate",
      link: "/donate"
    },
    {
      title: "Institutional / NGO Partnership",
      desc: "Collaborate on large-scale clean water drilling, seasonal food logistics, or student scholarship endowments.",
      icon: Handshake,
      action: "Partner With Us",
      link: "/contact"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/volunteers', formData);
      setSubmitted(true);
      addToast('Volunteer application submitted! Thank you for joining hands with Mariya Nuuman Foundation.');
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <Users className="w-3.5 h-3.5" /> Collective Action
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Get Involved with Mariya Nuuman Foundation
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Every Qur'an delivered, every youth empowered with a trade, and every student kept in school happens because of caring people like you.
          </p>
        </div>
      </section>

      {/* 2. FOUR WAYS TO SUPPORT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Avenues of Service"
          title="Multiple Pathways to Create Enduring Change"
          subtitle="Whether through hands-on service, financial sponsorship, or institutional collaboration."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {waysToHelp.map((way, i) => {
            const Icon = way.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center border border-brand-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {way.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {way.desc}
                  </p>
                </div>

                {way.link ? (
                  <Link
                    to={way.link}
                    className="w-full py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 text-xs font-bold transition text-center block"
                  >
                    {way.action} →
                  </Link>
                ) : (
                  <a
                    href="#volunteer-form"
                    className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-950 text-xs font-bold transition text-center block"
                  >
                    {way.action} ↓
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. VOLUNTEER REGISTRATION FORM */}
      <section id="volunteer-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          
          <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white p-8 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Community Volunteer Network
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Apply to Volunteer With Us
            </h3>
            <p className="text-xs text-emerald-100/80 max-w-md mx-auto">
              Share your skills, availability, and passion. Our volunteer coordinator will get in touch with you.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 font-display">
                  Welcome to the Mariya Nuuman Foundation Volunteer Circle!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your application has been logged. Our volunteer coordinator will review your profile and contact you for upcoming field drives and orientation.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        location: '',
                        skills: '',
                        availability: 'Part-time',
                        areaOfInterest: 'Teaching & Education',
                        motivation: ''
                      });
                    }}
                    className="px-6 py-2.5 bg-brand-900 text-white font-semibold rounded-xl text-xs"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Maryam Bello"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="maryam@example.com"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="08012345678"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location / City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Kaduna / Zaria / Remote"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Area of Interest *
                    </label>
                    <select
                      value={formData.areaOfInterest}
                      onChange={e => setFormData({ ...formData, areaOfInterest: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    >
                      <option value="Teaching & Education">Teaching & Education Support</option>
                      <option value="Quran Outreach & Tajweed">Qur'an Outreach & Tajweed</option>
                      <option value="Vocational Skills Trainer">Vocational Skills Trainer (Tailoring/Trades)</option>
                      <option value="Digital Tech & Media">Digital Tech, Media & Photography</option>
                      <option value="Field Logistics & Distribution">Field Logistics & Food Distribution</option>
                      <option value="Medical & Healthcare Assistance">Medical & Healthcare Outreach</option>
                      <option value="Administrative Support">Administrative & Fundraising Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Availability *
                    </label>
                    <select
                      value={formData.availability}
                      onChange={e => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                    >
                      <option value="Weekends Only">Weekends Only</option>
                      <option value="Part-time (Few days/week)">Part-time (Few days/week)</option>
                      <option value="Full-time">Full-time</option>
                      <option value="On-Call for Field Drives">On-Call for Field Drives</option>
                      <option value="Remote / Virtual Support">Remote / Virtual Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skills, Profession & Experience *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.skills}
                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. Certified Tailor / Arabic Teacher / Graphic Designer / Nurse / Student"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Why would you like to volunteer with Mariya Nuuman Foundation? *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={formData.motivation}
                    onChange={e => setFormData({ ...formData, motivation: e.target.value })}
                    placeholder="Share what inspires you to serve vulnerable students and community beneficiaries."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Volunteer Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
