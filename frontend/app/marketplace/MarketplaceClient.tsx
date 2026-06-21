'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORY_ICONS: Record<string, string> = {
  Cleaning: '🧹',
  Plumbing: '🔧',
  'AC Repair': '❄️',
  Electrical: '⚡',
  Painting: '🎨',
  Carpentry: '🪚',
};

const CATEGORY_COLORS: Record<string, string> = {
  Cleaning: 'bg-sky-50 border-sky-200 text-sky-700',
  Plumbing: 'bg-orange-50 border-orange-200 text-orange-700',
  'AC Repair': 'bg-blue-50 border-blue-200 text-blue-700',
  Electrical: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  Painting: 'bg-pink-50 border-pink-200 text-pink-700',
  Carpentry: 'bg-amber-50 border-amber-200 text-amber-700',
};

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendorProfile: {
    user: { name: string };
    phone: string;
  };
}

export default function MarketplaceClient({ services }: { services: Service[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.vendorProfile.user.name.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Find Trusted Home Services</h1>
        <p className="text-sky-100 mb-6">Book professional services from verified vendors near you</p>
        <div className="relative max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services, categories, or vendors..."
            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeCategory === cat
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300 hover:text-sky-600'
            }`}
          >
            {cat !== 'All' && <span className="mr-1.5">{CATEGORY_ICONS[cat] || '📌'}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing <strong>{filtered.length}</strong> service{filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'All' && ` in ${activeCategory}`}
        {search && ` matching "${search}"`}
      </p>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-gray-700">No services found</h3>
          <p className="text-gray-500 text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((service) => {
            const catColor = CATEGORY_COLORS[service.category] || 'bg-gray-50 border-gray-200 text-gray-700';
            return (
              <div key={service.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                <div className="bg-gradient-to-br from-sky-50 to-blue-100 p-6 text-center">
                  <span className="text-4xl">{CATEGORY_ICONS[service.category] || '🏠'}</span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{service.name}</h3>
                    <span className={`badge text-xs border flex-shrink-0 ${catColor}`}>{service.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 flex-1 leading-relaxed">{service.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <span>🏪</span>
                    <span className="truncate">{service.vendorProfile.user.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-lg font-bold text-sky-700">৳{service.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => router.push(`/checkout?serviceId=${service.id}`)}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
