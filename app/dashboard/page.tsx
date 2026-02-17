'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  city: string;
  occupation: string;
  role: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        
        // Redirect admins to admin dashboard
        if (data.user?.role === 'ADMIN') {
          router.push('/unruly-business');
          // Keep loading state active during redirect
          return;
        }
        
        setUser(data.user);
        setLoading(false);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl text-gold mb-4 animate-pulse">⚒</div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    APPROVED: 'bg-green-100 text-green-800 border-green-300',
    REJECTED: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-heading text-gold">⚒</div>
              <span className="text-xl font-heading text-gold">FREEMASON INTERNATIONAL</span>
            </Link>
            <div className="flex items-center space-x-6">
              <span className="text-gray-300">Welcome, {user.fullName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border-2 border-gold text-gold hover:bg-gold hover:text-navy transition duration-300 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-navy text-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="font-heading text-3xl md:text-4xl mb-2">
              Welcome, {user.fullName}
            </h1>
            <p className="text-gray-300">Member Dashboard</p>
          </div>

          {/* Membership Status Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="font-heading text-2xl text-navy mb-6">Membership Status</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Application Status:</p>
                <span className={`inline-block px-6 py-2 rounded-full font-bold border-2 ${statusColors[user.status]}`}>
                  {user.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-gray-600 mb-2">Application Date:</p>
                <p className="font-semibold text-navy">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {user.status === 'PENDING' && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-yellow-800">
                  <strong>Your application is under review.</strong> Our team will contact you once a decision has been made. This process typically takes 24-72 hours.
                </p>
              </div>
            )}

            {user.status === 'APPROVED' && (
              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="text-green-800">
                  <strong>Congratulations!</strong> Your membership has been approved. Welcome to the Brotherhood. Check your email for next steps.
                </p>
              </div>
            )}

            {user.status === 'REJECTED' && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                <p className="text-red-800">
                  We appreciate your interest, but your application was not approved at this time. You may reapply after 6 months.
                </p>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="font-heading text-2xl text-navy mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                <p className="text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                <p className="text-gray-900">{user.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
                <p className="text-gray-900">{user.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Country</label>
                <p className="text-gray-900">{user.country}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">City</label>
                <p className="text-gray-900">{user.city}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Occupation</label>
                <p className="text-gray-900">{user.occupation}</p>
              </div>
            </div>

            {/* Update Profile Button (disabled for now) */}
            <div className="mt-8 flex justify-end">
              <button
                disabled
                className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
              >
                Update Profile (Coming Soon)
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.status === 'APPROVED' && (
              <Link
                href="/apply-for-services"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border-t-4 border-gold"
              >
                <div className="text-4xl text-gold mb-3">📋</div>
                <h3 className="font-heading text-lg text-navy mb-2">Services</h3>
                <p className="text-sm text-gray-600">Apply for cards & certificates</p>
              </Link>
            )}

            <Link
              href="/documents"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border-t-4 border-gold"
            >
              <div className="text-4xl text-gold mb-3">📄</div>
              <h3 className="font-heading text-lg text-navy mb-2">Documents</h3>
              <p className="text-sm text-gray-600">Download your documents</p>
            </Link>

            <Link
              href="/accessories"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border-t-4 border-gold"
            >
              <div className="text-4xl text-gold mb-3">🛍️</div>
              <h3 className="font-heading text-lg text-navy mb-2">Accessories</h3>
              <p className="text-sm text-gray-600">Shop membership items</p>
            </Link>

            <Link
              href="/about"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border-t-4 border-gold"
            >
              <div className="text-4xl text-gold mb-3">📚</div>
              <h3 className="font-heading text-lg text-navy mb-2">Learn More</h3>
              <p className="text-sm text-gray-600">Explore our principles</p>
            </Link>

            <Link
              href="/join-now"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border-t-4 border-gold"
            >
              <div className="text-4xl text-gold mb-3">⚒</div>
              <h3 className="font-heading text-lg text-navy mb-2">Join Now</h3>
              <p className="text-sm text-gray-600">Apply for recruitment</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
