import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  return !!cookieStore.get('token')?.value;
}

export default async function Home() {
  const isAuthenticated = await checkAuth();

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-navy min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Watermark background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[400px] text-gold">
            ⚒
          </div>
        </div>

        {/* Spotlight effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-navy opacity-60"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            Where Brotherhood, Integrity,<br />and Purpose Unite.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Join a global fraternity of men committed to moral growth, charity, leadership, and self-improvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-gold text-navy font-bold text-lg rounded hover:bg-gold-light transition duration-300 shadow-lg w-full sm:w-auto"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/apply-for-services"
                  className="px-8 py-4 border-2 border-gold text-gold font-bold text-lg rounded hover:bg-gold hover:text-navy transition duration-300 w-full sm:w-auto"
                >
                  Apply for Services
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-gold text-navy font-bold text-lg rounded hover:bg-gold-light transition duration-300 shadow-lg w-full sm:w-auto"
                >
                  Apply for Membership
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 border-2 border-gold text-gold font-bold text-lg rounded hover:bg-gold hover:text-navy transition duration-300 w-full sm:w-auto"
                >
                  Learn About Freemasonry
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-1 w-24 bg-gold mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            For centuries, men of integrity have gathered under the principles of <strong className="text-gold">Brotherly Love</strong>, <strong className="text-gold">Relief</strong>, and <strong className="text-gold">Truth</strong>.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            Freemason International is more than an organization — it is a commitment to personal excellence, moral growth, and meaningful connection.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10">
            If you seek wisdom, leadership, and lifelong brotherhood, your journey begins here.
          </p>
          {!isAuthenticated && (
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-gold text-navy font-bold text-lg rounded hover:bg-gold-light transition duration-300 shadow-md"
            >
              Begin Your Application Today
            </Link>
          )}
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl md:text-5xl text-center text-navy mb-16">
            Why Join Freemason International?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-t-4 border-gold">
              <div className="text-5xl text-gold mb-4 text-center">⚡</div>
              <h3 className="font-heading text-2xl text-navy mb-4 text-center">Build Character</h3>
              <p className="text-gray-600 text-center">
                Develop moral discipline and personal accountability through time-tested principles and practices.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-t-4 border-gold">
              <div className="text-5xl text-gold mb-4 text-center">🌐</div>
              <h3 className="font-heading text-2xl text-navy mb-4 text-center">Expand Your Network</h3>
              <p className="text-gray-600 text-center">
                Connect with leaders across nations and professions in a global brotherhood.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-t-4 border-gold">
              <div className="text-5xl text-gold mb-4 text-center">❤️</div>
              <h3 className="font-heading text-2xl text-navy mb-4 text-center">Serve with Purpose</h3>
              <p className="text-gray-600 text-center">
                Engage in charitable initiatives that create meaningful impact in communities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusivity Banner */}
      <section className="py-16 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl text-gold mb-3">🔒</div>
              <h3 className="font-heading text-xl text-gold mb-2">Membership by Application Only</h3>
              <p className="text-gray-300 text-sm">Selective membership process ensures quality and commitment</p>
            </div>
            <div>
              <div className="text-4xl text-gold mb-3">👔</div>
              <h3 className="font-heading text-xl text-gold mb-2">A Brotherhood of Leaders</h3>
              <p className="text-gray-300 text-sm">Join distinguished men from all walks of life</p>
            </div>
            <div>
              <div className="text-4xl text-gold mb-3">🌍</div>
              <h3 className="font-heading text-xl text-gold mb-2">Confidential. Respected. Global.</h3>
              <p className="text-gray-300 text-sm">Your privacy protected, your membership valued worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-navy mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Take the first step toward personal excellence, lifelong brotherhood, and meaningful impact.
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 bg-gold text-navy font-bold text-xl rounded hover:bg-gold-light transition duration-300 shadow-lg"
            >
              Begin Your Application Today
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
