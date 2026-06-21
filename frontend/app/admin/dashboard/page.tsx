import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl, authHeaders } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function AdminDashboard() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  const tokenCookie = cookieStore.get('auth_token');
  if (!sessionCookie || !tokenCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

  const res = await fetch(apiUrl('/api/admin/stats'), {
    cache: 'no-store',
    headers: authHeaders(tokenCookie.value),
  });
  if (res.status === 401 || res.status === 403) redirect('/login');
  const { userCount, vendorCount, serviceCount, transactions } = await res.json();

  const totalRevenue = transactions.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Platform overview</p>
          </div>
          <Link href="/admin/users" className="btn-secondary text-sm">View All Users</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'End Users', value: userCount, color: 'text-sky-600' },
            { label: 'Vendors', value: vendorCount, color: 'text-emerald-600' },
            { label: 'Services', value: serviceCount, color: 'text-orange-500' },
            { label: 'Revenue', value: `${totalRevenue.toLocaleString()}`, color: 'text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <div className="card text-center py-10 text-gray-500">No transactions yet.</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vendor</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((txn: { id: string; user: { name: string }; service: { name: string; vendorProfile: { user: { name: string } } }; amount: number; createdAt: string }) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{txn.user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{txn.service.name}</td>
                    <td className="px-4 py-3 text-gray-600">{txn.service.vendorProfile.user.name}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">&#2547;{txn.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">
                      {new Date(txn.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
