import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl, authHeaders } from '@/lib/api';
import CheckoutClient from './CheckoutClient';
import Navbar from '@/components/Navbar';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { serviceId?: string };
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  const tokenCookie = cookieStore.get('auth_token');
  if (!sessionCookie || !tokenCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

  if (user.role !== 'END_USER') redirect('/login');

  if (!searchParams.serviceId) redirect('/marketplace');

  const res = await fetch(apiUrl(`/api/services/${searchParams.serviceId}`), {
    cache: 'no-store',
    headers: authHeaders(tokenCookie.value),
  });
  if (!res.ok) redirect('/marketplace');
  const service = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <CheckoutClient service={service} userId={user.id} />
    </div>
  );
}
