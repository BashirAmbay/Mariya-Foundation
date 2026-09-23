import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import SectionHeader from '../components/SectionHeader';

export default function ContactUs() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How does Mariya Nuuman Foundation select beneficiaries for Qur'an and education support?",
      a: "Our field coordinators conduct direct baseline visits to community Madrasahs, basic schools, and low-income settlements, partnering with trusted local imams, headteachers, and community elders to verify student need."
    },
    {
      q: "Can I sponsor specific items, like only Holy Qur'ans or sewing machines?",
      a: "Yes, absolutely! When donating or making a pledge on our Donate page, you can select designated purposes such as 'Qur'an Distribution' or 'Vocational Skills Toolkits'. 100% of your gift is restricted to that program."
    },
    {
      q: "Where does vocational skills training take place?",
      a: "Our vocational courses (tailoring, digital literacy, crafts) run at community partner centers and dedicated Mariya Nuuman Foundation workshops with full hands-on equipment."
    },
    {
      q: "How can I receive verification of my donation's impact?",
      a: "We publish transparent photo and narrative updates in our Gallery and News sections. Sponsoring donors can also request direct distribution logs with community committee signatures."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      addToast('Message sent successfully! Our administrative team will reply shortly.');
    } catch (err) {
      setError(err.message || 'Failed to send message. Please check the form.');
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
            <Mail className="w-3.5 h-3.5" /> Reach Out to Us
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Contact Mariya Nuuman Foundation
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Have questions about our programs, partnerships, student sponsorships, or wish to visit our administrative secretariat? We are here to assist.
          </p>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & FORM GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact Information Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-900 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Get In Touch
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                Secretariat & Information Desk
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect with our team directly via telephone, WhatsApp, or official email for all inquiries.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center border border-brand-200 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 font-display">Office Address</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Plot 12, Community Development Crescent, Kaduna State, Nigeria (Placeholder)
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center border border-brand-200 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 font-display">Email Address</h4>
                  <p className="text-xs text-slate-600">
                    <a href="mailto:info@mariyafoundation.org" className="hover:text-brand-900 font-semibold">
                      info@mariyafoundation.org (Placeholder)
                    </a>
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center border border-brand-200 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 font-display">Telephone Contact</h4>
                  <p className="text-xs text-slate-600">
                    +234  806 863 9972
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-900 text-white shadow-soft space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-300" />
                  <h4 className="text-sm font-bold font-display text-white">Direct WhatsApp Assistance</h4>
                </div>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Have a quick inquiry or wish to verify sponsorship account instructions? Chat with our representative instantly on WhatsApp.
                </p>
                <a
                  href="https://wa.me/2348068639972"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold text-xs rounded-xl transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-brand-950" />
                  Chat on WhatsApp Now
                </a>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 sm:p-10 space-y-6">

              <div>
                <h3 className="text-2xl font-bold font-display text-slate-900">
                  Send Us a Message
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Fill out the form below. Messages are routed directly to our administration desk.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 font-display">
                    Thank You! Your Message is Received.
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    We appreciate your message to <strong>Mariya Nuuman Foundation</strong>. Our team will review your inquiry and get in touch with you shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          subject: '',
                          message: ''
                        });
                      }}
                      className="px-6 py-2.5 bg-brand-900 text-white font-semibold rounded-xl text-xs"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

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

                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="08012345678"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Quran Sponsorship Inquiry"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please state your inquiry or proposal in detail..."
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
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message to Foundation
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          badge="Help & Clarity"
          title="Frequently Asked Questions"
          subtitle="Quick answers to common questions about our foundation, programs, and donations."
          centered={true}
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 text-sm font-display hover:text-brand-900"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180 text-brand-900' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. LOCATION MAP PLACEHOLDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 h-64 sm:h-80 relative flex items-center justify-center text-center p-6">
          <div className="space-y-2 z-10">
            <div className="w-12 h-12 rounded-full bg-brand-900 text-gold-400 flex items-center justify-center mx-auto shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-display text-slate-800">
              Mariya Nuuman Foundation Secretariat Location
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Plot 12, Community Development Crescent, Kaduna State, Nigeria (Placeholder location map).
            </p>
          </div>
          {/* Subtle background grid */}
          <div className="absolute inset-0 bg-slate-200/50 bg-islamic-pattern opacity-20 pointer-events-none" />
        </div>
      </section>

    </div>
  );
}
