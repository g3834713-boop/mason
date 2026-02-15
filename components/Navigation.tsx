'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/me', {
          credentials: 'include',
        });

        if (!isMounted) return;
        setIsAuthenticated(response.ok);
      } catch (error) {
        if (!isMounted) return;
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/benefits', label: 'Benefits' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/join-now', label: 'Join Now' },
    { href: '/contact', label: 'Contact' },
  ];

  const authenticatedLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/documents', label: 'Documents' },
    { href: '/accessories', label: 'Accessories' },
    { href: '/apply-for-services', label: 'Services' },
    { href: '/join-now', label: 'Join Now' },
  ];

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-heading text-gold">⚒</div>
            <span className="text-xl font-heading text-gold">FREEMASON INTERNATIONAL</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gold transition duration-300 ${
                  pathname === link.href ? 'text-gold border-b-2 border-gold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Authenticated Links */}
            {isAuthenticated && authenticatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gold transition duration-300 ${
                  pathname === link.href ? 'text-gold border-b-2 border-gold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 border-2 border-gold text-gold hover:bg-gold hover:text-navy transition duration-300 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border-2 border-gold text-gold hover:bg-gold hover:text-navy transition duration-300 rounded"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-gold text-navy hover:bg-gold-light transition duration-300 rounded font-semibold"
                >
                  Apply Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gold hover:bg-navy-light focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-light">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md hover:bg-gold hover:text-navy transition ${
                  pathname === link.href ? 'bg-gold text-navy' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Authenticated Links Mobile */}
            {isAuthenticated && authenticatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md hover:bg-gold hover:text-navy transition ${
                  pathname === link.href ? 'bg-gold text-navy' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left block px-3 py-2 rounded-md hover:bg-gold hover:text-navy transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md hover:bg-gold hover:text-navy transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 bg-gold text-navy rounded-md font-semibold text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Apply Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
