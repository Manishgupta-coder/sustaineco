import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Edit2, Trash2, X, AlertCircle, Briefcase, Upload, Image as ImageIcon, MoveUp, MoveDown } from 'lucide-react';
import { supabase } from '../../supabase/supabase';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    logo_url: '',
    is_active: true,
    display_order: 0
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError('Failed to load projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...form,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProject.id);

        if (error) throw error;
        setSuccess('Project updated successfully!');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([{
            ...form,
            display_order: projects.length
          }]);

        if (error) throw error;
        setSuccess('Project added successfully!');
      }

      fetchProjects();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Project deleted successfully!');
      fetchProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete: ' + err.message);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      logo_url: project.logo_url || '',
      is_active: project.is_active,
      display_order: project.display_order
    });
    setIsAdding(true);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setUploadingLogo(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      setForm({ ...form, logo_url: publicUrl });
      setSuccess('Logo uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload logo: ' + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const moveProject = async (id, direction) => {
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;

    try {
      await Promise.all([
        supabase.from('projects').update({ display_order: newIndex }).eq('id', projects[index].id),
        supabase.from('projects').update({ display_order: index }).eq('id', projects[newIndex].id)
      ]);

      fetchProjects();
    } catch (err) {
      setError('Failed to reorder: ' + err.message);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      logo_url: '',
      is_active: true,
      display_order: 0
    });
    setEditingProject(null);
    setIsAdding(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Projects</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage your project portfolio</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm flex-1">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm flex-1">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Urban Waste Management System" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white text-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the project..." rows="4" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white text-gray-900 resize-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Image/Logo</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{uploadingLogo ? 'Uploading...' : 'Choose Image'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Max 2MB, PNG/JPG recommended</p>
                </div>
                {form.logo_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                        <img src={form.logo_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <button type="button" onClick={() => setForm({ ...form, logo_url: '' })} className="text-sm text-red-600 hover:text-red-700">Remove</button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                    <span className="text-sm font-medium text-gray-700">Active (Show on website)</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm text-sm">
                  <Save className="w-4 h-4" />
                  {editingProject ? 'Update' : 'Add'}
                </motion.button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors font-medium text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No projects added yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {projects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {project.logo_url ? <img src={project.logo_url} alt={project.title} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{project.title}</h4>
                      {!project.is_active && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Inactive</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => moveProject(project.id, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Move up"><MoveUp className="w-4 h-4" /></button>
                    <button onClick={() => moveProject(project.id, 'down')} disabled={index === projects.length - 1} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Move down"><MoveDown className="w-4 h-4" /></button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(project)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManagement;