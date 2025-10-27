import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/supabase';

const AboutUsSection = () => {
  const [content, setContent] = useState({
    title: 'About Us',
    subtitle: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();

    // Set up real-time subscription
    const subscription = supabase
      .channel('about_us_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'about_us_content'
        },
        (payload) => {
          console.log('About Us content changed:', payload);
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us_content')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching about us content:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-8 sm:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            >
              {content.title}
            </motion.h1>
            
            {content.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 font-semibold"
              >
                {content.subtitle}
              </motion.p>
            )}
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-100"
          >
            <div className="prose prose-lg max-w-none">
              {content.description.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p
                    key={index}
                    className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 last:mb-0"
                  >
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsSection;