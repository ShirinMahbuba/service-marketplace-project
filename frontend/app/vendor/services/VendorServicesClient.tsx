'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
}

const CATEGORIES = ['Cleaning', 'Plumbing', 'AC Repair', 'Electrical', 'Painting', 'Carpentry'];

export default function VendorServicesClient({
  vendorProfileId,
  services: initialServices,
}: {
  vendorProfileId: string;
  services: Service[];
}) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Cleaning' });

  const handleAdd = async () => {
    if (!form.name || !form.description || !form.price) return;
    setSaving(true);
    const token = localStorage.getItem('token') || '';
    const res = await fetch('/api/vendor/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: Number(form.price), vendorProfileId }),
    });
    if (res.ok) {
      const data = await res.json();
      setServices([data.service, ...services]);
      setForm({ name: '', description: '', price: '', category: 'Cleaning' });
      setShowForm(false);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {/* Add Service Form */}
      {showForm && (
        <div className="card mb-6 border-sky-200 bg-sky-50">
          <h2 className="font-semibold text-gray-800 mb-4">New Service</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Service name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
              rows={2}
            />
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Price (৳)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={handleAdd} disabled={saving} className="btn-primary w-full">
              {saving ? 'Saving...' : 'Add Service'}
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">🛍️</p>
          <h3 className="font-semibold text-gray-700">No services yet</h3>
          <p className="text-sm text-gray-500 mt-1">Add your first service to start receiving orders</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="card flex items-start gap-4">
              <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏠</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sky-700">৳{service.price.toLocaleString()}</p>
                    <span className="badge bg-sky-100 text-sky-700 text-xs mt-1">{service.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
