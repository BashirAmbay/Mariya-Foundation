import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Scissors,
  Laptop,
  Coins,
  TrendingUp,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowRight,
  Heart,
  Briefcase
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ProgramApplyModal from '../components/ProgramApplyModal';
import DonationPledgeModal from '../components/DonationPledgeModal';

export default function EmpowermentPrograms() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const pillars = [
    {
      title: "Vocational Tailoring & Garment Academy",
      desc: "Intensive 6-month hands-on apprenticeship in fashion design, modern cutting, machine servicing, and bridal stitching, culminating in the gift of a brand new industrial sewing machine upon graduation.",
      icon: Scissors,
      badge: "6-Month Cohort"
    },
    {
      title: "Youth Tech Literacy & Digital Hub",
      desc: "Practical computer training in office productivity suites, digital graphic design, typing proficiency, and ethical online freelancing to link local youth to global remote jobs.",
      icon: Laptop,
      badge: "12-Week Intensive"
    },
    {
      title: "Grassroots Small Business Seed Grants",
      desc: "Direct micro-capital injections combined with mandatory financial literacy workshops, enabling petty traders and market women to purchase wholesale inventory and escape high-interest loans.",
      icon: Coins,
      badge: "Micro-Enterprise"
    },
    {
      title: "Women Economic Independence Circles",
      desc: "Targeted support for widows and single mothers through soap making, catering, agro-processing, and cooperative savings groups (Esusu) to build household resilience.",
      icon: Users,
      badge: "Female Household Heads"
    },
    {
      title: "Artisanal Trade Apprenticeships",
      desc: "Placing determined youth in certified carpentry, electrical installation, plumbing, and solar maintenance workshops with paid apprentice stipends and safety toolkits.",
      icon: Briefcase,
      badge: "Technical Trades"
    },
    {
      title: "Business Mentorship & Bookkeeping",
      desc: "Weekly field coaching in basic cashbook management, customer service, inventory pricing, and formal business registration for growing micro-enterprises.",
      icon: TrendingUp,
      badge: "Mentorship & Growth"
    }
  ];

  const selfRelianceSteps = [
    {
      step: "01",
      title: "Needs Assessment & Selection",
      desc: "Identification of committed youth, widows, and vulnerable household heads through community vetting."
    },
    {
      step: "02",
      title: "Intensive Hands-on Training",
      desc: "Practical curriculum taught by master craftsmen and certified instructors with modern workshop equipment."
    },
    {
      step: "03",
      title: "Graduation & Tool Provision",
      desc: "Graduates receive brand-new start-up machinery (e.g. sewing machines, computer toolkits) and seed materials."
    },
    {
      step: "04",
      title: "12-Month Field Mentorship",
      desc: "Foundation advisors track business health, savings habits, and help apprentices become employers of others."
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Building Self-Sufficiency
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Empowerment & Self-Reliance
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Equipping people with market-ready vocational skills, startup toolkits, and micro-grants so they can support their families with independence and honor.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsApplyOpen(true)}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold rounded-xl text-sm shadow-glow transition"
            >
              Apply for Vocational Training
            </button>
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              Sponsor an Apprentice's Toolkit
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY: SUSTAINABILITY OVER HANDOUTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge="Sustainable Charity"
              title="Moving From Perpetual Aid to Lasting Dignity"
              subtitle="Temporary relief sustains a person for a day; practical vocational mastery feeds a household for generations."
              centered={false}
            />

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                At <strong>Mariya Nuuman Foundation</strong>, our empowerment initiatives are built on the foundational Islamic ethos of self-reliance. While emergency welfare is essential in crises, genuine social transformation demands that beneficiaries gain the technical skills, tools, and business acumen necessary to earn their own lawful livelihood.
              </p>
              <p>
                We do not merely teach a trade and walk away. Every graduate of our vocational programs is gifted their own operational equipment (such as heavy-duty sewing machines or digital design systems) and connected to a one-year mentorship network.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 text-slate-800 space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-gold-800 block font-display">
                The Islamic Standard of Work:
              </span>
              <p className="text-xs text-slate-700 italic">
                "No one has ever eaten a better meal than that which they have earned by the labor of their own hands." — Prophetic Saying
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
                alt="Vocational garment making trainees"
                className="w-full h-auto object-cover aspect-4/3"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE EMPOWERMENT PROGRAMS */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <SectionHeader
            badge="Program Areas"
            title="Vocational Trades & Micro-Enterprise Pathways"
            subtitle="Hands-on skills designed to address real market demands in contemporary local economies."
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

      {/* 4. THE 4-STEP EMPOWERMENT MODEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Structured Methodology"
          title="The Mariya Nuuman Foundation Empowerment Model"
          subtitle="A proven four-stage cycle that converts vulnerability into sustained commercial success."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {selfRelianceSteps.map((step, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 relative overflow-hidden"
            >
              <span className="text-3xl font-extrabold font-display text-gold-500/40 block">
                {step.step}
              </span>
              <h4 className="text-base font-bold text-slate-900 font-display">
                {step.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-950 via-brand-900 to-slate-950 text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-brand-800 text-center max-w-4xl mx-auto">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-500/20 px-3 py-1 rounded-full border border-gold-500/30">
              Vocational Enrollment
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Ready to Learn a Trade and Transform Your Livelihood?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Applications for our upcoming cohort of Vocational Fashion Design, Digital Tech Literacy, and Small Business Micro-Grants are now open.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setIsApplyOpen(true)}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold rounded-xl text-sm transition"
              >
                Apply for Upcoming Cohort
              </button>
              <button
                onClick={() => setIsDonateOpen(true)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                Fund a Graduate's Tool
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
