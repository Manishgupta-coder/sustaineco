import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import FadeInSection from './FadeInSection';

const ContactSection = ({ formSubmitted, handleSubmit }) => {
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
                  placeholder="Your Name"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 sm:px-8 py-3 sm:py-3.5 md:py-4 bg-brand-diag text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 animate-gradient"
              >
                Send Message
              </motion.button>
            </form>

            {formSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 sm:p-4 bg-green-100 text-green-800 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </motion.div>
            )}
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;