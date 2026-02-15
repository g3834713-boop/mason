import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | Freemason International',
  description: 'Our privacy policy and data protection practices.',
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="font-heading text-3xl text-navy mb-6">Privacy Policy</h1>
          <div className="h-1 w-24 bg-gold mb-8"></div>

          <div className="prose max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">1. Information We Collect</h2>
              <p>
                When you apply for membership, we collect personal information including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Gender</li>
                <li>Country and city of residence</li>
                <li>Occupation</li>
                <li>Password (encrypted)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">2. How We Use Your Information</h2>
              <p>Your information is used solely for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Membership application evaluation</li>
                <li>Account creation and management</li>
                <li>Communication regarding your application status</li>
                <li>Security and fraud prevention</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">3. Data Protection</h2>
              <p>
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Passwords are encrypted using bcrypt hashing</li>
                <li>Data transmitted over secure HTTPS connections</li>
                <li>Access controls and role-based permissions</li>
                <li>Regular security audits</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">4. Data Sharing</h2>
              <p>
                We do not sell, rent, or share your personal information with third parties.
                Your information remains confidential within our organization.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">6. Cookies</h2>
              <p>
                We use essential cookies for authentication and session management.
                No tracking or advertising cookies are used.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">7. Contact Us</h2>
              <p>
                For privacy concerns or data requests, contact us at:
                <br />
                Email: privacy@freemason-international.org
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8 pt-6 border-t">
              Last updated: February 15, 2026
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
