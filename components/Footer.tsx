import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-gold font-heading text-xl mb-4">Freemason International</h3>
            <p className="text-gray-300 text-sm">
              A global fraternity dedicated to character, leadership, and community service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-heading text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-gold transition">
                  About Freemasonry
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="text-gray-300 hover:text-gold transition">
                  Benefits of Joining
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-gold transition">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-gold transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-gold font-heading text-xl mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-gold transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-gold transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-gray-300 hover:text-gold transition">
                  GDPR Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p className="mb-2">
            Freemason International is an informational and application platform.
            Submission of an application does not guarantee membership.
            All applications are subject to review and approval.
          </p>
          <p>&copy; {currentYear} Freemason International. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
