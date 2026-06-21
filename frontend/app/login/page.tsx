'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DEMO_SHORTCUTS = [
  {
    label: 'Admin User',
    email: 'admin@marketplace.com',
    password: 'admin123',
    role: 'ADMIN',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    gradient: 'from-violet-600 to-purple-700',
    glow: 'shadow-violet-500/25',
    desc: 'Platform administration',
  },
  {
    label: 'Vendor Profile',
    email: 'rahim@vendor.com',
    password: 'vendor123',
    role: 'VENDOR',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
      </svg>
    ),
    gradient: 'from-emerald-600 to-teal-700',
    glow: 'shadow-emerald-500/25',
    desc: 'Manage services & jobs',
  },
  {
    label: 'End-User Profile',
    email: 'fatema@user.com',
    password: 'user123',
    role: 'END_USER',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    gradient: 'from-sky-600 to-blue-700',
    glow: 'shadow-sky-500/25',
    desc: 'Browse & book services',
  },
];

const ROLE_REDIRECTS: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  VENDOR: '/vendor/dashboard',
  END_USER: '/marketplace',
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const doLogin = async (loginEmail: string, loginPassword?: string, isDemoLogin?: boolean) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword, demoLogin: isDemoLogin }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed.' }));
      throw new Error(err.error);
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    document.cookie = `auth_token=${data.token}; path=/; max-age=86400; samesite=lax`;
    return data;
  };

  const handleDemoLogin = async (shortcut: typeof DEMO_SHORTCUTS[0]) => {
    setLoading(shortcut.role);
    setError('');
    try {
      const data = await doLogin(shortcut.email, undefined, true);
      router.push(ROLE_REDIRECTS[data.user.role]);
    } catch {
      setError('Login failed. Please try again.');
      setLoading(null);
    }
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setFormLoading(true);
    setError('');
    try {
      const data = await doLogin(email, password);
      router.push(ROLE_REDIRECTS[data.user.role] || '/marketplace');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ServiceHub BD</h1>
          <p className="text-slate-400 mt-1.5 text-sm">Multi-Vendor Service Marketplace</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Demo Login Shortcuts */}
          <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
              <h2 className="text-white font-semibold">Demo Login Shortcuts</h2>
            </div>
            <p className="text-slate-500 text-xs mb-5">Click to instantly sign in with a role</p>

            <div className="space-y-3">
              {DEMO_SHORTCUTS.map((s) => (
                <button
                  key={s.role}
                  onClick={() => handleDemoLogin(s)}
                  disabled={loading === s.role}
                  className="w-full group relative overflow-hidden rounded-xl border border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} shadow-lg ${s.glow} flex items-center justify-center text-white flex-shrink-0`}>
                      {loading === s.role ? (
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : s.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium text-sm">{s.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{s.desc}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5 font-mono">{s.email} / {s.password}</p>
                    </div>
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Standard Credentials Form */}
          <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
            <h2 className="text-white font-semibold mb-1">Sign In with Credentials</h2>
            <p className="text-slate-500 text-xs mb-5">Use your email and password</p>

            <form onSubmit={handleCredentialLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.06] border border-white/[0.1] focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="w-full bg-white/[0.06] border border-white/[0.1] focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
                />
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
                disabled={formLoading}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <p className="text-center text-slate-500 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          ServiceHub BD — Multi-Vendor Marketplace Platform
        </p>
      </div>
    </div>
  );
}
