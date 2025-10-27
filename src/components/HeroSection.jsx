import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { supabase } from "../supabase/supabase"; // adjust path as needed

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch slides from Supabase
  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from("slides")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) {
        console.error("Error fetching slides:", error.message);
      } else {
        setSlides(data || []);
      }
      setLoading(false);
    };

    fetchSlides();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
        Loading hero section...
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
        No slides available
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Slider container */}
      <motion.div
        className="flex absolute inset-0"
        style={{ width: `${slides.length * 100}%` }}
        animate={{ x: `-${currentSlide * (100 / slides.length)}%` }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          duration: 0.8,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="h-screen flex items-center justify-center relative"
            style={{
              width: `${100 / slides.length}%`,
              backgroundImage: slide.image_url
                ? `url(${slide.image_url})`
                : "linear-gradient(135deg, #0073E6 0%, #2EB82E 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Overlay gradient for text visibility */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

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
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                y: currentSlide === index ? 0 : 50,
              }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10 text-center px-4 sm:px-6 md:px-8 text-white max-w-3xl lg:max-w-4xl"
            >
              {/* Sparkle icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: currentSlide === index ? 1 : 0,
                  rotate: currentSlide === index ? 0 : -180,
                }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex justify-center mb-4 md:mb-6"
              >
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-cyan-400 animate-pulse-glow" />
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSlide === index ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {slide.title?.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: currentSlide === index ? 1 : 0,
                      y: currentSlide === index ? 0 : 20,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: currentSlide === index ? 0.7 + i * 0.1 : 0,
                    }}
                    className={
                      i >= slide.title.split(" ").length - 2
                        ? "inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                        : "inline-block"
                    }
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}

              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-200 px-2 md:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: currentSlide === index ? 1 : 0,
                  y: currentSlide === index ? 0 : 20,
                }}
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
