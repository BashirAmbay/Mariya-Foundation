import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Sparkles,
  Heart,
  ArrowRight,
  GraduationCap,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Award,
  Star,
  Quote
} from 'lucide-react';
import { api } from '../api/client';
import SectionHeader from '../components/SectionHeader';
import ProgramApplyModal from '../components/ProgramApplyModal';
import DonationPledgeModal from '../components/DonationPledgeModal';

export default function Home() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Fetch Featured Programs
  const { data: programsData } = useQuery({
    queryKey: ['featured-programs'],
    queryFn: () => api.get('/programs?featured=true')
  });

  // Fetch Impact Stats
  const { data: impactStatsData } = useQuery({
    queryKey: ['impact-stats'],
    queryFn: () => api.get('/impact/stats')
  });

  // Fetch Testimonials
  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials')
  });

  // Fetch Gallery Preview (first 4 items)
  const { data: galleryData } = useQuery({
    queryKey: ['gallery-preview'],
    queryFn: () => api.get('/gallery')
  });

  // Fetch Latest News (top 3)
  const { data: newsData } = useQuery({
    queryKey: ['latest-news'],
    queryFn: () => api.get('/news?limit=3')
  });

  const featuredPrograms = programsData?.data?.slice(0, 3) || [];
  const impactStats = impactStatsData?.data || [];
  const testimonials = testimonialsData?.data || [];
  const galleryItems = galleryData?.data?.slice(0, 4) || [];
  const newsItems = newsData?.data || [];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-brand-950 overflow-hidden text-white">
        {/* Background Image with Deep Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=2000&q=80"
            alt="Mariya Nuuman Foundation Education and Community Support"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-brand-950/60" />
          <div className="absolute inset-0 bg-emerald-pattern opacity-20 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-pink-500/20 text-pink-300 border border-gold-500/30 shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Dedicated to Qur'anic Learning, Education & Self-Reliance</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Logo Image */}
            <div className="flex justify-center mb-2">
              <img
                src="/logo.png"
                alt="Mariya Nuuman Foundation Logo"
                className="h-32 sm:h-40 w-auto object-contain drop-shadow-2xl"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-tight">
              Mariya Nuuman Foundation
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 font-light leading-relaxed max-w-3xl mx-auto">
              Empowering people to become self-reliant and supporting students through sacred Qur'anic and general education.
            </p>
          </div>

          {/* Dual Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-2xl transition-all"
            >
              <Heart className="w-5 h-5" />
              <span>Support Our Mission</span>
            </button>
            <Link
              to="/programs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-2xl transition-all"
            >
              <span>View Our Programs</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Value Pillars Badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left border-t border-white/10">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-pink-400 font-bold block text-sm font-display">Qur'an Distribution</span>
              <span className="text-[12px] text-slate-300">Supplying sacred texts & Tajweed kits</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-pink-400 font-bold block text-sm font-display">Student Support</span>
              <span className="text-[12px] text-slate-300">Books, study packs & scholarships</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-pink-400 font-bold block text-sm font-display">Vocational Skills</span>
              <span className="text-[12px] text-slate-300">Fashion design, trades & tech hubs</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-pink-400 font-bold block text-sm font-display">Self-Reliance</span>
              <span className="text-[12px] text-slate-300">Micro-grants & business mentoring</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FOUNDATION INTRODUCTION & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-900 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              About Mariya Nuuman Foundation
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
              Nurturing Minds, Building Dignity & Fostering Independence
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              <strong>Mariya Nuuman Foundation</strong> is a community-focused charitable organization established to tackle two foundational pillars of social upliftment: **empowerment towards self-reliance** and **holistic educational support**.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We believe that long-term community transformation occurs when students are equipped with knowledge and sacred scripture, while vulnerable individuals are trained with practical vocational skills that remove dependency on hand-outs.
            </p>

            {/* Core Values Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Amanah (Trust)</span>
                  <span className="text-xs text-slate-500">Every donation accounted for transparently</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Self-Reliance</span>
                  <span className="text-xs text-slate-500">Sustainable skills over permanent aid</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-brand-900 font-bold hover:text-gold-600 transition group text-sm"
              >
                <span>Read our complete story, vision and values</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80"
                alt="Students studying with devotion"
                className="w-full h-auto object-cover aspect-4/3"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/60">
                <p className="text-xs font-semibold text-brand-950 font-display">
                  "Knowledge illuminates the heart, while vocational mastery empowers the hands."
                </p>
                <span className="text-[11px] text-slate-500 block mt-1">
                  — Mariya Nuuman Foundation Guiding Philosophy
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURED PROGRAMS */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeader
              badge="Our Core Programs"
              title="Transformative Initiatives in Action"
              subtitle="From distributing the Holy Qur'an to equipping aspiring fashion designers and tech creators with life-changing skills."
              centered={false}
            />
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-brand-900 font-bold text-sm border border-slate-200 shadow-sm transition whitespace-nowrap self-start md:self-auto"
            >
              <span>Explore All Programs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={prog.image_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-950/80 text-gold-300 backdrop-blur-md border border-brand-800">
                    {prog.category_name}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-brand-900 transition">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {prog.short_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedProgram(prog);
                        setIsApplyOpen(true);
                      }}
                      className="text-xs font-bold text-brand-900 hover:text-gold-600 transition flex items-center gap-1"
                    >
                      Apply / Inquire
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      to="/programs"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Learn Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. DUAL SPOTLIGHT: EDUCATION & EMPOWERMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Education Spotlight Card */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                <BookOpen className="w-3.5 h-3.5" /> Education & Qur'anic Focus
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Supporting Students with Sacred Texts & Study Materials
              </h3>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Madrasahs and basic community schools receive durable Mushafs, Tajweed aids, backpacks, and stationery kits to ensure every student learns with dignity and enthusiasm.
              </p>
              <ul className="space-y-2 text-xs text-emerald-200/90 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" /> Tahfeez & Tajweed learning kits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" /> Back-to-school backpacks & writing sets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" /> Examination & scholarship support
                </li>
              </ul>
            </div>
            <div className="pt-8 relative z-10">
              <Link
                to="/education"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold text-xs uppercase tracking-wider transition"
              >
                Learn More About Education Support
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Empowerment Spotlight Card */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Empowerment & Self-Reliance
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Vocational Mastery & Micro-Enterprise Toolkits
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Breaking the cycle of poverty by providing practical 6-month vocational training in fashion design, digital productivity, and trade skills, paired with startup equipment.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" /> Sewing machines & tailoring startup packs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" /> Youth digital literacy & creative hubs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" /> Micro-business seed grants & coaching
                </li>
              </ul>
            </div>
            <div className="pt-8 relative z-10">
              <Link
                to="/empowerment"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold text-xs uppercase tracking-wider transition"
              >
                Explore Empowerment Programs
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. LIVE IMPACT METRICS */}
      <section className="bg-brand-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">

          <SectionHeader
            badge="Our Community Reach"
            title="Tangible Impact from Compassionate Giving"
            subtitle="Illustrating our active and cumulative outreach across education, empowerment, and welfare."
            centered={true}
            dark={true}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {impactStats.map((stat) => (
              <div
                key={stat.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2 hover:bg-white/10 transition"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-gold-400">
                  {stat.prefix}{Number(stat.value).toLocaleString()}{stat.suffix}
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  {stat.label}
                </h4>
                <p className="text-xs text-emerald-200/70 line-clamp-2">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400 italic">
              * Figures represent cumulative project metrics and verified program logs.
            </p>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge="Voices of Gratitude"
            title="Words from Our Beneficiaries & Community"
            subtitle="Real experiences of students, educators, and graduates empowered by Mariya Nuuman Foundation."
            centered={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-gold-500">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={t.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-brand-100 shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">{t.name}</h4>
                    <p className="text-xs text-brand-800 font-medium">{t.role_title}</p>
                    {t.location && <p className="text-[11px] text-slate-400">{t.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. GALLERY PREVIEW */}
      {galleryItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader
              badge="Media Gallery"
              title="Moments on the Field"
              subtitle="Glimpses of Qur'an distributions, vocational workshops, and clean water handovers."
              centered={false}
            />
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-900 hover:text-gold-600 transition"
            >
              View Full Gallery →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-100 shadow-sm"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] uppercase font-bold text-gold-400">{item.category}</span>
                  <h4 className="text-xs font-bold leading-tight font-display">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. LATEST NEWS & ANNOUNCEMENTS */}
      {newsItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader
              badge="News & Updates"
              title="Recent Activities & Announcements"
              subtitle="Stay informed about our latest campaigns, beneficiary stories, and field reports."
              centered={false}
            />
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-900 hover:text-gold-600 transition"
            >
              View All News →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-soft hover:shadow-card transition flex flex-col group"
              >
                <div className="aspect-16/9 bg-slate-100 overflow-hidden relative">
                  <img
                    src={article.featured_image || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-brand-950/80 text-gold-300 backdrop-blur-md">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-brand-900 transition leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/news/${article.slug || article.id}`}
                      className="text-xs font-bold text-brand-900 hover:text-gold-600 transition flex items-center gap-1"
                    >
                      Read Full Story <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 9. VOLUNTEER & DONATION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-950 via-brand-900 to-emerald-950 text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-brand-800">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
              <Users className="w-3.5 h-3.5" /> Be Part of the Movement
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white leading-tight">
              Lend Your Skills, Time, or Generosity to Mariya Nuuman Foundation
            </h2>
            <p className="text-base text-emerald-100/80 leading-relaxed">
              Whether you wish to sponsor copies of the Holy Qur'an, fund vocational toolkits for widows, or volunteer as a teacher or mentor, your partnership is deeply valued.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setIsDonateOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold text-sm shadow-glow transition flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-brand-950" />
                Make a Donation
              </button>
              <Link
                to="/get-involved"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition flex items-center gap-2"
              >
                Apply to Volunteer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
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
