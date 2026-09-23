import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Image,
  Newspaper,
  MessageSquare,
  Users,
  FileSpreadsheet,
  HeartHandshake,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  Sparkles,
  Quote
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { admin, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 border border-slate-200">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-display">Authentication Required</h2>
          <p className="text-sm text-slate-600">
            You must be signed in as an authorized administrator to view the Mariya Nuuman Foundation Management Portal.
          </p>
          <Link
            to="/admin/login"
            className="inline-block w-full py-2.5 px-4 bg-brand-900 hover:bg-brand-800 text-white font-semibold rounded-xl transition"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Program Management', path: '/admin/programs', icon: BookOpen },
    { name: 'Impact & Stories', path: '/admin/impact', icon: TrendingUp },
    { name: 'Gallery Management', path: '/admin/gallery', icon: Image },
    { name: 'News & Updates', path: '/admin/news', icon: Newspaper },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Quote },
    { name: 'Contact Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Volunteer Applications', path: '/admin/volunteers', icon: Users },
    { name: 'Program Applications', path: '/admin/applications', icon: FileSpreadsheet },
    { name: 'Donation Settings', path: '/admin/donations', icon: HeartHandshake },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Topbar */}
      <div className="lg:hidden bg-brand-950 text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="Mariya Nuuman Foundation Logo"
            className="h-8 w-auto rounded-lg object-contain"
          />
          <div>
            <span className="font-bold text-sm block leading-none font-display">Mariya Nuuman Foundation</span>
            <span className="text-[10px] text-gold-400 font-medium">Admin Portal</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-brand-900 text-white focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-brand-950 text-slate-300 flex flex-col border-r border-brand-900 shadow-xl transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-brand-900 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Mariya Nuuman Foundation Logo"
              className="h-10 w-auto rounded-xl object-contain shadow-md"
            />
            <div>
              <h1 className="text-base font-bold text-white font-display leading-tight">Mariya Nuuman Foundation</h1>
              <span className="text-xs text-gold-400 font-semibold tracking-wider uppercase">Admin Portal</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profile Tag */}
        <div className="px-5 py-3.5 bg-brand-900/50 border-b border-brand-900 flex items-center justify-between text-xs">
          <div className="truncate pr-2">
            <p className="text-white font-semibold truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-emerald-300/80 truncate text-[11px]">{admin?.email}</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30">
            {admin?.role || 'Admin'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-brand-900/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-brand-900 space-y-2 bg-brand-950/80">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-brand-900 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              View Public Website
            </span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-rose-300 hover:text-white hover:bg-rose-900/40 transition font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
