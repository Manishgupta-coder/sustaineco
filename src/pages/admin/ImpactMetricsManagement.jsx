import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Edit2, Trash2, X, AlertCircle, TrendingUp, MapPin } from 'lucide-react';
import { supabase } from '../../supabase/supabase';

// Indian States and Union Territories with their codes
const INDIAN_STATES = [
  { name: 'Andhra Pradesh', code: 'AP' },
  { name: 'Arunachal Pradesh', code: 'AR' },
  { name: 'Assam', code: 'AS' },
  { name: 'Bihar', code: 'BR' },
  { name: 'Chhattisgarh', code: 'CT' },
  { name: 'Goa', code: 'GA' },
  { name: 'Gujarat', code: 'GJ' },
  { name: 'Haryana', code: 'HR' },
  { name: 'Himachal Pradesh', code: 'HP' },
  { name: 'Jharkhand', code: 'JH' },
  { name: 'Karnataka', code: 'KA' },
  { name: 'Kerala', code: 'KL' },
  { name: 'Madhya Pradesh', code: 'MP' },
  { name: 'Maharashtra', code: 'MH' },
  { name: 'Manipur', code: 'MN' },
  { name: 'Meghalaya', code: 'ML' },
  { name: 'Mizoram', code: 'MZ' },
  { name: 'Nagaland', code: 'NL' },
  { name: 'Odisha', code: 'OR' },
  { name: 'Punjab', code: 'PB' },
  { name: 'Rajasthan', code: 'RJ' },
  { name: 'Sikkim', code: 'SK' },
  { name: 'Tamil Nadu', code: 'TN' },
  { name: 'Telangana', code: 'TG' },
  { name: 'Tripura', code: 'TR' },
  { name: 'Uttar Pradesh', code: 'UP' },
  { name: 'Uttarakhand', code: 'UT' },
  { name: 'West Bengal', code: 'WB' },
  { name: 'Andaman and Nicobar Islands', code: 'AN' },
  { name: 'Chandigarh', code: 'CH' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN' },
  { name: 'Delhi', code: 'DL' },
  { name: 'Jammu and Kashmir', code: 'JK' },
  { name: 'Ladakh', code: 'LA' },
  { name: 'Lakshadweep', code: 'LD' },
  { name: 'Puducherry', code: 'PY' }
];

const ImpactMetricsManagement = () => {
  const [metrics, setMetrics] = useState({
    clients: 150,
    projects: 250,
    lives_impacted: 50000,
    states_covered: 15
  });
  const [footprintStates, setFootprintStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingState, setEditingState] = useState(null);
  const [isAddingState, setIsAddingState] = useState(false);
  const [stateForm, setStateForm] = useState({
    state_name: '',
    state_code: '',
    projects_count: 0,
    is_active: true,
    color: '#10b981'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('impact_metrics')
        .select('*')
        .single();

      if (metricsError) throw metricsError;
      if (metricsData) setMetrics(metricsData);

      // Fetch footprint states
      const { data: statesData, error: statesError } = await supabase
        .from('project_footprint')
        .select('*')
        .order('state_name', { ascending: true });

      if (statesError) throw statesError;
      setFootprintStates(statesData || []);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMetricsUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('impact_metrics')
        .update({
          ...metrics,
          updated_at: new Date().toISOString()
        })
        .eq('id', metrics.id);

      if (error) throw error;
      setSuccess('Metrics updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update metrics: ' + err.message);
    }
  };

  const handleStateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingState) {
        // Update existing state
        const { error } = await supabase
          .from('project_footprint')
          .update({
            ...stateForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingState.id);

        if (error) throw error;
        setSuccess('State updated successfully!');
      } else {
        // Add new state
        const { error } = await supabase
          .from('project_footprint')
          .insert([stateForm]);

        if (error) throw error;
        setSuccess('State added successfully!');
      }

      fetchData();
      resetStateForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteState = async (id) => {
    if (!window.confirm('Are you sure you want to delete this state?')) return;

    try {
      const { error } = await supabase
        .from('project_footprint')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('State deleted successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete: ' + err.message);
    }
  };

  const handleEditState = (state) => {
    setEditingState(state);
    setStateForm({
      state_name: state.state_name,
      state_code: state.state_code,
      projects_count: state.projects_count,
      is_active: state.is_active,
      color: state.color
    });
    setIsAddingState(true);
  };

  const resetStateForm = () => {
    setStateForm({
      state_name: '',
      state_code: '',
      projects_count: 0,
      is_active: true,
      color: '#10b981'
    });
    setEditingState(null);
    setIsAddingState(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Impact Metrics Management</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage impact statistics and project footprint</p>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm flex-1">{error}</p>
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
            <p className="text-green-800 text-sm flex-1">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Impact Metrics Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Impact Metrics</h3>
        </div>

        <form onSubmit={handleMetricsUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Happy Clients
              </label>
              <input
                type="number"
                value={metrics.clients}
                onChange={(e) => setMetrics({ ...metrics, clients: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projects Completed
              </label>
              <input
                type="number"
                value={metrics.projects}
                onChange={(e) => setMetrics({ ...metrics, projects: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lives Impacted
              </label>
              <input
                type="number"
                value={metrics.lives_impacted}
                onChange={(e) => setMetrics({ ...metrics, lives_impacted: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                States Covered
              </label>
              <input
                type="number"
                value={metrics.states_covered}
                onChange={(e) => setMetrics({ ...metrics, states_covered: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md text-sm"
          >
            <Save className="w-4 h-4" />
            Update Metrics
          </motion.button>
        </form>
      </div>

      {/* Project Footprint Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Project Footprint States</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddingState(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add State
          </motion.button>
        </div>

        {/* Add/Edit State Form */}
        <AnimatePresence>
          {isAddingState && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-gray-900">
                  {editingState ? 'Edit State' : 'Add New State'}
                </h4>
                <button
                  onClick={resetStateForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleStateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State / Union Territory
                    </label>
                    <select
                      value={stateForm.state_name}
                      onChange={(e) => {
                        const selectedState = INDIAN_STATES.find(s => s.name === e.target.value);
                        setStateForm({ 
                          ...stateForm, 
                          state_name: e.target.value,
                          state_code: selectedState ? selectedState.code : ''
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                      required
                    >
                      <option value="">Select a state...</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state.code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State Code
                    </label>
                    <input
                      type="text"
                      value={stateForm.state_code}
                      readOnly
                      placeholder="Auto-filled"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Projects Count
                    </label>
                    <input
                      type="number"
                      value={stateForm.projects_count}
                      onChange={(e) => setStateForm({ ...stateForm, projects_count: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={stateForm.color}
                      onChange={(e) => setStateForm({ ...stateForm, color: e.target.value })}
                      className="w-full h-11 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white cursor-pointer"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={stateForm.is_active}
                        onChange={(e) => setStateForm({ ...stateForm, is_active: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active (Show on map)</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {editingState ? 'Update' : 'Add'} State
                  </motion.button>
                  <button
                    type="button"
                    onClick={resetStateForm}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* States List */}
        <div className="space-y-3">
          {footprintStates.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No states added yet.</p>
          ) : (
            footprintStates.map((state) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: state.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{state.state_name}</p>
                        <span className="text-xs font-mono text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                          {state.state_code}
                        </span>
                        {!state.is_active && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {state.projects_count} projects
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditState(state)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteState(state.id)}
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

export default ImpactMetricsManagement;