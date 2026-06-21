'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_USERS = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@marketplace.com',
    role: 'ADMIN',
    avatar: '🛡️',
    desc: 'Manage all users and platform settings',
    color: 'from-purple-500 to-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'vendor-001',
    name: 'Rahim Cleaning Services',
    email: 'rahim@vendor.com',
    role: 'VENDOR',
    avatar: '🧹',
    desc: 'List services and manage incoming jobs',
    color: 'from-emerald-500 to-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'vendor-002',
    name: 'Karim Plumbing Co.',
    email: 'karim@vendor.com',
    role: 'VENDOR',
    avatar: '🔧',
    desc: 'Expert plumbing — view orders and services',
    color: 'from-emerald-500 to-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'user-001',
    name: 'Fatema Begum',
    email: 'fatema@user.com',
    role: 'END_USER',
    avatar: '👩',
    desc: 'Browse services and book appointments',
    color: 'from-sky-500 to-sky-700',
    badge: 'bg-sky-100 text-sky-700',
  },
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  VENDOR: 'Vendor',
  END_USER: 'End-User',
};

const ROLE_REDIRECTS: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  VENDOR: '/vendor/dashboard',
  END_USER: '/marketplace',
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (user: typeof DEMO_USERS[0]) => {
    setLoading(user.id);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      document.cookie = `auth_token=${data.token}; path=/; max-age=86400; samesite=lax`;
      router.push(ROLE_REDIRECTS[user.role]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="text-5xl mb-3">🏠</div>
        <h1 className="text-4xl font-bold text-white tracking-tight">ServiceHub BD</h1>
        <p className="text-sky-300 mt-2 text-sm">Multi-Vendor Service Marketplace</p>
      </div>

      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-white font-semibold text-lg mb-1">Demo Login</h2>
          <p className="text-sky-200 text-sm mb-6">Click any account to log in instantly</p>

          <div className="space-y-3">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                disabled={loading === user.id}
                className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xl p-4 transition-all duration-200 text-left group disabled:opacity-60"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-xl flex-shrink-0`}>
                  {loading === user.id ? (
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{user.name}</span>
                    <span className={`badge ${user.badge} text-xs`}>{ROLE_LABELS[user.role]}</span>
                  </div>
                  <p className="text-sky-300 text-xs mt-0.5">{user.desc}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
                </div>
                <svg className="w-5 h-5 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sky-400/60 text-xs mt-6">
          Assessment Project — ServiceHub BD · RBAC Authentication Demo
        </p>
      </div>
    </div>
  );
}
