import React from 'react';
import { motion } from 'framer-motion';

const Content = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Content Management</h2>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Manage your website content here.</p>
      </div>
    </motion.div>
  );
};

export default Content;
