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
  Users,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import empowermentImage from '../../image/image 7.jfif';
import ProgramApplyModal from '../components/ProgramApplyModal';
import DonationPledgeModal from '../components/DonationPledgeModal';

export default function EducationSupport() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const pillars = [
    {
      title: "Women's Empowerment Programs",
      desc: "Providing women with vocational training, entrepreneurship mentoring, and microfinance support to achieve economic independence and break cycles of poverty.",
      icon: Sparkles,
      badge: "Empowerment"
    },
    {
      title: "Child Protection & Development",
      desc: "Creating safe environments for children to grow, learn, and thrive through nutrition support, mentorship programs, and community-based child welfare initiatives.",
      icon: ShieldCheck,
      badge: "Child Welfare"
    },
    {
      title: "Quality Education Access",
      desc: "Supplying standardized curriculum textbooks, durable backpacks, exercise notebooks, and covering tuition fees for children from vulnerable families.",
      icon: BookOpen,
      badge: "Education"
    },
    {
      title: "Vocational Skills Training",
      desc: "Equipping women and youth with market-ready trade skills including tailoring, digital literacy, agriculture, and small business management.",
      icon: GraduationCap,
      badge: "Skills Development"
    },
    {
      title: "Primary Healthcare Access",
      desc: "Organizing community health outreach, maternal and child health clinics, immunization drives, and health education workshops in underserved areas.",
      icon: Stethoscope,
      badge: "Healthcare"
    },
    {
      title: "Mental Health & Social Services",
      desc: "Providing counselling support, psychosocial services, and wellness programs to women and children affected by trauma, violence, or displacement.",
      icon: Heart,
      badge: "Wellbeing"
    }
  ];

  const sponsorshipTiers = [
    {
      title: "Women's Starter Kit",
      amount: "₦15,000",
      impact: "Provides a woman with basic vocational training materials, startup tools, and mentorship resources to begin her journey to self-reliance.",
      purpose: "Women Empowerment"
    },
    {
      title: "Back-to-School Student Kit",
      amount: "₦25,000",
      impact: "Provides a full year of exercise books, standard curriculum textbooks, writing materials, and a durable backpack for one pupil.",
      purpose: "Education Support"
    },
    {
      title: "Community Health Outreach",
      amount: "₦75,000",
      impact: "Funds a full-day community health clinic providing free check-ups, maternal care consultations, and health education for 50 women and children.",
      purpose: "Healthcare Access"
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
            Empowerment, Education & Healthcare
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Empowering Lives Through Action
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Empowering women and children to reach their full potential through quality education, skills training, and improved access to healthcare.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-brand-950 font-bold rounded-xl text-sm shadow-glow transition hover:brightness-110 flex items-center gap-2"
            >
              Support Our Initiatives
            </button>
            <button
              onClick={() => setIsApplyOpen(true)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition"
            >
              Apply for Support
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE CORE PROBLEM & OUR MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge="Our Core Mission"
              title="Building Brighter Futures for Women & Children"
              subtitle="When women are empowered and children are educated and healthy, entire communities are transformed."
              centered={false}
            />

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Across underserved communities, women and children face steep barriers to economic independence, quality education, and basic healthcare. Without access to marketable skills, learning resources, or medical services, entire families remain trapped in cycles of poverty.
              </p>
              <p>
                <strong>Mariya Nuuman Foundation</strong> firmly believes that every woman deserves the tools to build her own livelihood, every child deserves a quality education, and every family deserves access to healthcare. Our comprehensive programs bridge these critical gaps.
              </p>
            </div>

            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-brand-950 flex items-center gap-3">
                <Award className="w-8 h-8 text-gold-600 flex-shrink-0" />
                <p className="text-xs text-brand-900 leading-relaxed font-medium">
                  Over <strong>640+</strong> vocational graduates, <strong>1,820+</strong> students supported with study materials, and <strong>500+</strong> women and children served through community health outreach.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={empowermentImage}
                alt="Women and children empowerment"
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
            badge="Our Approach"
            title="How Mariya Nuuman Foundation Creates Lasting Impact"
            subtitle="Targeted interventions empowering women and children through education, skills training, and healthcare."
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
          title="Sponsor a Woman, Child, or Community Health Drive"
          subtitle="Directly fund empowerment programs that create lasting, sustainable change."
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
              Community Support Desk
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Are You a Woman, Parent, or Community Leader in Need?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
              Mariya Nuuman Foundation accepts applications from women seeking empowerment programs, parents seeking educational support for their children, and communities in need of healthcare outreach.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsApplyOpen(true)}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold rounded-xl text-sm transition"
              >
                Submit a Support Request
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
