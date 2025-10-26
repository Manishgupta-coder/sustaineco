import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import MissionValuesSection from '../components/MissionValuesSection';
import ProjectsSection from '../components/ProjectsSection';
import ImpactMatrixSection from '../components/ImpactMatrixSection';
import ImpactStoriesSection from '../components/ImpactStoriesSection';
import ClientsPartnersSection from '../components/ClientsPartnersSection';
import ContactSection from '../components/ContactSection';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProject, setCurrentProject] = useState(0);
  const [currentImpact, setCurrentImpact] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <>
      <HeroSection 
        currentSlide={currentSlide} 
        setCurrentSlide={setCurrentSlide} 
      />
      
      <MissionValuesSection />
      
      <ProjectsSection 
        currentProject={currentProject} 
        setCurrentProject={setCurrentProject} 
      />
      
      <ImpactMatrixSection />
      
      <ImpactStoriesSection 
        currentImpact={currentImpact} 
        setCurrentImpact={setCurrentImpact} 
      />

      <ClientsPartnersSection />
      
      <ContactSection 
        formSubmitted={formSubmitted} 
        handleSubmit={handleSubmit} 
      />
    </>
  );
};

export default Home;
