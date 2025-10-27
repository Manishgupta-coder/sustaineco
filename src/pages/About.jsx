import React from 'react';
import AboutUsSection from '../components/AboutUsSection';
import MissionValuesSection from '../components/MissionValuesSection';
import AdvisoryBoard from '../components/AdvisoryBoard';

const About = () => {
  return (
    <div className="pt-20">
      <AboutUsSection />
      <MissionValuesSection />
      <AdvisoryBoard />
    </div>
  );
};

export default About;
