import React, { useState } from 'react';
import ContactSection from '../components/ContactSection';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="pt-20">
      <ContactSection 
        formSubmitted={formSubmitted} 
        handleSubmit={handleSubmit} 
      />
    </div>
  );
};

export default Contact;
