import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Content from './pages/admin/Content';
import HeroManagement from './pages/admin/HeroManagement';
import MissionValuesManagement from './pages/admin/MissionValuesManagement';
import ImpactMetricsManagement from './pages/admin/ImpactMetricsManagement';
import ClientsPartnersManagement from './pages/admin/ClientsPartnersManagement';
import AboutUsManagement from './pages/admin/AboutUsManagement';
import ProjectsManagement from './pages/admin/ProjectsManagement';
import ContactManagement from './pages/admin/ContactManagement';
import UsersPage from './pages/admin/UsersPage';
import Analytics from './pages/admin/Analytics';
import SettingsPage from './pages/admin/SettingsPage';
import ServicesAdmin from './pages/admin/Services';
import CoreServicesSection from './components/CoreService';
import AdminAdvisoryBoard from './pages/admin/AdminAdvisoryBoard';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<CoreServicesSection />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="content" element={<Content />} />
        <Route path="content/hero" element={<HeroManagement />} />
        <Route path="content/about-us" element={<AboutUsManagement />} />
        <Route path="content/mission-values" element={<MissionValuesManagement />} />
        <Route path="content/impact-metrics" element={<ImpactMetricsManagement />} />
        <Route path="content/clients-partners" element={<ClientsPartnersManagement />} />
        <Route path="content/projects" element={<ProjectsManagement />} />
        <Route path="contact-submissions" element={<ContactManagement />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path='content/services' element={<ServicesAdmin/>}/>
        <Route path='content/AdminAdvisoryBoard' element={<AdminAdvisoryBoard/>}/>
      </Route>
    </Routes>
  );
};

export default App;