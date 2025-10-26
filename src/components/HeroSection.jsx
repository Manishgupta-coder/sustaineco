import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const HeroSection = ({ currentSlide, setCurrentSlide }) => {
  const heroSlides = [
    {
      id: 1,
      title: "Driving Sustainable Urban Futures",
      description: "Transforming cities through innovative environmental solutions and strategic planning",
      gradient_start: "#0f1729",
      gradient_end: "#0891b2"
    },
    {
      id: 2,
      title: "Innovating for Environmental Resilience",
      description: "Building climate-resilient communities with data-driven strategies",
      gradient_start: "#0891b2",
      gradient_end: "#3b82f6"
    },
    {
      id: 3,
      title: "Integrating Data with Sustainability",
      description: "Leveraging technology for measurable environmental impact",
      gradient_start: "#0a0e27",
      gradient_end: "#06b6d4"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length, setCurrentSlide]);

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slider container */}
      <motion.div 
        className="flex absolute inset-0"
        style={{ width: `${heroSlides.length * 100}%` }}
        animate={{ x: `-${currentSlide * (100 / heroSlides.length)}%` }}
        transition={{ type: "spring", stiffness: 50, damping: 20, duration: 0.8 }}
      >
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className="h-screen flex items-center justify-center relative"
            style={{
              width: `${100 / heroSlides.length}%`,
              background: `linear-gradient(135deg, ${slide.gradient_start} 0%, ${slide.gradient_end} 100%)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-cyan-950/80 to-blue-950/90"></div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10 text-center px-4 sm:px-6 lg:px-8 text-white max-w-4xl"
            >
              {/* Sparkle icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: currentSlide === index ? 1 : 0, rotate: currentSlide === index ? 0 : -180 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex justify-center mb-6"
              >
                <Sparkles className="w-12 h-12 text-cyan-400 animate-pulse-glow" />
              </motion.div>

              {/* Title */}
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSlide === index ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {slide.title.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: currentSlide === index ? 0.7 + i * 0.1 : 0 }}
                    className={i >= slide.title.split(' ').length - 2 
                      ? "inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" 
                      : "inline-block"}
                  >
                    {word}{' '}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Description */}
              <motion.p 
                className="text-xl md:text-2xl mb-8 text-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {slide.description}
              </motion.p>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default HeroSection;
