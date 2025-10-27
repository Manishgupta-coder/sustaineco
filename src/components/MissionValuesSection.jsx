import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Award, CheckCircle } from 'lucide-react';
import FadeInSection from './FadeInSection';
import { supabase } from '../supabase/supabase';

const MissionValuesSection = () => {
  const [missionContent, setMissionContent] = useState('');
  const [valuesContent, setValuesContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissionValues();
  }, []);

  const fetchMissionValues = async () => {
    try {
      const { data, error } = await supabase
        .from('mission_values')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      // Separate mission and values
      const mission = data.find(item => item.type === 'mission');
      const values = data.filter(item => item.type === 'value');

      setMissionContent(mission?.content || '');
      setValuesContent(values.map(v => v.content));
    } catch (err) {
      console.error('Error fetching mission/values:', err);
      // Fallback to default content
      setMissionContent('To drive sustainable development through innovative environmental solutions, empowering communities and organizations to build resilient, eco-friendly futures. We believe in the power of data, technology, and strategic planning to create lasting positive impact on our planet.');
      setValuesContent([
        "Innovation in sustainability and environmental protection",
        "Data-driven decision making for measurable impact",
        "Community engagement and collaborative solutions",
        "Commitment to transparency and accountability"
      ]);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <section id="about" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          <FadeInSection>
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10, boxShadow: "0 25px 50px rgba(6, 182, 212, 0.2)" }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8 h-full hover-scale neon-border transition-all duration-300"
            >
              <motion.div 
                className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-pulse-glow"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Target className="text-white" size={28} />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                {missionContent}
              </p>
            </motion.div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.2)" }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8 h-full hover-scale neon-border transition-all duration-300"
            >
              <motion.div 
                className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-pulse-glow"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Award className="text-white" size={28} />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Our Values
              </h2>
              <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base lg:text-lg text-gray-300">
                {valuesContent.map((value, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-2.5 sm:gap-3"
                  >
                    <CheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-1" size={20} />
                    <span>{value}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

export default MissionValuesSection;