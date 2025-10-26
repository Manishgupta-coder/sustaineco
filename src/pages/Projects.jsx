import React, { useState } from 'react';
import ProjectsSection from '../components/ProjectsSection';

const Projects = () => {
  const [currentProject, setCurrentProject] = useState(0);

  return (
    <div className="pt-20">
      <ProjectsSection 
        currentProject={currentProject} 
        setCurrentProject={setCurrentProject} 
      />
    </div>
  );
};

export default Projects;
