import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl, authHeaders } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function OrdersPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  const tokenCookie = cookieStore.get('auth_token');
  if (!sessionCookie || !tokenCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

  if (user.role !== 'END_USER') redirect('/login');

  const res = await fetch(apiUrl(`/api/transactions?userId=${user.id}`), {
    cache: 'no-store',
    headers: authHeaders(tokenCookie.value),
  });
  if (res.status === 401 || res.status === 403) redirect('/login');
  const transactions = await res.json();

  const totalSpent = transactions.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Your booking history</p>
          </div>
          <Link href="/marketplace" className="btn-primary text-sm">+ Book Service</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card text-center">
            <p className="text-3xl font-bold text-sky-600">{transactions.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Orders</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-emerald-600">&#2547;{totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total Spent</p>
          </div>
        </div>

        {/* Orders list */}
        {transactions.length === 0 ? (
          <div className="card text-center py-16">
            <h3 className="font-semibold text-gray-700">No orders yet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Browse the marketplace and book your first service</p>
            <Link href="/marketplace" className="btn-primary">Go to Marketplace</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn: { id: string; service: { name: string; vendorProfile: { user: { name: string } } }; amount: number; status: string; paymentMethod: string; createdAt: string }) => (
              <div key={txn.id} className="card flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  &#127968;
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{txn.service.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{txn.service.vendorProfile.user.name}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900">&#2547;{txn.amount.toLocaleString()}</p>
                      <span className={`badge text-xs mt-1 ${
                        txn.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{txn.paymentMethod}</span>
                    <span>&#183;</span>
                    <span>{new Date(txn.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>&#183;</span>
                    <span className="font-mono truncate max-w-[100px]">{txn.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
