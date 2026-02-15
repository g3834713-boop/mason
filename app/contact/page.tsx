'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for contacting us. We will respond within 48 hours.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-200">
            Have questions? We're here to help.
          </p>
          <div className="h-1 w-24 bg-gold mx-auto mt-6"></div>
        </div>
      </section>

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="font-heading text-2xl text-navy mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                {submitMessage && (
                  <div className={`p-4 rounded-lg ${submitMessage.includes('Thank you') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {submitMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gold text-navy font-bold text-lg rounded-lg hover:bg-gold-light transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
                <h2 className="font-heading text-2xl text-navy mb-6">Get in touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-2xl text-gold mr-4">📧</div>
                    <div>
                      <h3 className="font-semibold text-navy mb-1">Email</h3>
                      <p className="text-gray-600">info@freemason-international.org</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl text-gold mr-4">🌐</div>
                    <div>
                      <h3 className="font-semibold text-navy mb-1">Social Media</h3>
                      <div className="flex space-x-4 mt-2">
                        <a href="#" className="text-gold hover:text-gold-dark transition">Facebook</a>
                        <a href="#" className="text-gold hover:text-gold-dark transition">Twitter</a>
                        <a href="#" className="text-gold hover:text-gold-dark transition">LinkedIn</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl text-gold mr-4">⏰</div>
                    <div>
                      <h3 className="font-semibold text-navy mb-1">Response Time</h3>
                      <p className="text-gray-600">We typically respond within 48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-navy p-8 rounded-lg shadow-lg text-white">
                <h3 className="font-heading text-xl text-gold mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/about#faq" className="flex items-center hover:text-gold transition">
                      <span className="mr-2">→</span>
                      Frequently Asked Questions
                    </a>
                  </li>
                  <li>
                    <a href="/benefits" className="flex items-center hover:text-gold transition">
                      <span className="mr-2">→</span>
                      Membership Benefits
                    </a>
                  </li>
                  <li>
                    <a href="/signup" className="flex items-center hover:text-gold transition">
                      <span className="mr-2">→</span>
                      Application Process
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
