import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl, authHeaders } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const ROLE_BADGES: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  VENDOR: 'bg-emerald-100 text-emerald-700',
  END_USER: 'bg-sky-100 text-sky-700',
};

export default async function AdminUsersPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  const tokenCookie = cookieStore.get('auth_token');
  if (!sessionCookie || !tokenCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

  const res = await fetch(apiUrl('/api/admin/users'), {
    cache: 'no-store',
    headers: authHeaders(tokenCookie.value),
  });
  if (res.status === 401 || res.status === 403) redirect('/login');
  const users = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Users <span className="text-gray-400 text-lg">({users.length})</span></h1>
          <Link href="/admin/dashboard" className="btn-secondary text-sm">Dashboard</Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Services</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Orders</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u: { id: string; name: string; email: string; role: string; vendorProfile: { services: unknown[] } | null; transactions: unknown[]; createdAt: string }) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${ROLE_BADGES[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {u.vendorProfile ? u.vendorProfile.services.length : '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{u.transactions.length}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
