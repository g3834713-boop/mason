'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BuyVoucherPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhatsAppConfig();
  }, []);

  const fetchWhatsAppConfig = async () => {
    try {
      const response = await fetch('/api/admin/whatsapp-config');
      if (response.ok) {
        const data = await response.json();
        setWhatsappNumber(data.phoneNumber || '1234567890');
      }
    } catch (error) {
      console.error('Error fetching WhatsApp config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyVoucher = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Check if user is logged in
    try {
      const response = await fetch('/api/user/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }

      const userData = await response.json();
      const user = userData.user;

      // Create WhatsApp message
      const message = `*🎫 Freemason Recruitment Voucher Request*\n\n` +
        `*Customer Details:*\n` +
        `Name: ${user.fullName}\n` +
        `Email: ${user.email}\n` +
        `Phone: ${user.phone}\n\n` +
        `*Voucher Request:*\n` +
        `Amount: ${currency} ${parseFloat(amount).toFixed(2)}\n\n` +
        `Please process this voucher purchase and send me the voucher code. Thank you!`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Mobile-friendly redirect
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = whatsappUrl;
      } else {
        const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (!whatsappWindow) {
          window.location.href = whatsappUrl;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Please login to buy a voucher');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl text-gold mb-4">🔑</div>
            <h1 className="font-heading text-3xl md:text-4xl text-navy mb-4">
              Purchase Recruitment Voucher
            </h1>
            <p className="text-gray-600">
              Buy a voucher to access the Freemason recruitment application form
            </p>
            <div className="h-1 w-24 bg-gold mx-auto mt-4"></div>
          </div>

          {/* Information Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-heading text-lg text-navy mb-3">📋 How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Select the voucher amount you wish to purchase</li>
              <li>Click "Request Voucher" to contact us via WhatsApp</li>
              <li>Complete payment through our secure payment link</li>
              <li>Receive your unique 10-digit voucher code</li>
              <li>Use the voucher code to access the recruitment form</li>
            </ol>
          </div>

          {/* Purchase Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="font-heading text-2xl text-navy mb-6">Select Voucher Amount</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              {amount && parseFloat(amount) > 0 && (
                <div className="bg-gold bg-opacity-10 rounded-lg p-4 border border-gold">
                  <p className="text-center text-navy font-heading text-2xl">
                    Total: {currency} {parseFloat(amount).toFixed(2)}
                  </p>
                </div>
              )}

              <button
                onClick={handleBuyVoucher}
                disabled={!amount || parseFloat(amount) <= 0 || loading}
                className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>💬</span>
                Request Voucher via WhatsApp
              </button>

              <p className="text-xs text-center text-gray-500">
                You will be redirected to WhatsApp to complete your voucher purchase request
              </p>
            </div>
          </div>

          {/* Already have voucher */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have a voucher code?{' '}
              <Link href="/join-now" className="text-gold hover:underline font-semibold">
                Apply Now
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
