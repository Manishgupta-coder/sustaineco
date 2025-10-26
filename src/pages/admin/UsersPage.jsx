import React from 'react';
import { motion } from 'framer-motion';

const UsersPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6">User Management</h2>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Manage users and permissions here.</p>
      </div>
    </motion.div>
  );
};

export default UsersPage;
