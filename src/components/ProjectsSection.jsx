import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Recycle, ChevronLeft, ChevronRight } from 'lucide-react';
import FadeInSection from './FadeInSection';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Urban Waste Management System",
      desc: "Comprehensive waste segregation and recycling initiative across 50+ cities",
      bgClass: "bg-brand-diag"
    },
    {
      title: "Climate Action Framework",
      desc: "Strategic planning for carbon neutrality in metropolitan regions",
      bgClass: "bg-brand-diag-alt"
    },
    {
      title: "Water Conservation Program",
      desc: "Innovative solutions for sustainable water resource management",
      bgClass: "bg-brand-deep"
    }
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSlidesPerView(1);
      else if (window.innerWidth < 1024) setSlidesPerView(2);
      else setSlidesPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, projects.length - slidesPerView);

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    if (!isInView) return; // Start auto-slide only when in view

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isInView, maxIndex]);

  return (
    <section id="projects" ref={ref} className="py-24 bg-gradient-to-b from-white via-emerald-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforming environmental challenges into sustainable opportunities
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-emerald-600" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-emerald-600" />
          </button>

          {/* Slider */}
          <div className="overflow-hidden py-[20px]">
            <motion.div
              className="flex gap-8"
              animate={{
                x: `calc(-${currentIndex * (100 / slidesPerView)}% - ${currentIndex * (2 / slidesPerView)}rem)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {projects.map((project, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{
                    flex: `0 0 calc(${100 / slidesPerView}% - ${
                      (slidesPerView - 1) * 2 / slidesPerView
                    }rem)`,
                    width: `calc(${100 / slidesPerView}% - ${
                      (slidesPerView - 1) * 2 / slidesPerView
                    }rem)`,
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-gradient-to-br from-emerald-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover-scale border-2 border-transparent hover:border-emerald-200"
                >
                  <div
                    className={`w-full h-48 rounded-xl mb-4 flex items-center justify-center ${project.bgClass}`}
                  >
                    <Recycle className="w-20 h-20 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-8 bg-gradient-to-r from-emerald-600 to-indigo-600"
                    : "w-2 bg-gray-300 hover:bg-emerald-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;