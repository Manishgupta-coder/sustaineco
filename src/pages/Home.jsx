import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import MissionValuesSection from '../components/MissionValuesSection';
import ProjectsSlider from '../components/ProjectsSlider';
import ImpactMatrixSection from '../components/ImpactMatrixSection';
import ImpactStoriesSection from '../components/ImpactStoriesSection';
import ClientsPartnersSection from '../components/ClientsPartnersSection';
import ContactSection from '../components/ContactSection';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProject, setCurrentProject] = useState(0);
  const [currentImpact, setCurrentImpact] = useState(0);

  return (
    <>
      <HeroSection 
        currentSlide={currentSlide} 
        setCurrentSlide={setCurrentSlide} 
      />
      
      <MissionValuesSection />
      
      <ProjectsSlider />
      
      <ImpactMatrixSection />
      
      <ImpactStoriesSection 
        currentImpact={currentImpact} 
        setCurrentImpact={setCurrentImpact} 
      />

      <ClientsPartnersSection />
      
      <ContactSection />
    </>
  );
};

export default Home;
