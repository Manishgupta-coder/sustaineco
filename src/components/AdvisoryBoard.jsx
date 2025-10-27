import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import FadeInSection from './FadeInSection';
import { supabase } from '../supabase/supabase';

const advisors = [
  {
    name: 'Dr. Ayesha Sharma',
    profession: 'Environmental Scientist',
    description:
      'Dr. Sharma specializes in climate resilience and sustainable ecosystem research with over 15 years of experience in global environmental policy.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&facepad=3&q=80', // Unsplash public image
  },
  {
    name: 'Rajiv Menon',
    profession: 'Technology Strategist',
    description:
      'Rajiv brings deep expertise in green technology and digital transformation, helping organizations integrate innovation into sustainability goals.',
    image: '', // Leave blank for fallback icon or use another Unsplash/URL
  },
  {
    name: 'Elena Fernandez',
    profession: 'Community Development Expert',
    description:
      'Elena works with grassroots organizations to empower local communities in creating sustainable livelihoods and climate action initiatives.',
    image: '', // Leave blank for fallback icon or use another Unsplash/URL
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const AdvisoryBoard = () => {
  const [advisorData, setAdvisorData] = useState([]);

  useEffect(()=>{
    const fetchAdvisors = async()=>{
      const {data, error} = await supabase
      .from('advisory_board')
      .select('*')
      .order('id',{ascending:false})

      if(error){
        console.error('Error',error)
      }else{
        setAdvisorData(data)
        
      }
    }
    fetchAdvisors()
  },[])
  return(
    <>
      <section
    id="advisory-board"
    className="relative py-16 sm:py-20 md:py-24 bg-white"
  >
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 sm:mb-14"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
          Advisory Board
        </h2>
        <p className="text-gray-600 mt-3 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
          Our Advisory Board consists of visionary leaders and experts guiding us
          toward a sustainable and innovative future.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {advisorData.map((advisor, index) => (
          <FadeInSection key={index} delay={index * 0.2}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              }}
              className="relative bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl p-6 sm:p-8 text-center h-full text-white shadow-lg transition-all duration-300"
            >
              {advisor.image_url ? (
                <img
                  src={advisor.image_url}
                  alt={advisor.image_url}
                  className="w-16 h-16 rounded-full object-cover mb-4 sm:mb-6 mx-auto bg-white shadow"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Users className="text-white" size={26} />
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-bold">
                {advisor.name}
              </h3>
              <p className="text-sm sm:text-base font-medium mt-1 mb-3 opacity-90">
                {advisor.title}
              </p>
              <p className="text-sm sm:text-base leading-relaxed opacity-90">
                {advisor.description}
              </p>
            </motion.div>
          </FadeInSection>
        ))}
      </div>
    </div>
  </section>
    </>
  )
}

export default AdvisoryBoard;
