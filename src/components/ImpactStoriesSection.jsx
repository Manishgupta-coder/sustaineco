import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Recycle, Leaf, Users, TreePine, Cloud, Map,CheckCircle } from 'lucide-react';

const CoreServicesSection = () => {
  const services = [
    {
      icon: Recycle,
      title: "Waste Management",
      points: [
        "Comprehensive solutions for Solid, Plastic, Legacy, Biomedical, and E-waste Management.",
        "Design and implementation of Integrated Waste Management Systems — including door-to-door collection, segregation, treatment, and scientific disposal.",
        "Circular Economy interventions, EPR advisory, bioremediation, and landfill reclamation for sustainable urban systems."
      ],
      colorClass: "bg-brand-diag"
    },
    {
      icon: Leaf,
      title: "Environmental Sustainability",
      points: [
        "EIA, EMP, and Environmental Audits for industries, infrastructure, and development projects.",
        "Sustainability and ESG Strategy, including SDG alignment, BRSR, and GRI reporting.",
        "Resource efficiency, pollution prevention, and green certification support (LEED, GRIHA, ISO 14001)."
      ],
      colorClass: "bg-brand-diag-alt"
    },
    {
      icon: Users,
      title: "Social Development & Socio-Economic Studies",
      points: [
        "Socio-economic and baseline assessments for planning, policy, and project evaluation.",
        "Awareness and behavior change campaigns for ULBs, industries, and communities.",
        "Community engagement, inclusion of informal sector workers, and CSR-driven livelihood initiatives."
      ],
      colorClass: "bg-brand-diag"
    },
    {
      icon: TreePine,
      title: "Natural Resource Management",
      points: [
        "Afforestation, watershed management, and rainwater harvesting for ecological restoration.",
        "Biodiversity conservation, land reclamation, and sustainable agriculture promotion.",
        "Participatory resource governance and ecosystem valuation to enhance local resilience."
      ],
      colorClass: "bg-brand-diag-alt"
    },
    {
      icon: Cloud,
      title: "Climate Change Mitigation & Adaptation",
      points: [
        "Carbon footprinting, GHG inventories, and MRV systems for policy and project-level implementation.",
        "Climate resilience and disaster risk reduction planning for governments and businesses.",
        "Renewable energy advisory and development of Net Zero and low-carbon transition strategies."
      ],
      colorClass: "bg-brand-diag"
    },
    {
      icon: Map,
      title: "GIS Mapping & Real-Time Data Dashboards",
      points: [
        "Development of GIS-based mapping and visualization tools for environmental and social datasets.",
        "Spatial planning and monitoring of waste, resource, and community infrastructure.",
        "Real-time dashboards and decision-support systems for evidence-based management and reporting."
      ],
      colorClass: "bg-brand-diag-alt"
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

  const maxIndex = Math.max(0, services.length - slidesPerView);

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isInView, maxIndex]);

  return (
    <section id="services" ref={ref} className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
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
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 z-10 bg-white rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 z-10 bg-white rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next service"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden py-[10px]">
            <motion.div
              className="flex gap-6"
              animate={{
                x: `calc(-${currentIndex * (100 / slidesPerView)}% - ${currentIndex * (24 / slidesPerView)}px)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {services.map((service, idx) => {
                const Icon = service.icon;
                return (
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
                    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden h-full">
                      {/* Icon Header */}
                      <div className={`${service.colorClass} p-6 sm:p-8`}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                          {service.title}
                        </h3>
                      </div>

                      {/* Content - Bullet Points */}
                      <div className="p-5 sm:p-6 md:p-8 bg-white">
                        <ul className="space-y-2.5 sm:space-y-3">
                          {service.points.map((point, pointIdx) => (
                            <li key={pointIdx} className="flex items-start gap-2 sm:gap-2.5">
                              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" size={20} />
                              <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  idx === currentIndex
                    ? "w-8 sm:w-10 bg-blue-700"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to service ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreServicesSection;