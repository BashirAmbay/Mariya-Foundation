import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Heart,
  GraduationCap,
  CheckCircle2,
  Package,
  Layers,
  Award,
  ArrowRight,
  HelpCircle,
  Users
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ProgramApplyModal from '../components/ProgramApplyModal';
import DonationPledgeModal from '../components/DonationPledgeModal';

export default function EducationSupport() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const pillars = [
    {
      title: "Noble Qur'an Distribution",
      desc: "Delivering durable, clear-font Tajweed copies of the Holy Qur'an to community Madrasahs, Tahfeez circles, and students who have never owned their personal Mushaf.",
      icon: BookOpen,
      badge: "Spiritual Literacy"
    },
    {
      title: "Qur'anic Learning Aids & Tajweed Guides",
      desc: "Equipping learning halls with wooden book rests (rehal), recitation audio aids, Qa'idah learning charts, and teacher instruction manuals.",
      icon: Sparkles,
      badge: "Tahfeez Acceleration"
    },
    {
      title: "School Backpacks & Textbooks",
      desc: "Supplying standardized curriculum textbooks, durable backpacks, exercise notebooks, and mathematical sets to children from vulnerable families.",
      icon: Package,
      badge: "Basic Education"
    },
    {
      title: "Writing & Classroom Materials",
      desc: "Providing pens, pencils, erasers, sharpeners, drawing pads, and classroom blackboards/whiteboards to underserved rural schools.",
      icon: Layers,
      badge: "Classroom Supply"
    },
    {
      title: "Student Financial Assistance",
      desc: "Covering termly tuition fees, PTA levies, and uniform costs for children at risk of being sent away from school due to non-payment.",
      icon: Users,
      badge: "Direct Student Aid"
    },
    {
      title: "Merit & Need Scholarships",
      desc: "Funding final year examination fees (e.g. WAEC, NECO, BECE) and higher education tuition for brilliant students from indigent backgrounds.",
      icon: GraduationCap,
      badge: "Academic Excellence"
    }
  ];

  const sponsorshipTiers = [
    {
      title: "Mushaf & Tajweed Pack",
      amount: "₦15,000",
      impact: "Supplies 5 durable Holy Qur'ans and 5 Tajweed practice workbooks to young Tahfeez students in a rural Madrasah.",
      purpose: "Quran Distribution"
    },
    {
      title: "Back-to-School Student Kit",
      amount: "₦25,000",
      impact: "Provides a full year of exercise books, standard curriculum textbooks, writing materials, and a durable backpack for one pupil.",
      purpose: "Student Books & Supplies"
    },
    {
      title: "Madrasah Classroom Toolkit",
      amount: "₦75,000",
      impact: "Equips an entire rural classroom with 30 Mushafs, wooden reading desks, classroom charts, and teacher reference materials.",
      purpose: "Quran Distribution"
    },
    {
      title: "Full Academic Term Sponsorship",
      amount: "₦120,000",
      impact: "Covers complete schooling tuition, examination levies, uniforms, and study supplies for an indigent student for one academic year.",
      purpose: "Education Support"
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <BookOpen className="w-3.5 h-3.5" /> Nurturing Minds & Hearts
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Education & Qur'anic Support
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Eliminating barriers to learning by equipping students with the Holy Qur'an, textbooks, stationery, and academic sponsorships.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-gold-500 to-amber-600 text-brand-950 font-bold rounded-xl text-sm shadow-glow transition hover:brightness-110 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-brand-950" />
              Sponsor Qur'ans & Study Kits
            </button>
            <button
              onClick={() => setIsApplyOpen(true)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition"
            >
              Apply for Educational Support
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE CORE PROBLEM & OUR MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge="Our Sacred Mandate"
              title="Every Child Deserves the Dignity of Learning"
              subtitle="When children have their own books and sacred texts, learning is transformed from a struggle into an inspiration."
              centered={false}
            />

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                In hundreds of grassroots Madrasahs and basic schools across our target communities, eager young students assemble each morning with deep enthusiasm but critically limited resources. Often, four or more children must cluster around a single worn copy of the Mushaf or a shared notebook.
              </p>
              <p>
                <strong>Mariya Foundation</strong> firmly believes that poverty should never deprive a child of reciting the words of Allah or pursuing foundational academic literacy. Our comprehensive educational initiatives ensure that learners receive top-tier, long-lasting study materials.
              </p>
            </div>

            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-brand-950 flex items-center gap-3">
                <Award className="w-8 h-8 text-gold-600 flex-shrink-0" />
                <p className="text-xs text-brand-900 leading-relaxed font-medium">
                  Over <strong>3,450+</strong> Holy Qur'ans and <strong>1,820+</strong> Back-to-School study packs have been distributed directly to verified community students.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1000&q=80"
                alt="Quran study circle"
                className="w-full h-auto object-cover aspect-4/3"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. SIX PILLARS OF EDUCATIONAL ASSISTANCE */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <SectionHeader
            badge="Comprehensive Spectrum"
            title="How Mariya Foundation Supports Students"
            subtitle="Targeted interventions covering spiritual, academic, and material educational needs."
            centered={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center border border-brand-200">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. HOW YOU CAN SPONSOR EDUCATION (TIERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Sponsorship Opportunities"
          title="Sponsor a Student or Qur'an Distribution"
          subtitle="Directly fund educational kits that leave a lasting legacy (Sadaqah Jariyah)."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsorshipTiers.map((tier, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-brand-800 shadow-soft hover:shadow-card transition p-6 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-900">
                  {tier.title}
                </span>
                <div className="text-3xl font-extrabold font-display text-gold-600">
                  {tier.amount}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tier.impact}
                </p>
              </div>

              <button
                onClick={() => setIsDonateOpen(true)}
                className="w-full py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                Sponsor This Tier
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. APPLICATION CALLOUT FOR NEEDY STUDENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-950 text-white text-center space-y-6 max-w-4xl mx-auto relative overflow-hidden border border-brand-800">
          <div className="absolute inset-0 bg-emerald-pattern opacity-10 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-500/20 px-3 py-1 rounded-full border border-gold-500/30">
              Student Assistance Desk
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Are You a Student or Madrasah Administrator in Need?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
              Mariya Foundation accepts applications from community Madrasahs, teachers, and indigent parents seeking study packs, Mushafs, or academic support.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsApplyOpen(true)}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold rounded-xl text-sm transition"
              >
                Submit an Educational Support Request
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProgramApplyModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />

      <DonationPledgeModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />

    </div>
  );
}
