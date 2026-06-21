'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ROLES = [
  { value: 'END_USER', label: 'End-User', desc: 'Browse and book services' },
  { value: 'VENDOR', label: 'Vendor', desc: 'List and sell your services' },
];

const ROLE_REDIRECTS: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  VENDOR: '/vendor/dashboard',
  END_USER: '/marketplace',
};

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('END_USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Signup failed. Please try again.');
      setLoading(false);
      return;
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    document.cookie = `auth_token=${data.token}; path=/; max-age=86400; samesite=lax`;
    router.push(ROLE_REDIRECTS[data.user.role] || '/marketplace');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-slate-400 mt-1 text-sm">Join ServiceHub BD marketplace</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Enter your full name"
                className="w-full bg-white/[0.06] border border-white/[0.1] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="w-full bg-white/[0.06] border border-white/[0.1] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Min. 6 characters"
                className="w-full bg-white/[0.06] border border-white/[0.1] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      role === r.value
                        ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/25'
                        : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <p className={`text-sm font-medium ${role === r.value ? 'text-emerald-400' : 'text-slate-300'}`}>{r.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2.5">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <p className="text-center text-slate-500 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          ServiceHub BD — Multi-Vendor Marketplace Platform
        </p>
      </div>
    </div>
  );
}
