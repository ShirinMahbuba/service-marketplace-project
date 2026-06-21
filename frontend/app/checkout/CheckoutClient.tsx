'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendorProfile: {
    phone: string;
    user: { name: string };
  };
}

type Step = 'review' | 'payment' | 'processing' | 'success';
type PayMethod = 'bKash' | 'Nagad' | 'Card';

export default function CheckoutClient({ service, userId }: { service: Service; userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('review');
  const [payMethod, setPayMethod] = useState<PayMethod>('bKash');
  const [transactionId, setTransactionId] = useState('');

  const PAY_METHODS: { id: PayMethod; label: string; icon: string; color: string }[] = [
    { id: 'bKash', label: 'bKash', icon: '📱', color: 'border-pink-300 bg-pink-50 text-pink-700' },
    { id: 'Nagad', label: 'Nagad', icon: '🟠', color: 'border-orange-300 bg-orange-50 text-orange-700' },
    { id: 'Card', label: 'Credit/Debit Card', icon: '💳', color: 'border-sky-300 bg-sky-50 text-sky-700' },
  ];

  const handlePayment = async () => {
    setStep('processing');
    // Simulate 2-second processing
    await new Promise((res) => setTimeout(res, 2000));

    const token = localStorage.getItem('token') || '';
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userId, serviceId: service.id, amount: service.price, paymentMethod: payMethod }),
    });

    if (res.ok) {
      const data = await res.json();
      setTransactionId(data.transaction.id);
      setStep('success');
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="card">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
          <p className="text-gray-500 text-sm mb-4">
            Your booking for <strong>{service.name}</strong> has been placed successfully.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-800">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vendor</span>
              <span className="font-medium text-gray-800">{service.vendorProfile.user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-green-700">৳{service.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium text-gray-800">{payMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Txn ID</span>
              <span className="font-mono text-xs text-gray-600 break-all">{transactionId}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/orders')} className="btn-primary flex-1">View My Orders</button>
            <button onClick={() => router.push('/marketplace')} className="btn-secondary flex-1">Browse More</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <div className="card">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="animate-spin w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Processing Payment...</h3>
          <p className="text-gray-500 text-sm">Connecting to {payMethod} sandbox gateway</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Marketplace
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="space-y-4">
        {/* Service Summary */}
        <div className="card">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-4">Order Summary</h2>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center text-2xl">🏠</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
              <p className="text-xs text-gray-400 mt-1">🏪 {service.vendorProfile.user.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-sky-700">৳{service.price.toLocaleString()}</p>
              <span className="text-xs text-gray-400">incl. tax</span>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-xl font-bold text-gray-900">৳{service.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-4">Payment Method</h2>
          <div className="space-y-2">
            {PAY_METHODS.map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  payMethod === method.id ? method.color + ' border-2' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={payMethod === method.id}
                  onChange={() => setPayMethod(method.id)}
                  className="sr-only"
                />
                <span className="text-xl">{method.icon}</span>
                <span className="font-medium text-sm">{method.label}</span>
                {payMethod === method.id && (
                  <svg className="w-5 h-5 ml-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            ))}
          </div>
          <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <p className="text-xs text-amber-700">🧪 <strong>Sandbox Mode:</strong> This is a simulated payment — no real money will be charged.</p>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full btn-primary py-4 text-base"
        >
          Pay ৳{service.price.toLocaleString()} via {payMethod} →
        </button>
      </div>
    </div>
  );
}

const PAY_METHODS: { id: string; label: string; icon: string; color: string }[] = [
  { id: 'bKash', label: 'bKash', icon: '📱', color: 'border-pink-300 bg-pink-50 text-pink-700' },
  { id: 'Nagad', label: 'Nagad', icon: '🟠', color: 'border-orange-300 bg-orange-50 text-orange-700' },
  { id: 'Card', label: 'Credit/Debit Card', icon: '💳', color: 'border-sky-300 bg-sky-50 text-sky-700' },
];
