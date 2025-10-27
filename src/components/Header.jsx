import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../assets/images/logo.png';

const Header = ({ scrolled, isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ];

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    if (isActive) {
      return 'text-cyan-400 font-semibold';
    }
    return scrolled
      ? 'text-gray-200 hover:text-cyan-400'
      : 'text-white hover:text-cyan-400';
  };

  // Always show background on /services, otherwise scroll-based
  const showSolidBackground =
    scrolled ||
    location.pathname === '/services' ||
    location.pathname === '/projects';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolidBackground
          ? 'bg-slate-950/95 backdrop-blur-md shadow-lg shadow-cyan-500/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="shadow-lg bg-gradient-to-br from-white via-blue-100 to-cyan-200 rounded-xl p-2">
            <img
              src={Logo}
              alt="SustainEco Systems & Services"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`transition-colors text-sm lg:text-base font-medium ${getLinkClass(
                to
              )}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden transition-colors p-2 rounded-lg hover:bg-white/10 text-white`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-slate-950/95 backdrop-blur-md shadow-lg border-t border-cyan-900/30"
        >
          <div className="container mx-auto px-4 sm:px-6 py-5 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  location.pathname === to
                    ? 'text-cyan-400 bg-slate-800/60'
                    : 'text-gray-200 hover:text-cyan-400 hover:bg-slate-800/50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
