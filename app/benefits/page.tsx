import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Benefits of Joining | Freemason International',
  description: 'Discover the personal, professional, and spiritual benefits of Freemason membership.',
};

export default function Benefits() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            The Benefits of Becoming a Freemason
          </h1>
          <div className="h-1 w-24 bg-gold mx-auto"></div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Personal Development */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="text-5xl text-gold mb-4">📚</div>
              <h2 className="font-heading text-2xl text-navy mb-4">Personal Development</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Moral discipline and ethical framework</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Leadership growth and decision-making skills</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Public speaking and communication abilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Confidence building through ceremonial participation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Critical thinking and philosophical reflection</span>
                </li>
              </ul>
            </div>

            {/* Brotherhood & Network */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="text-5xl text-gold mb-4">🤝</div>
              <h2 className="font-heading text-2xl text-navy mb-4">Brotherhood & Network</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Lifelong friendships with men of character</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Global connections across 150+ countries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Mentorship opportunities from experienced brothers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Professional networking with diverse leaders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Access to exclusive social events and gatherings</span>
                </li>
              </ul>
            </div>

            {/* Charity & Impact */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="text-5xl text-gold mb-4">❤️</div>
              <h2 className="font-heading text-2xl text-navy mb-4">Charity & Impact</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Community service and volunteer opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Participation in global philanthropic initiatives</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Support for educational and medical charities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Making meaningful contributions to society</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Legacy of positive impact for future generations</span>
                </li>
              </ul>
            </div>

            {/* Exclusive Learning */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="text-5xl text-gold mb-4">🎓</div>
              <h2 className="font-heading text-2xl text-navy mb-4">Exclusive Learning</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Symbolic traditions and allegorical teachings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Ethical teachings rooted in ancient wisdom</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Intellectual growth through study and reflection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Access to Masonic libraries and resources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Ceremonial degrees of progressive learning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-navy mb-8 text-center">What Sets Us Apart</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading text-xl text-gold mb-2">Historical Legacy</h3>
              <p className="text-gray-700">
                Join an organization with centuries of history, tradition, and proven impact on society. Our legacy is your inheritance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading text-xl text-gold mb-2">Structured Growth</h3>
              <p className="text-gray-700">
                Progress through ceremonial degrees that challenge you intellectually, morally, and spiritually. Each step builds upon the last.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading text-xl text-gold mb-2">Universal Recognition</h3>
              <p className="text-gray-700">
                Your membership is recognized worldwide. Travel anywhere and find brothers who share your values and welcome you.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading text-xl text-gold mb-2">Family Friendly</h3>
              <p className="text-gray-700">
                While membership is personal, the values you learn strengthen family bonds and community relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl mb-6">
            Take the First Step Toward Brotherhood
          </h2>
          <p className="text-xl mb-8">
            Begin your journey of personal growth, global connection, and meaningful service.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-gold text-navy font-bold text-xl rounded hover:bg-gold-light transition duration-300 shadow-lg"
          >
            Apply Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
