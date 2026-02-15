import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | Freemason International',
  description: 'Terms and conditions for Freemason International membership.',
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="font-heading text-3xl text-navy mb-6">Terms of Service</h1>
          <div className="h-1 w-24 bg-gold mb-8"></div>

          <div className="prose max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">1. Acceptance of Terms</h2>
              <p>
                By submitting a membership application to Freemason International, you agree to be bound by these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">2. Membership Application</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submission of an application does not guarantee membership</li>
                <li>All applications are subject to review and approval</li>
                <li>We reserve the right to reject any application without explanation</li>
                <li>False information in your application may result in immediate rejection</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">3. Account Responsibilities</h2>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the confidentiality of your password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Providing accurate and truthful information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">4. Code of Conduct</h2>
              <p>Members and applicants must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Conduct themselves with integrity and respect</li>
                <li>Refrain from illegal activities</li>
                <li>Respect the confidentiality of other members</li>
                <li>Uphold the principles of Brotherly Love, Relief, and Truth</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">5. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and images,
                is the property of Freemason International and protected by copyright laws.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">6. Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to our service immediately,
                without prior notice, for conduct that we believe violates these Terms or is harmful to other users.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">7. Limitation of Liability</h2>
              <p>
                Freemason International shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the service
                after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable international laws,
                without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">10. Contact Information</h2>
              <p>
                For questions about these Terms, contact us at:
                <br />
                Email: legal@freemason-international.org
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
