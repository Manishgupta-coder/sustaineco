import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Target, Award } from 'lucide-react';
import { supabase } from '../../supabase/supabase';

const MissionValuesManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    type: 'value',
    content: '',
    order_index: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('mission_values')
        .select('*')
        .order('type', { ascending: false })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError('Failed to load items: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('mission_values')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        setSuccess('Item updated successfully!');
      } else {
        // Create new item
        const { error } = await supabase
          .from('mission_values')
          .insert([formData]);

        if (error) throw error;
        setSuccess('Item created successfully!');
      }

      fetchItems();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('mission_values')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Item deleted successfully!');
      fetchItems();
    } catch (err) {
      setError('Failed to delete: ' + err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      content: item.content,
      order_index: item.order_index,
    });
    setIsAddingNew(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'value',
      content: '',
      order_index: 0,
    });
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const missionItems = items.filter(item => item.type === 'mission');
  const valueItems = items.filter(item => item.type === 'value');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Mission & Values Management</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddingNew(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md font-medium text-sm sm:w-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add New
        </motion.button>
      </div>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
            <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 font-medium"
                  required
                >
                  <option value="mission">Mission (Paragraph)</option>
                  <option value="value">Value (List Item)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={formData.type === 'mission' ? 'Enter mission statement...' : 'Enter value...'}
                  rows={formData.type === 'mission' ? 6 : 3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Index
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md text-sm sm:flex-1"
                >
                  <Save className="w-4 h-4" />
                  {editingItem ? 'Update' : 'Create'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors font-medium shadow-sm text-sm sm:flex-1"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Mission (Paragraph)</h3>
        </div>
        <div className="space-y-4">
          {missionItems.length === 0 ? (
            <p className="text-gray-500 text-sm">No mission statement added yet.</p>
          ) : (
            missionItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <p className="text-gray-800 flex-1 text-sm sm:text-base leading-relaxed">{item.content}</p>
                  <div className="flex gap-2 flex-shrink-0 self-end sm:self-start">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Values (List Items)</h3>
        </div>
        <div className="space-y-3">
          {valueItems.length === 0 ? (
            <p className="text-gray-500 text-sm">No values added yet.</p>
          ) : (
            valueItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 w-full">
                    <span className="text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded mt-0.5">#{item.order_index}</span>
                    <p className="text-gray-800 flex-1 text-sm sm:text-base">{item.content}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-end sm:self-start">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionValuesManagement;