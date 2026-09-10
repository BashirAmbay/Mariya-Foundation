import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Lock, Mail, Loader2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('admin@mariyafoundation.org');
  const [password, setPassword] = useState('AdminPassword123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate('/admin/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      addToast('Welcome back to Mariya Foundation Admin Portal!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-white">
      {/* Subtle Islamic pattern */}
      <div className="absolute inset-0 bg-emerald-pattern opacity-20 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-700 flex items-center justify-center text-gold-400 shadow-xl border border-brand-600/40 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-gold-400" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Mariya Foundation
            </h1>
            <p className="text-xs text-gold-400 uppercase tracking-wider font-semibold mt-1">
              Administrator Management Portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-slate-900 border border-slate-100 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-slate-900">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-500">
              Enter your authorized administrator credentials to manage programs, applications, and impact data.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mariyafoundation.org"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-800"
                />
              </div>
            </div>

            {/* Default credentials note for quick test */}
            <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-[11px] text-brand-900 space-y-0.5">
              <span className="font-bold block">Preloaded Administrator Access:</span>
              <p>Email: <code className="font-mono font-bold">admin@mariyafoundation.org</code></p>
              <p>Password: <code className="font-mono font-bold">AdminPassword123!</code></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Session...
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-brand-900 transition">
              ← Return to Mariya Foundation Homepage
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
