import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Testimonials | Freemason International',
  description: 'Read testimonials from Freemason members around the world about their transformative experiences.',
};

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Freemasonry strengthened my character and expanded my worldview. The brothers I've met have become lifelong friends and mentors.",
      author: "James Richardson",
      location: "London, UK",
      profession: "Business Executive",
    },
    {
      quote: "The brotherhood I found here changed my life. I've grown as a leader, a father, and a member of my community.",
      author: "Michael Chen",
      location: "Singapore",
      profession: "Entrepreneur",
    },
    {
      quote: "Through service and discipline, I discovered my true potential. Freemasonry gave me purpose beyond my career.",
      author: "David Okonkwo",
      location: "Lagos, Nigeria",
      profession: "Medical Doctor",
    },
    {
      quote: "The moral teachings and philosophical discussions opened my mind to new perspectives. I'm a better person because of this brotherhood.",
      author: "Carlos Mendoza",
      location: "Buenos Aires, Argentina",
      profession: "University Professor",
    },
    {
      quote: "Being part of a global network of men dedicated to charity and personal growth has been incredibly fulfilling.",
      author: "Ahmed Al-Rashid",
      location: "Dubai, UAE",
      profession: "Architect",
    },
    {
      quote: "Freemasonry taught me that true leadership begins with serving others. The values I learned here guide everything I do.",
      author: "Robert Thompson",
      location: "New York, USA",
      profession: "Attorney",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Member Testimonials
          </h1>
          <p className="text-xl text-gray-200">
            Hear from brothers around the world about their transformative experiences
          </p>
          <div className="h-1 w-24 bg-gold mx-auto mt-6"></div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-gold"
              >
                <div className="text-4xl text-gold mb-4">"</div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-heading text-navy font-semibold">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.profession}</p>
                  <p className="text-sm text-gold">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-navy mb-12 text-center">
            Our Global Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-heading text-gold mb-2">150+</div>
              <p className="text-gray-600">Countries Represented</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-heading text-gold mb-2">300+</div>
              <p className="text-gray-600">Years of History</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-heading text-gold mb-2">$2B+</div>
              <p className="text-gray-600">Annual Charitable Giving</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-heading text-gold mb-2">6M+</div>
              <p className="text-gray-600">Members Worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl text-navy mb-6">
            What Our Members Say About Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6">
              <div className="text-3xl text-gold mb-3">💎</div>
              <h3 className="font-heading text-xl text-navy mb-2">Integrity</h3>
              <p className="text-gray-600 text-sm">
                "The emphasis on honesty and moral character is unwavering."
              </p>
            </div>
            <div className="p-6">
              <div className="text-3xl text-gold mb-3">🌟</div>
              <h3 className="font-heading text-xl text-navy mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">
                "Every interaction pushes you to become the best version of yourself."
              </p>
            </div>
            <div className="p-6">
              <div className="text-3xl text-gold mb-3">🤲</div>
              <h3 className="font-heading text-xl text-navy mb-2">Service</h3>
              <p className="text-gray-600 text-sm">
                "The commitment to helping others is genuine and life-changing."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl mb-6">
            Ready to Write Your Own Story?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of men who have transformed their lives through Freemasonry.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-gold text-navy font-bold text-xl rounded hover:bg-gold-light transition duration-300 shadow-lg"
          >
            Begin Your Application
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
