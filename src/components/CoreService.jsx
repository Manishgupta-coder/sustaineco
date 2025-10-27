import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../supabase/supabase';

const services = [
  {
    title: "Waste Management",
    image: "https://images.unsplash.com/photo-1508873699372-7aeab60b44c9?auto=format&fit=crop&w=500&q=80",
    points: [
      "Comprehensive solutions for Solid, Plastic, Legacy, Biomedical, and E-waste Management.",
      "Design and implementation of Integrated Waste Management Systems — including door-to-door collection, segregation, treatment, and scientific disposal.",
      "Circular Economy interventions, EPR advisory, bioremediation, and landfill reclamation for sustainable urban systems."
    ],
  },
  {
    title: "Environmental Sustainability",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=500&q=80",
    points: [
      "EIA, EMP, and Environmental Audits for industries, infrastructure, and development projects.",
      "Sustainability and ESG Strategy, including SDG alignment, BRSR, and GRI reporting.",
      "Resource efficiency, pollution prevention, and green certification support (LEED, GRIHA, ISO 14001)."
    ],
  },
  {
    title: "Social Development & Socio-Economic Studies",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=500&q=80",
    points: [
      "Socio-economic and baseline assessments for planning, policy, and project evaluation.",
      "Awareness and behavior change campaigns for ULBs, industries, and communities.",
      "Community engagement, inclusion of informal sector workers, and CSR-driven livelihood initiatives."
    ],
  },
  {
    title: "Natural Resource Management",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=500&q=80",
    points: [
      "Afforestation, watershed management, and rainwater harvesting for ecological restoration.",
      "Biodiversity conservation, land reclamation, and sustainable agriculture promotion.",
      "Participatory resource governance and ecosystem valuation to enhance local resilience."
    ],
  },
  {
    title: "Climate Change Mitigation & Adaptation",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=500&q=80",
    points: [
      "Carbon footprinting, GHG inventories, and MRV systems for policy and project-level implementation.",
      "Climate resilience and disaster risk reduction planning for governments and businesses.",
      "Renewable energy advisory and development of Net Zero and low-carbon transition strategies."
    ],
  },
  {
    title: "GIS Mapping & Real-Time Data Dashboards",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80",
    points: [
      "Development of GIS-based mapping and visualization tools for environmental and social datasets.",
      "Spatial planning and monitoring of waste, resource, and community infrastructure.",
      "Real-time dashboards and decision-support systems for evidence-based management and reporting."
    ],
  }
];

const CoreServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [servicesDetails, setServicesDetails] = useState([])

  useEffect(()=>{
        const fetchServices = async()=>{
          const {data, error} = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: false })
    
          if(error){
            console.error('Error',error);
          }else{
            setServicesDetails(data);          
          }
        }
        fetchServices()
      },[])

  return (
    <section
      id="services"
      ref={ref}
      className="py-12 sm:py-16 md:py-20 bg-white mt-10"
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

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesDetails.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all group overflow-hidden border border-gray-100 flex flex-col"
            >
              {/* Image */}
              <img
                src={service.image_url}
                alt={service.title}
                className="w-full h-44 sm:h-52 md:h-56 object-cover rounded-t-xl sm:rounded-t-2xl"
              />

              {/* Title */}
              <div className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4">
                  {service.title}
                </h3>

                {/* Points */}
                <ul className="space-y-3">
                  {service.description.map((point, pointIdx) => (
                    <li
                      key={pointIdx}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle
                        className="text-green-500 flex-shrink-0 mt-1"
                        size={20}
                      />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreServicesSection;
