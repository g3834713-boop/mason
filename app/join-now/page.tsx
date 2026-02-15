'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JoinNowPage() {
  const router = useRouter();
  const [step, setStep] = useState<'voucher' | 'form'>('voucher');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherData, setVoucherData] = useState<any>(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    
    // Contact Information
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    
    // Professional Information
    occupation: '',
    employer: '',
    yearsInProfession: '',
    
    // Masonic Information
    reason: '',
    knowledgeOfFreemasonry: '',
    recommendedBy: '',
    previouslyApplied: false,
    relativesInFreemasonry: false,
    relativeDetails: '',
    
    // Character References
    reference1Name: '',
    reference1Relationship: '',
    reference1Phone: '',
    reference1Email: '',
    reference2Name: '',
    reference2Relationship: '',
    reference2Phone: '',
    reference2Email: '',
    reference3Name: '',
    reference3Relationship: '',
    reference3Phone: '',
    reference3Email: '',
    
    // Background
    criminalRecord: false,
    criminalDetails: '',
    moralCharacter: '',
    beliefInSupremeBeing: false,
  });

  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidating(true);

    try {
      const response = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setVoucherData(data);
        setStep('form');
      } else {
        setError(data.error || 'Invalid voucher code');
      }
    } catch (error) {
      setError('Error validating voucher. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : target.value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Prepare data with references as array
      const {
        reference1Name,
        reference1Relationship,
        reference1Phone,
        reference1Email,
        reference2Name,
        reference2Relationship,
        reference2Phone,
        reference2Email,
        reference3Name,
        reference3Relationship,
        reference3Phone,
        reference3Email,
        yearsInProfession,
        ...restFormData
      } = formData;

      const cleanData = {
        ...restFormData,
        voucherCode,
        references: [
          {
            name: reference1Name,
            relationship: reference1Relationship,
            phone: reference1Phone,
            email: reference1Email,
          },
          {
            name: reference2Name,
            relationship: reference2Relationship,
            phone: reference2Phone,
            email: reference2Email,
          },
          {
            name: reference3Name,
            relationship: reference3Relationship,
            phone: reference3Phone,
            email: reference3Email,
          },
        ],
        yearsInProfession: parseInt(yearsInProfession) || 0,
      };

      const response = await fetch('/api/recruitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to submit application');
      }
    } catch (error) {
      setError('Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-6xl text-green-600 mb-4">✓</div>
              <h1 className="font-heading text-3xl text-navy mb-4">
                Application Submitted Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in joining Freemasonry. Your application has been received and will be reviewed by our team.
              </p>
              <p className="text-gray-600 mb-8">
                You will be notified via email once your application has been reviewed.
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl text-gold mb-4">⚒</div>
            <h1 className="font-heading text-3xl md:text-4xl text-navy mb-4">
              Join the Freemasons
            </h1>
            <p className="text-gray-600">
              Begin your journey toward brotherhood, character, and purpose
            </p>
            <div className="h-1 w-24 bg-gold mx-auto mt-4"></div>
          </div>

          {step === 'voucher' ? (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="font-heading text-2xl text-navy mb-6 text-center">
                Enter Your Voucher Code
              </h2>

              <form onSubmit={handleVoucherSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Voucher Code *
                  </label>
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Enter 10-digit voucher code"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-mono text-lg text-center uppercase"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Enter the voucher code you received after purchase
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={validating || voucherCode.length !== 10}
                  className="w-full py-3 bg-gold text-navy font-bold text-lg rounded-lg hover:bg-gold-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validating ? 'Validating...' : 'Validate Voucher'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have a voucher?{' '}
                  <Link href="/buy-voucher" className="text-gold hover:underline font-semibold">
                    Buy One Now
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-2xl text-navy">
                    Recruitment Application Form
                  </h2>
                  <div className="text-sm text-gray-600">
                    Voucher: <span className="font-mono font-bold text-navy">{voucherCode}</span>
                  </div>
                </div>
                <p className="text-gray-600">
                  Please fill out all required fields carefully. All information will be kept confidential.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="font-heading text-xl text-navy mb-4 pb-2 border-b-2 border-gold">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Place of Birth *
                      </label>
                      <input
                        type="text"
                        name="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nationality *
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-heading text-xl text-navy mb-4 pb-2 border-b-2 border-gold">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="font-heading text-xl text-navy mb-4 pb-2 border-b-2 border-gold">
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Occupation *
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Employer *
                      </label>
                      <input
                        type="text"
                        name="employer"
                        value={formData.employer}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Years in Profession *
                      </label>
                      <input
                        type="number"
                        name="yearsInProfession"
                        min="0"
                        value={formData.yearsInProfession}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Masonic Information */}
                <div>
                  <h3 className="font-heading text-xl text-navy mb-4 pb-2 border-b-2 border-gold">
                    Masonic Information
                  </h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Why do you want to become a Freemason? *
                      </label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What do you know about Freemasonry? *
                      </label>
                      <textarea
                        name="knowledgeOfFreemasonry"
                        value={formData.knowledgeOfFreemasonry}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Were you recommended by a Freemason? (Optional)
                      </label>
                      <input
                        type="text"
                        name="recommendedBy"
                        value={formData.recommendedBy}
                        onChange={handleFormChange}
                        placeholder="Name of recommending Freemason (if applicable)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="previouslyApplied"
                        checked={formData.previouslyApplied}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        I have previously applied to join Freemasonry
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="relativesInFreemasonry"
                        checked={formData.relativesInFreemasonry}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        I have relatives who are Freemasons
                      </label>
                    </div>

                    {formData.relativesInFreemasonry && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Please provide relative details
                        </label>
                        <textarea
                          name="relativeDetails"
                          value={formData.relativeDetails}
                          onChange={handleFormChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Character References */}
                <div>
                  <h3 className="font-heading text-xl text-navy mb-4 pb-2 border-b-2 border-gold">
                    Character References (3 Required) *
                  </h3>
                  
                  {/* Reference 1 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-navy mb-3">Reference 1</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="reference1Name"
                          placeholder="Full Name *"
                          value={formData.reference1Name}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="reference1Relationship"
                          placeholder="Relationship *"
                          value={formData.reference1Relationship}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          name="reference1Phone"
                          placeholder="Phone *"
                          value={formData.reference1Phone}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="reference1Email"
                          placeholder="Email *"
                          value={formData.reference1Email}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reference 2 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-navy mb-3">Reference 2</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="reference2Name"
                          placeholder="Full Name *"
                          value={formData.reference2Name}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="reference2Relationship"
                          placeholder="Relationship *"
                          value={formData.reference2Relationship}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          name="reference2Phone"
                          placeholder="Phone *"
                          value={formData.reference2Phone}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="reference2Email"
                          placeholder="Email *"
                          value={formData.reference2Email}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reference 3 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-navy mb-3">Reference 3</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="reference3Name"
                          placeholder="Full Name *"
                          value={formData.reference3Name}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="reference3Relationship"
                          placeholder="Relationship *"
                          value={formData.reference3Relationship}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          name="reference3Phone"
                          placeholder="Phone *"
                          value={formData.reference3Phone}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="reference3Email"
                          placeholder="Email *"
                          value={formData.reference3Email}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background */}
                <div>
                  <h3 className="font-heading text-xl text-navy mb-4 pb-2 border-b-2 border-gold">
                    Background Information
                  </h3>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="criminalRecord"
                        checked={formData.criminalRecord}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        I have a criminal record
                      </label>
                    </div>

                    {formData.criminalRecord && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Please provide details *
                        </label>
                        <textarea
                          name="criminalDetails"
                          value={formData.criminalDetails}
                          onChange={handleFormChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                          required={formData.criminalRecord}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Describe your moral character *
                      </label>
                      <textarea
                        name="moralCharacter"
                        value={formData.moralCharacter}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Tell us about your values, integrity, and character..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          name="beliefInSupremeBeing"
                          checked={formData.beliefInSupremeBeing}
                          onChange={handleFormChange}
                          className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded mt-1"
                          required
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          I believe in a Supreme Being (required for membership) *
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !formData.beliefInSupremeBeing}
                  className="w-full py-4 bg-gold text-navy font-bold text-lg rounded-lg hover:bg-gold-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
