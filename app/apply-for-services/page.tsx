'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface ServiceApplication {
  serviceType: 'MEMBERSHIP_CARD' | 'CERTIFICATE' | 'LETTER' | 'ALL';
  details: string;
  urgency: 'STANDARD' | 'EXPEDITED';
}

export default function ApplyForServices() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<ServiceApplication['serviceType']>('MEMBERSHIP_CARD');
  const [urgency, setUrgency] = useState<ServiceApplication['urgency']>('STANDARD');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState<any>(null);

  // Check authentication
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/service-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          serviceType: selectedService,
          details,
          urgency,
        }),
      });

      if (response.ok) {
        setMessage('✅ Application submitted successfully! Our team will process your request shortly.');
        setDetails('');
        setSelectedService('MEMBERSHIP_CARD');
        setUrgency('STANDARD');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const data = await response.json();
        setMessage('❌ ' + (data.error || 'Failed to submit application'));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      id: 'MEMBERSHIP_CARD',
      title: 'Membership Card',
      icon: '🆔',
      description: 'Official Freemason membership identification card',
      price: 'Included',
      details: [
        '✓ Laminated ID card',
        '✓ Your membership number',
        '✓ Valid for 5 years',
        '✓ Recognition in lodges worldwide'
      ]
    },
    {
      id: 'CERTIFICATE',
      title: 'Certificate of Membership',
      icon: '📜',
      description: 'Framed official certificate for display',
      price: '$49.99',
      details: [
        '✓ Beautifully printed certificate',
        '✓ Authenticated by our lodge',
        '✓ Ready to frame',
        '✓ Premium quality paper'
      ]
    },
    {
      id: 'LETTER',
      title: 'Letter of Introduction',
      icon: '📮',
      description: 'Official letter for lodge introductions',
      price: 'Included',
      details: [
        '✓ Formal introduction letter',
        '✓ For travel and lodge visits',
        '✓ Signed by lodge master',
        '✓ Worldwide recognition'
      ]
    },
    {
      id: 'ALL',
      title: 'Complete Package',
      icon: '🎁',
      description: 'Get all services together',
      price: 'Bundle Deal',
      details: [
        '✓ Membership Card',
        '✓ Certificate of Membership',
        '✓ Letter of Introduction',
        '✓ Best Value - Save 20%'
      ]
    }
  ];

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl text-gold mb-4 animate-pulse">⚒</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl text-navy mb-4">
              Membership Services
            </h1>
            <p className="text-gray-600 text-lg">
              Apply for additional membership documents and services
            </p>
            <div className="h-1 w-24 bg-gold mx-auto mt-4"></div>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service.id as ServiceApplication['serviceType'])}
                className={`p-6 rounded-lg border-2 cursor-pointer transition transform hover:scale-105 ${
                  selectedService === service.id
                    ? 'border-gold bg-gold/5 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gold'
                }`}
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-heading text-lg text-navy mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <div className="text-gold font-bold text-sm mb-4">{service.price}</div>
                <div className="space-y-2">
                  {service.details.map((detail, idx) => (
                    <div key={idx} className="text-xs text-gray-700">{detail}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="font-heading text-2xl text-navy mb-6">
                  Application Form
                </h2>

                {message && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    message.includes('✅')
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Type - Read Only */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Selected Service
                    </label>
                    <input
                      type="text"
                      value={services.find(s => s.id === selectedService)?.title || ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Processing Speed
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="STANDARD"
                          checked={urgency === 'STANDARD'}
                          onChange={(e) => setUrgency(e.target.value as ServiceApplication['urgency'])}
                          className="h-4 w-4 text-gold"
                        />
                        <span className="ml-3 text-gray-700">
                          Standard (5-7 business days) - Free
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="EXPEDITED"
                          checked={urgency === 'EXPEDITED'}
                          onChange={(e) => setUrgency(e.target.value as ServiceApplication['urgency'])}
                          className="h-4 w-4 text-gold"
                        />
                        <span className="ml-3 text-gray-700">
                          Expedited (2-3 business days) - $19.99
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Any special requests or preferences (e.g., preferred card design, letter format)..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition disabled:opacity-50 text-lg"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar - User Info & Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h3 className="font-heading text-lg text-navy mb-4">Application Summary</h3>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Applicant</p>
                    <p className="font-semibold text-navy">{userData?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-navy">{userData?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Membership Status</p>
                    <p className={`font-semibold ${userData?.status === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {userData?.status === 'APPROVED' ? '✓ Active' : userData?.status}
                    </p>
                  </div>
                </div>

                {/* Processing Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">📋 Processing:</span> Your application will be reviewed and processed by our team promptly.
                  </p>
                </div>

                {/* Links */}
                <Link
                  href="/dashboard"
                  className="block w-full py-2 text-center border-2 border-navy text-navy font-semibold rounded-lg hover:bg-navy hover:text-white transition"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
