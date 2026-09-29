import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Heart,
  Target,
  Eye,
  ShieldCheck,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Award
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function AboutUs() {
  const values = [
    {
      title: 'Ihsan (Excellence & Sincerity)',
      desc: 'We perform all educational and humanitarian outreach with sincere intention and the highest standard of execution.',
      icon: Award
    },
    {
      title: 'Amanah (Trust & Integrity)',
      desc: 'Every donor contribution, sponsorship penny, and educational asset is treated as a sacred trust with complete accountability.',
      icon: ShieldCheck
    },
    {
      title: 'Empowerment over Dependency',
      desc: 'Our fundamental goal is to equip beneficiaries with skills, toolkits, and knowledge that lead to sustainable self-sufficiency.',
      icon: Sparkles
    },
    {
      title: 'Rahmah (Compassion & Inclusivity)',
      desc: 'Serving the vulnerable, orphans, widows, and underserved students with genuine love, empathy, and respect.',
      icon: Heart
    }
  ];

  const objectives = [
    "To empower women and children to reach their full potential and break cycles of inequality and poverty.",
    "To provide access to quality education and skills training, enabling women and children to achieve economic independence and self-sufficiency.",
    "To support women's economic empowerment through entrepreneurship, job training, and microfinance initiatives, promoting financial stability and security.",
    "To improve access to healthcare, mental health support, and social services, ensuring the well-being and dignity of women and children.",
    "To protect women and children from violence, abuse, and exploitation, providing a safe and supportive environment for all.",
    "To advocate for gender equality, child rights, and social justice, influencing policy and driving systemic change.",
    "To build a sense of community and solidarity among women and children, promoting social connections and support networks.",
    "To strengthen the capacity of local organizations, communities, and individuals to promote sustainable development and social change.",
    "To do anything and everything that may be necessary towards achieving the aims and objectives of the foundation."
  ];

  const whoWeServe = [
    {
      title: "Women & Female Entrepreneurs",
      desc: "Widows, single mothers, and grassroots women seeking vocational trades, business mentoring, and microfinance support.",
      icon: Heart
    },
    {
      title: "Vulnerable Children & Students",
      desc: "Pupils and learning center students receiving essential study supplies, backpacks, tuition grants, and Qur'an distribution.",
      icon: GraduationCap
    },
    {
      title: "Unemployed Youth & School Leavers",
      desc: "Young adults seeking vocational dignity, market-ready trade skills, and digital freelancing opportunities.",
      icon: Users
    },
    {
      title: "Communities & Local Organizations",
      desc: "Grassroots settlements benefiting from healthcare advocacy, community solidarity, safe water, and capacity building.",
      icon: Sparkles
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO / BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            Who We Are
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            About Mariya Nuuman Foundation
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            A dedicated charitable foundation committed to empowering women and children to reach their full potential, providing quality education and skills training, and supporting students through Qur'an distribution and community development.
          </p>
        </div>
      </section>

      {/* 2. OUR STORY & BACKGROUND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge="Our Genesis & Philosophy"
              title="Building a Legacy of Hope, Knowledge & Dignity"
              subtitle="Founded on the timeless belief that true charity elevates a person to independence."
              centered={false}
            />

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>Mariya Nuuman Foundation</strong> was established to empower women and children, break cycles of inequality and poverty, and foster sustainable self-reliance across communities.
              </p>
              <p>
                Across underserved communities, women and young adults face steep economic challenges without access to marketable skills or financial support, while children and students often lack basic educational tools and sacred scriptures. As part of our educational outreach, we provide authenticated copies of the Holy Qur'an, textbooks, and learning supplies to students.
              </p>
              <p>
                We bridge these divides through comprehensive interventions: quality education, skills training, entrepreneurship, healthcare access, social protection, and Qur'an distribution to build resilient and dignified communities.
              </p>
            </div>

            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-950 space-y-1">
                <span className="font-bold text-sm block font-display">Our Fundamental Motto:</span>
                <p className="text-xs text-brand-800 italic">
                  "Empowering women and children, protecting human dignity, and building enduring self-sufficiency through education, skills, and community solidarity."
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80"
                  alt="Quran student"
                  className="rounded-2xl shadow-md aspect-4/5 object-cover w-full"
                />
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                  <span className="text-2xl font-bold font-display text-gold-600 block">3,450+</span>
                  <span className="text-xs text-slate-500 font-medium">Qur'ans Distributed</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="p-4 rounded-2xl bg-brand-900 text-white shadow-sm text-center">
                  <span className="text-2xl font-bold font-display text-gold-400 block">640+</span>
                  <span className="text-xs text-emerald-200 font-medium">Vocational Graduates</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80"
                  alt="Vocational garment training"
                  className="rounded-2xl shadow-md aspect-4/5 object-cover w-full"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4 border border-brand-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400 block">Our Sacred Purpose</span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">Our Mission</h3>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                To empower women and children to reach their full potential and break cycles of inequality and poverty by providing access to quality education, healthcare, skills training, and economic opportunities, while supporting students through Qur'an distribution and community development.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs text-emerald-200/70">
              Uplifting human dignity, promoting gender equality, and driving systemic social change.
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4 border border-slate-700 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400 block">Our Long-Term Horizon</span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">Our Vision</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                A resilient, just, and equitable society where women and children achieve economic independence, well-being, and dignity, supported by thriving communities and sustainable development.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
              Building lasting community solidarity, child protection, and self-reliance for all.
            </div>
          </div>

        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <SectionHeader
            badge="Guiding Principles"
            title="Our Core Values"
            subtitle="The ethical standards that govern every program, disbursement, and community engagement."
            centered={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center border border-brand-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-display">
                    {v.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. STRATEGIC OBJECTIVES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeader
          badge="Aims & Objectives"
          title="Aims and Objectives of Mariya Nuuman Foundation"
          subtitle="The core aims and objectives driving our commitment to empower women, children, and communities."
          centered={true}
        />

        <div className="max-w-4xl mx-auto space-y-3">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-gold-500 text-brand-950 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                0{i + 1}
              </div>
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                {obj}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHO WE SERVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Beneficiary Focus"
          title="Who We Serve"
          subtitle="Directing charitable resources to where they generate the deepest and most enduring impact."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whoWeServe.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-display">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. TRANSPARENCY & GOVERNANCE PLEDGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-50 border border-brand-200 text-center space-y-6 max-w-4xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-brand-900 text-gold-400 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-brand-950">
            Our Commitment to Trust & Financial Amanah
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto">
            At Mariya Nuuman Foundation, we hold ourselves accountable to both our donors and the Almighty. Every contribution is allocated strictly in alignment with specified donor intentions, with zero administrative waste.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/donate"
              className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-sm transition"
            >
              Support Our Projects
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-brand-900 font-semibold rounded-xl text-sm border border-slate-300 transition"
            >
              Contact Our Board
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
