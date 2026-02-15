import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'About Freemasonry | Freemason International',
  description: 'Learn about the history, principles, and global impact of Freemasonry. Discover what it means to be a Freemason.',
};

export default function About() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            About Freemasonry
          </h1>
          <div className="h-1 w-24 bg-gold mx-auto"></div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-navy mb-6">Our History</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Freemasonry traces its roots back centuries as one of the world's oldest fraternal organizations. It unites men of good character dedicated to ethical living, charity, and mutual support.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Throughout history, Freemasons have been at the forefront of social progress, championing education, religious tolerance, and humanitarian causes. Our members include distinguished leaders, thinkers, and philanthropists who have shaped the modern world.
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-navy mb-12 text-center">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brotherly Love */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl text-gold mb-4 text-center">🤝</div>
              <h3 className="font-heading text-2xl text-navy mb-4 text-center">Brotherly Love</h3>
              <p className="text-gray-600 text-center">
                Respect and care for all humanity. We foster bonds of friendship and mutual respect that transcend cultural and social boundaries.
              </p>
            </div>

            {/* Relief */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl text-gold mb-4 text-center">❤️</div>
              <h3 className="font-heading text-2xl text-navy mb-4 text-center">Relief</h3>
              <p className="text-gray-600 text-center">
                Charitable action and compassion. We are committed to helping those in need and supporting our communities through service.
              </p>
            </div>

            {/* Truth */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl text-gold mb-4 text-center">⚖️</div>
              <h3 className="font-heading text-2xl text-navy mb-4 text-center">Truth</h3>
              <p className="text-gray-600 text-center">
                Moral integrity and intellectual growth. We pursue knowledge, practice honesty, and uphold the highest ethical standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Brotherhood */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-navy mb-6">A Global Brotherhood</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Members span continents, cultures, and professions — united by shared values and mutual respect. From business leaders to educators, from artists to scientists, Freemasons come from all walks of life.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            What binds us together is not profession or status, but a commitment to personal growth, ethical living, and service to humanity. Wherever you travel in the world, you will find brothers who share your values and welcome you into their lodge.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-navy mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading text-xl text-navy mb-3">Is Freemasonry a religion?</h3>
              <p className="text-gray-700">
                No. Freemasonry is a fraternity that encourages moral and spiritual reflection but does not replace personal faith. Men of all faiths are welcome, and we respect each member's individual religious beliefs.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading text-xl text-navy mb-3">Is membership guaranteed?</h3>
              <p className="text-gray-700">
                No. All applications undergo careful review. We seek men of good character who are committed to our principles and willing to contribute to the brotherhood.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading text-xl text-navy mb-3">Is it confidential?</h3>
              <p className="text-gray-700">
                Yes. Member information is protected and private. We maintain strict confidentiality regarding our membership roster and application details.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading text-xl text-navy mb-3">What are the requirements for joining?</h3>
              <p className="text-gray-700">
                Candidates must be of legal age, of good character, and believe in a Supreme Being. You must be willing to commit time to personal development, brotherhood activities, and charitable service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl mb-6">Ready to Learn More?</h2>
          <p className="text-xl mb-8">
            Discover the benefits of Freemason membership and begin your application today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/benefits"
              className="px-8 py-3 border-2 border-gold text-gold font-bold rounded hover:bg-gold hover:text-navy transition duration-300"
            >
              Explore Benefits
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 bg-gold text-navy font-bold rounded hover:bg-gold-light transition duration-300"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
