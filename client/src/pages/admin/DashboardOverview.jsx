import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  TrendingUp,
  MessageSquare,
  Users,
  FileSpreadsheet,
  Image,
  Newspaper,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';
import { api } from '../../api/client';

export default function DashboardOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => api.get('/stats/dashboard-overview')
  });

  const metrics = data?.data?.metrics || {};
  const recent = data?.data?.recentActivities || {};

  const kpis = [
    {
      title: 'Total Programs',
      value: metrics.totalPrograms || 0,
      sub: `${metrics.activePrograms || 0} active in field`,
      icon: BookOpen,
      color: 'bg-emerald-50 text-brand-900 border-emerald-200',
      link: '/admin/programs'
    },
    {
      title: 'Beneficiaries Impact',
      value: Number(metrics.totalBeneficiaries || 0).toLocaleString(),
      sub: 'Cumulative students & apprentices',
      icon: TrendingUp,
      color: 'bg-gold-50 text-gold-700 border-gold-200',
      link: '/admin/impact'
    },
    {
      title: 'Contact Messages',
      value: metrics.totalMessages || 0,
      sub: `${metrics.unreadMessages || 0} unread messages`,
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      link: '/admin/messages',
      highlight: metrics.unreadMessages > 0
    },
    {
      title: 'Volunteer Applicants',
      value: metrics.totalVolunteers || 0,
      sub: `${metrics.pendingVolunteers || 0} pending review`,
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      link: '/admin/volunteers',
      highlight: metrics.pendingVolunteers > 0
    },
    {
      title: 'Program Applicants',
      value: metrics.totalApplications || 0,
      sub: `${metrics.pendingApplications || 0} pending admission`,
      icon: FileSpreadsheet,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      link: '/admin/applications',
      highlight: metrics.pendingApplications > 0
    },
    {
      title: 'Donation Notices',
      value: metrics.totalDonationPledges || 0,
      sub: 'Bank transfer pledge logs',
      icon: HeartHandshake,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      link: '/admin/donations'
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-brand-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Mariya Nuuman Foundation Management Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Welcome to the Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            Monitor educational support allocations, vocational training applicants, community messages, and live website content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/programs"
            className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Program
          </Link>
          <Link
            to="/admin/news"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
          >
            Post News Update
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={i}
              to={kpi.link}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {kpi.highlight && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  {kpi.title}
                </span>
                <span className="text-3xl font-extrabold font-display text-slate-900 group-hover:text-brand-900 transition mt-1 block">
                  {kpi.value}
                </span>
                <span className="text-xs text-slate-600 mt-0.5 block">
                  {kpi.sub}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Submissions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Contact Messages */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-800" />
              Recent Contact Inquiries
            </h3>
            <Link to="/admin/messages" className="text-xs font-bold text-brand-900 hover:text-gold-600">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recent.messages?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No contact inquiries yet.</p>
            ) : (
              recent.messages?.map((msg) => (
                <Link
                  key={msg.id}
                  to="/admin/messages"
                  className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{msg.full_name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate font-medium">{msg.subject}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Volunteer Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-800" />
              Recent Volunteer Apps
            </h3>
            <Link to="/admin/volunteers" className="text-xs font-bold text-brand-900 hover:text-gold-600">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recent.volunteers?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No volunteer applications yet.</p>
            ) : (
              recent.volunteers?.map((vol) => (
                <Link
                  key={vol.id}
                  to="/admin/volunteers"
                  className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{vol.full_name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      vol.status === 'pending' ? 'bg-gold-100 text-gold-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {vol.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">{vol.area_of_interest}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Program Beneficiary Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-brand-800" />
              Program Applications
            </h3>
            <Link to="/admin/applications" className="text-xs font-bold text-brand-900 hover:text-gold-600">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recent.applications?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No program applications yet.</p>
            ) : (
              recent.applications?.map((app) => (
                <Link
                  key={app.id}
                  to="/admin/applications"
                  className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{app.applicant_name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      app.status === 'pending' ? 'bg-gold-100 text-gold-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">{app.program_title || 'General Support'}</p>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
