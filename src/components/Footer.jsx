import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, ArrowUp, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';

const Footer = ({ showBackToTop, scrollToTop }) => {
  const navigate = useNavigate();

  // Scroll to top after navigating
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-gradient-to-br from-slate-800 via-cyan-900 to-blue-900 text-white py-12 sm:py-14 md:py-16 border-t border-cyan-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-0">
            
            {/* Brand Section */}
            <div className="text-center sm:text-left lg:col-span-1">
              <div className="flex items-center justify-center sm:justify-start mb-4">
                <button
                  onClick={() => handleNavigation('/')}
                  className="shadow-lg bg-gradient-to-br from-white via-blue-100 to-cyan-200 rounded-xl p-2 transition-transform hover:scale-105"
                >
                  <img
                    src={Logo}
                    alt="SustainEco Systems & Services"
                    className="h-10 sm:h-10 w-auto object-contain"
                  />
                </button>
              </div>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
                Leading the way in sustainable environmental solutions for a better tomorrow.
              </p>
              <div className="flex gap-3 justify-center sm:justify-start">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 neon-border"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:contact@sustaineco.com"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 neon-border"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-center">
              <h4 className="font-bold mb-4 text-base sm:text-lg text-white">Quick Links</h4>
              <div className="space-y-2.5 text-gray-400 text-sm sm:text-base">
                <button
                  onClick={() => handleNavigation('/about')}
                  className="block w-full text-center hover:text-white hover:translate-x-1 transition-all"
                >
                  About Us
                </button>
                <button
                  onClick={() => handleNavigation('/services')}
                  className="block w-full text-center hover:text-white hover:translate-x-1 transition-all"
                >
                  Services
                </button>
                <button
                  onClick={() => handleNavigation('/projects')}
                  className="block w-full text-center hover:text-white hover:translate-x-1 transition-all"
                >
                  Projects
                </button>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="block w-full text-center hover:text-white hover:translate-x-1 transition-all"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold mb-4 text-base sm:text-lg text-white">Contact Us</h4>
              <div className="space-y-3 text-gray-400 text-sm sm:text-base max-w-md mx-auto sm:mx-0">
                <div className="flex items-start gap-2 justify-center sm:justify-start">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-1 text-blue-500" />
                  <p>
                    123 Green Street<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Phone className="w-5 h-5 flex-shrink-0 text-blue-500" />
                  <a href="tel:+911234567890" className="hover:text-white transition-colors">
                    +91 1234567890
                  </a>
                </div>
                <div className="flex items-center gap-2 break-all justify-center sm:justify-start">
                  <Mail className="w-5 h-5 flex-shrink-0 text-blue-500" />
                  <a
                    href="mailto:contact@sustaineco.com"
                    className="hover:text-white transition-colors"
                  >
                    contact@sustaineco.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6 sm:pt-6 mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-xs sm:text-sm">
              <p className="text-center sm:text-left">
                &copy; 2025 SustainEco Systems & Services. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-brand-diag text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      )}
    </>
  );
};

export default Footer;
