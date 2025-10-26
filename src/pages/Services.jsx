import React, { useState } from 'react';
import ImpactStoriesSection from '../components/ImpactStoriesSection';

const Services = () => {
  const [currentImpact, setCurrentImpact] = useState(0);

  return (
    <div className="pt-20">
      <ImpactStoriesSection 
        currentImpact={currentImpact} 
        setCurrentImpact={setCurrentImpact} 
      />
    </div>
  );
};

export default Services;
