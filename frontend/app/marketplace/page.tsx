import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl, authHeaders } from '@/lib/api';
import MarketplaceClient from './MarketplaceClient';
import Navbar from '@/components/Navbar';

export default async function MarketplacePage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  const tokenCookie = cookieStore.get('auth_token');
  if (!sessionCookie || !tokenCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

  if (user.role !== 'END_USER' && user.role !== 'ADMIN') redirect('/login');

  const res = await fetch(apiUrl('/api/services'), {
    cache: 'no-store',
    headers: authHeaders(tokenCookie.value),
  });
  if (res.status === 401 || res.status === 403) redirect('/login');
  const services = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <MarketplaceClient services={services} />
    </div>
  );
}
