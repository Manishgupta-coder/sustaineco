import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertCircle, FileText } from 'lucide-react';
import { supabase } from '../../supabase/supabase';

const AboutUsManagement = () => {
  const [content, setContent] = useState({
    id: null,
    title: 'About Us',
    subtitle: '',
    description: '',
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us_content')
        .select('*')
        .single();

      if (error) {
        // If no content exists, keep default values
        if (error.code === 'PGRST116') {
          setLoading(false);
          return;
        }
        throw error;
      }

      if (data) {
        setContent(data);
      }
    } catch (err) {
      setError('Failed to load content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (content.id) {
        // Update existing content
        const { error } = await supabase
          .from('about_us_content')
          .update({
            title: content.title,
            subtitle: content.subtitle,
            description: content.description,
            is_active: content.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', content.id);

        if (error) throw error;
        setSuccess('Content updated successfully!');
      } else {
        // Insert new content
        const { data, error } = await supabase
          .from('about_us_content')
          .insert([{
            title: content.title,
            subtitle: content.subtitle,
            description: content.description,
            is_active: content.is_active
          }])
          .select()
          .single();

        if (error) throw error;
        setContent({ ...content, id: data.id });
        setSuccess('Content created successfully!');
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
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
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">About Us Content</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage the About Us section content</p>
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

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit Content</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              placeholder="e.g., About Us"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={content.subtitle}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              placeholder="e.g., Leading Environmental Consultancy in India"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description * 
              <span className="text-xs text-gray-500 font-normal ml-2">(Use line breaks for paragraphs)</span>
            </label>
            <textarea
              value={content.description}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              placeholder="Enter your about us content here. Use line breaks to separate paragraphs..."
              rows="12"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 resize-none font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Press Enter twice to create a new paragraph
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.is_active}
                onChange={(e) => setContent({ ...content, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Active (Show on website)</span>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </form>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
          {content.subtitle && (
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 font-semibold mb-6">
              {content.subtitle}
            </p>
          )}
          <div className="space-y-4">
            {content.description.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsManagement;