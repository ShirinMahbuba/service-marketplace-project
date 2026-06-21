import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl, authHeaders } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function VendorDashboard() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  const tokenCookie = cookieStore.get('auth_token');
  if (!sessionCookie || !tokenCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

  if (user.role !== 'VENDOR') redirect('/login');

  const res = await fetch(apiUrl(`/api/vendor/profile?userId=${user.id}`), {
    cache: 'no-store',
    headers: authHeaders(tokenCookie.value),
  });
  if (res.status === 401 || res.status === 403) redirect('/login');
  const vendorProfile = await res.json();

  const allTransactions = vendorProfile.services.flatMap((s: { transactions: { amount: number; id: string; user: { name: string }; createdAt: string; status: string }[] }) => s.transactions);
  const totalEarnings = allTransactions.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);
  const totalOrders = allTransactions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user.name}</p>
          </div>
          <Link href="/vendor/services" className="btn-primary text-sm">+ Add Service</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-3xl font-bold text-sky-600">{vendorProfile.services.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active Services</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-orange-500">{totalOrders}</p>
            <p className="text-sm text-gray-500 mt-1">Total Orders</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-emerald-600">&#2547;{totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total Earnings</p>
          </div>
        </div>

        {/* My Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">My Services</h2>
          {vendorProfile.services.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-gray-500">No services yet. <Link href="/vendor/services" className="text-sky-600 font-medium">Add your first service</Link></p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendorProfile.services.map((service: { id: string; name: string; description: string; price: number; category: string; transactions: unknown[] }) => (
                <div key={service.id} className="card">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
                    <span className="badge bg-sky-100 text-sky-700 text-xs">{service.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-700">&#2547;{service.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">{service.transactions.length} order{service.transactions.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job History */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Job History</h2>
          {allTransactions.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-gray-500 text-sm">No jobs yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allTransactions.slice(0, 10).map((txn: { id: string; user: { name: string }; amount: number; status: string; createdAt: string }) => (
                <div key={txn.id} className="card flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{txn.user.name}</p>
                    <p className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">&#2547;{txn.amount.toLocaleString()}</p>
                    <span className={`badge text-xs ${
                      txn.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{txn.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
