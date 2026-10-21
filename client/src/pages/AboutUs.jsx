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
  GraduationCap
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import founderImage from '../../image/image 4.jpg';

export default function AboutUs() {

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
            A dedicated charitable foundation committed to empowering women and children to reach their full potential, providing quality education and skills training, and supporting students through community development.
          </p>
        </div>
      </section>

      {/* 2. OUR STORY & BACKGROUND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge="ABOUT US"
              title="MEET THE FOUNDER"
              subtitle="Founded on the timeless belief that true charity elevates a person to independence."
              centered={false}
            />

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>Mariya Nuuman Founder & Executive Director</strong> Mariya Nuuman is the founder of Mariya Nuuman Foundation, an organisation committed to empowering women, supporting vulnerable communities, and creating opportunities for sustainable livelihoods.
              </p>
              <p>
                Her work focuses on women’s empowerment, climate-smart agriculture, skills development, food security, and community development. She is particularly interested in initiatives that help women build practical skills, improve their livelihoods, and become more economically independent.
              </p>
              <p>
                Through the foundation, Mariya works to support community based initiatives that respond to local needs and create opportunities for lasting progress. Her approach recognises the importance of equipping people with the knowledge, resources, and support they need to build better futures for themselves and their families.
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

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={founderImage}
                alt="Mariya Nuuman - Founder"
                className="w-full h-auto object-cover aspect-4/3"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/60">
                <p className="text-xs font-semibold text-brand-950 font-display">
                  Empowering women and children, protecting human dignity, and building enduring self-sufficiency.
                </p>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Mariya Nuuman — Founder & Executive Director
                </span>
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
