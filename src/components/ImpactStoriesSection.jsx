import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase/supabase';

const CoreServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [servicesDetails, setServicesDetails] = useState([]);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServicesDetails(data || []);
      }
    };
    fetchServices();
  }, []);

  // Responsive slide count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSlidesPerView(1);
      else if (window.innerWidth < 1024) setSlidesPerView(2);
      else setSlidesPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Adjust max index based on available data
  const maxIndex = Math.max(0, servicesDetails.length - slidesPerView);
  const canSlide = servicesDetails.length > slidesPerView;

  const nextSlide = () => {
    if (canSlide) setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    if (canSlide) setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Auto slide (only if sliding is possible)
  useEffect(() => {
    if (!isInView || !canSlide) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isInView, maxIndex, canSlide]);

  return (
    <section
      id="services"
      ref={ref}
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Our Core <span className="text-blue-700">Services</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive environmental and sustainability solutions tailored to meet your organizational goals
          </p>
        </motion.div>

        {/* Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={!canSlide || currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 z-10 bg-white rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
          </button>

          <button
            onClick={nextSlide}
            disabled={!canSlide || currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 z-10 bg-white rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next service"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden py-[10px]">
            <motion.div
              className="flex gap-6"
              animate={{
                x: canSlide
                  ? `calc(-${currentIndex * (100 / slidesPerView)}% - ${
                      currentIndex * (24 / slidesPerView)
                    }px)`
                  : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {servicesDetails.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{
                    flex: `0 0 calc(${100 / slidesPerView}% - ${
                      (slidesPerView - 1) * (24 / slidesPerView)
                    }px)`,
                    width: `calc(${100 / slidesPerView}% - ${
                      (slidesPerView - 1) * (24 / slidesPerView)
                    }px)`,
                  }}
                  className="shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col">
                    {/* Image */}
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-44 sm:h-52 md:h-56 object-cover"
                    />
                    {/* Title below image */}
                    <div className="flex-1 flex flex-col justify-center items-center p-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mt-2">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          {canSlide && (
            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    idx === currentIndex
                      ? 'w-8 sm:w-10 bg-blue-700'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to service ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoreServicesSection;
