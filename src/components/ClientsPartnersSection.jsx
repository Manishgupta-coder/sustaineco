import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase/supabase';

const ClientsPartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch clients and partners from Supabase
  useEffect(() => {
    fetchClientsPartners();

    // Set up real-time subscription
    // const subscription = supabase
    //   .channel('clients_partners_changes')
    //   .on(
    //     'postgres_changes',
    //     {
    //       event: '*',
    //       schema: 'public',
    //       table: 'clients_partners'
    //     },
    //     (payload) => {
    //       console.log('Clients/Partners changed:', payload);
    //       fetchClientsPartners();
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   subscription.unsubscribe();
    // };
  }, []);

  const fetchClientsPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('clients_partners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients/partners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSlidesPerView(1);
      else if (window.innerWidth < 768) setSlidesPerView(2);
      else if (window.innerWidth < 1024) setSlidesPerView(3);
      else if (window.innerWidth < 1280) setSlidesPerView(4);
      else setSlidesPerView(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, clients.length - slidesPerView);

  const next = () => setCurrentIndex((p) => Math.min(p + 1, maxIndex));
  const prev = () => setCurrentIndex((p) => Math.max(p - 1, 0));

  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      setCurrentIndex((p) => (p >= maxIndex ? 0 : p + 1));
    }, 4000);
    return () => clearInterval(id);
  }, [isInView, maxIndex]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="clients" ref={ref} className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Our Clients <span className=" bg-clip-text bg-gradient-to-r from-[var(--brand-blue-600)] to-[var(--brand-green-600)]">& Partners</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by leading organizations worldwide
          </p>
        </motion.div>

        {clients.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm sm:text-base">No clients or partners added yet. Add them from the admin panel.</p>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 z-10 bg-white rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
            </button>

            <button
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 z-10 bg-white rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
            </button>

            <div className="overflow-hidden py-[10px]">
            <motion.div
              className="flex gap-6"
              animate={{
                x: `calc(-${currentIndex * (100 / slidesPerView)}% - ${currentIndex * (24 / slidesPerView)}px)`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {clients.map((c, idx) => (
                <motion.div
                  key={idx}
                  initial={{  scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  style={{
                    flex: `0 0 calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * (24 / slidesPerView)}px)`,
                    width: `calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * (24 / slidesPerView)}px)`,
                  }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all h-full">
                    <div className="p-6 sm:p-7 md:p-8 flex flex-col items-center text-center">
                      <div className="w-24 h-14 sm:w-28 sm:h-16 md:w-32 md:h-20 rounded-xl mb-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {c.logo_url ? (
                          <img 
                            src={c.logo_url} 
                            alt={c.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ display: c.logo_url ? 'none' : 'flex' }}
                        >
                          <span className="text-xs sm:text-sm font-medium text-gray-400">
                            {c.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 leading-snug">
                        {c.name}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            </div>

            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 sm:w-10 bg-blue-700' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientsPartnersSection;
