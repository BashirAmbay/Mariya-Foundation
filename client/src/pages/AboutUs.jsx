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
    "Distribute authenticated, high-quality copies of the Holy Qur'an and Tajweed study guides to rural and indigent learning centers.",
    "Eliminate financial barriers for impoverished primary, secondary, and Tahfeez students through study packs and tuition grants.",
    "Provide accredited, intensive vocational training (garment construction, tech literacy, artisanal trades) to youth and women.",
    "Supply graduating vocational apprentices with startup equipment and micro-capital to launch self-sustaining businesses.",
    "Facilitate clean water access, seasonal food relief, and community welfare infrastructure in underserved settlements."
  ];

  const whoWeServe = [
    {
      title: "Tahfeez & Madrasah Students",
      desc: "Young learners committed to Qur'anic memorization and Islamic sciences in resource-constrained community schools.",
      icon: BookOpen
    },
    {
      title: "Underprivileged Basic School Pupils",
      desc: "Children from low-income families in danger of school dropout due to a lack of notebooks, backpacks, and basic stationery.",
      icon: GraduationCap
    },
    {
      title: "Unemployed Youth & School Leavers",
      desc: "Young adults seeking vocational dignity, market-ready trade skills, and digital freelancing opportunities.",
      icon: Users
    },
    {
      title: "Widows & Grassroots Women Traders",
      desc: "Female heads of household needing tailoring machinery, business mentoring, and micro-capital to provide for their children.",
      icon: Heart
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO / BANNER */}
      <section className="relative bg-brand-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Who We Are
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            About Mariya Nuuman Foundation
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            A dedicated community charitable trust committed to illuminating lives with Qur'anic education and empowering people with vocational self-reliance.
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
                <strong>Mariya Nuuman Foundation</strong> was established in response to two persistent grassroots realities: the acute shortage of sacred texts and basic learning materials in community Madrasahs, and the rampant economic vulnerability facing young adults and women without vocational skills.
              </p>
              <p>
                In many rural communities, students eager to memorize the Holy Qur'an share a single damaged Mushaf among several learners. Simultaneously, thousands of youth and female heads of household lack the marketable trades needed to support their households, leading to perpetual poverty.
              </p>
              <p>
                We bridge this gap through structured, sustainable interventions: providing durable Qur'ans, school kits, and academic scholarships on one hand, while establishing intensive vocational workshops, gifting startup equipment, and offering micro-business grants on the other.
              </p>
            </div>

            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-950 space-y-1">
                <span className="font-bold text-sm block font-display">Our Fundamental Motto:</span>
                <p className="text-xs text-brand-800 italic">
                  "Give a person knowledge, and you enlighten their soul. Give them a practical trade, and you secure their independence for a lifetime."
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
                To empower underserved individuals and communities to become economically and socially self-reliant, while facilitating holistic Qur’anic and formal education support for students in need.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs text-emerald-200/70">
              Uplifting human dignity through education and sustainable livelihood generation.
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
                A resilient, ethical society where every individual has the educational opportunity, vocational dignity, and moral grounding to uplift themselves and contribute meaningfully to their communities.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
              Creating a sustainable ripple effect of knowledge, enterprise, and social justice.
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
          badge="Strategic Goals"
          title="Key Objectives of Mariya Nuuman Foundation"
          subtitle="Specific, actionable benchmarks we continuously pursue across our operations."
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
