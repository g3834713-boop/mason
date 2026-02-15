import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'GDPR Notice | Freemason International',
  description: 'GDPR compliance and data protection information.',
};

export default function GDPR() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="font-heading text-3xl text-navy mb-6">GDPR Compliance Notice</h1>
          <div className="h-1 w-24 bg-gold mb-8"></div>

          <div className="prose max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">Our Commitment to GDPR</h2>
              <p>
                Freemason International is committed to protecting your personal data in compliance
                with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">Legal Basis for Processing</h2>
              <p>We process your personal data under the following legal bases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consent:</strong> You provide explicit consent when submitting your application</li>
                <li><strong>Legitimate Interests:</strong> Processing necessary for membership evaluation</li>
                <li><strong>Legal Obligation:</strong> Compliance with applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">Your GDPR Rights</h2>
              <p>Under GDPR, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object:</strong> Object to processing of your data</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">Data Retention</h2>
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes
                for which it was collected:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pending applications: Until decision is made</li>
                <li>Approved members: Duration of membership plus 7 years</li>
                <li>Rejected applications: 2 years for potential re-application</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">Data Security</h2>
              <p>We implement appropriate technical and organizational measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Access controls and authentication</li>
                <li>Regular security assessments</li>
                <li>Staff training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">International Data Transfers</h2>
              <p>
                If we transfer your data outside the European Economic Area (EEA),
                we ensure appropriate safeguards are in place through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Adequacy decisions</li>
                <li>Your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">Data Breach Notification</h2>
              <p>
                In the event of a data breach that affects your personal data, we will notify you
                and the relevant supervisory authority within 72 hours, as required by GDPR.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">Exercising Your Rights</h2>
              <p>
                To exercise any of your GDPR rights, please contact our Data Protection Officer:
              </p>
              <div className="bg-gray-100 p-4 rounded mt-4">
                <p className="font-semibold">Data Protection Officer</p>
                <p>Email: dpo@freemason-international.org</p>
                <p>Subject Line: "GDPR Request - [Your Name]"</p>
              </div>
              <p className="mt-4">
                We will respond to your request within 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">Supervisory Authority</h2>
              <p>
                You have the right to lodge a complaint with your local data protection supervisory authority
                if you believe we have not handled your data appropriately.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-navy mb-4">Updates to This Notice</h2>
              <p>
                We may update this GDPR notice from time to time. We will notify you of any material
                changes by posting the new notice on this page and updating the "Last updated" date.
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
