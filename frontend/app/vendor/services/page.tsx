import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl, authHeaders } from '@/lib/api';
import Navbar from '@/components/Navbar';
import VendorServicesClient from './VendorServicesClient';

export default async function VendorServicesPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  const tokenCookie = cookieStore.get('auth_token');
  if (!sessionCookie || !tokenCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

  if (user.role !== 'VENDOR') redirect('/login');

  const res = await fetch(apiUrl(`/api/vendor/services-list?userId=${user.id}`), {
    cache: 'no-store',
    headers: authHeaders(tokenCookie.value),
  });
  if (res.status === 401 || res.status === 403) redirect('/login');
  const vendorProfile = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <VendorServicesClient vendorProfileId={vendorProfile.id} services={vendorProfile.services} />
    </div>
  );
}
