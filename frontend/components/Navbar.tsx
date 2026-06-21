'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  user: { name: string; role: string; email: string };
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  VENDOR: 'Vendor',
  END_USER: 'User',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  VENDOR: 'bg-emerald-100 text-emerald-700',
  END_USER: 'bg-sky-100 text-sky-700',
};

const NAV_LINKS: Record<string, { href: string; label: string }[]> = {
  ADMIN: [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/users', label: 'All Users' },
  ],
  VENDOR: [
    { href: '/vendor/dashboard', label: 'Dashboard' },
    { href: '/vendor/services', label: 'My Services' },
  ],
  END_USER: [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/orders', label: 'My Orders' },
  ],
};

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const links = NAV_LINKS[user.role] || [];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="font-bold text-gray-900 text-lg">ServiceHub BD</span>
            </Link>
            <div className="hidden sm:flex gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800">{user.name}</span>
              <span className={`badge text-xs ${ROLE_COLORS[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
