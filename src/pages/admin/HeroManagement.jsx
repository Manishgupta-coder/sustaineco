import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabase/supabase';

const HeroManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    gradient_start: '#0073E6',
    gradient_end: '#2EB82E',
    order_index: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (err) {
      setError('Failed to load slides: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const slideData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingSlide) {
        // Update existing slide
        const { error } = await supabase
          .from('hero_slides')
          .update(slideData)
          .eq('id', editingSlide.id);

        if (error) throw error;
        setSuccess('Slide updated successfully!');
      } else {
        // Create new slide
        const { error } = await supabase
          .from('hero_slides')
          .insert([slideData]);

        if (error) throw error;
        setSuccess('Slide created successfully!');
      }

      fetchSlides();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Slide deleted successfully!');
      fetchSlides();
    } catch (err) {
      setError('Failed to delete: ' + err.message);
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      description: slide.description,
      image_url: slide.image_url || '',
      gradient_start: slide.gradient_start,
      gradient_end: slide.gradient_end,
      order_index: slide.order_index,
    });
    setIsAddingNew(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      gradient_start: '#0073E6',
      gradient_end: '#2EB82E',
      order_index: slides.length,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingSlide(null);
    setIsAddingNew(false);
  };

  if (loading) {
    return <div className="text-gray-600">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Hero Section Management</h2>
        {!isAddingNew && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-diag text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Slide
          </motion.button>
        )}
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
          >
            {success}
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
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSlide ? 'Edit Slide' : 'Add New Slide'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter slide title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Enter slide description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                
                {/* Preview of newly selected image */}
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-48 w-full object-cover rounded-lg border-2 border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Current image (when editing) */}
                {formData.image_url && !imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                    <img 
                      src={formData.image_url} 
                      alt="Current" 
                      className="h-48 w-full object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Upload a background image for this slide (optional - gradient will be used as fallback)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gradient Start Color
                  </label>
                  <input
                    type="color"
                    value={formData.gradient_start}
                    onChange={(e) => setFormData({ ...formData, gradient_start: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gradient End Color
                  </label>
                  <input
                    type="color"
                    value={formData.gradient_end}
                    onChange={(e) => setFormData({ ...formData, gradient_end: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Index
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-2 bg-brand-diag text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {uploading ? 'Uploading...' : editingSlide ? 'Update' : 'Create'} Slide
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slides List */}
      <div className="space-y-4">
        {slides.map((slide) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              {slide.image_url && (
                <div className="w-48 h-32 flex-shrink-0">
                  <img 
                    src={slide.image_url} 
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{slide.title}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    Order: {slide.order_index}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{slide.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {slide.image_url ? 'Fallback Gradient:' : 'Gradient:'}
                  </span>
                  <div
                    className="w-24 h-6 rounded"
                    style={{
                      background: `linear-gradient(135deg, ${slide.gradient_start} 0%, ${slide.gradient_end} 100%)`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No slides yet. Click "Add New Slide" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroManagement;
