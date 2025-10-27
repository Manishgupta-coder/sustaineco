import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import FadeInSection from './FadeInSection';
import { supabase } from '../supabase/supabase';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFormSubmitted(false);

    try {
      // Insert contact submission into Supabase
      const { data, error: submitError } = await supabase
        .from('contact_submissions')
        .insert([formData])
        .select();

      if (submitError) throw submitError;

      // Send email notification to guptamanish2023@gmail.com
      try {
        // Using EmailJS - Free email service (you need to set this up)
        // Alternative: Use your own backend API endpoint
        const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
            template_id: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
            user_id: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
            template_params: {
              to_email: 'guptamanish2023@gmail.com',
              from_name: formData.full_name,
              from_email: formData.email,
              phone: formData.phone,
              message: formData.message || 'No message provided',
              submission_date: new Date().toLocaleString()
            }
          })
        });

        if (!emailResponse.ok) {
          console.error('Email notification failed');
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw error - form submission was successful
      }

      setFormSubmitted(true);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        message: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Form Section */}
          <FadeInSection>
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-600 via-amber-600 to-indigo-600 bg-clip-text text-transparent">
                Get in Touch
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Let's collaborate on building a sustainable future together
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              <div>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number *"
                  pattern="[0-9]{10,15}"
                  title="Please enter a valid phone number (10-15 digits)"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message (Optional)"
                  rows="5"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none bg-white text-gray-900"
                />
              </div>
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full px-6 sm:px-8 py-3 sm:py-3.5 md:py-4 bg-brand-diag text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 animate-gradient disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </motion.button>
            </form>

            {/* Success Message */}
            {formSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;