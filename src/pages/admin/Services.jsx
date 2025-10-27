import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";
import { Plus, Edit, Trash2, Upload } from "lucide-react";

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState([""]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddPoint = () => {
    setDescription([...description, ""]);
  };

  const handlePointChange = (index, value) => {
    const updated = [...description];
    updated[index] = value;
    setDescription(updated);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data, error } = await supabase.storage
      .from("service-images")
      .upload(fileName, imageFile);
    if (error) {
      console.error(error);
      alert("Image upload failed!");
      return null;
    }
    const { data: publicUrlData } = supabase.storage
      .from("service-images")
      .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription([""]);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;
    if (imageFile) imageUrl = await uploadImage();

    const payload = {
      title,
      description,
      ...(imageUrl && { image_url: imageUrl }),
    };

    if (editingId) {
      const { error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", editingId);
      if (!error) alert("Service updated successfully!");
    } else {
      const { error } = await supabase.from("services").insert([payload]);
      if (!error) alert("Service added successfully!");
    }

    resetForm();
    fetchServices();
    setLoading(false);
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setTitle(service.title);
    setDescription(service.description || [""]);
    setImagePreview(service.image_url || null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (!error) {
        alert("Service deleted successfully!");
        fetchServices();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Manage Services
      </h2>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingId ? "Edit Service" : "Add New Service"}
          </h3>

          {/* Add New Button when editing */}
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1 rounded-md transition"
            >
              + Add New Service
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title *</label>
            <input
              type="text"
              placeholder="Enter service title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-[#000000]"
              required
            />
          </div>

          {/* Description Points */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description Points *
            </label>
            {description.map((point, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Point ${idx + 1}`}
                value={point}
                onChange={(e) => handlePointChange(idx, e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-500 outline-none text-[#000000]"
                required
              />
            ))}
            <button
              type="button"
              onClick={handleAddPoint}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add another point
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Service Image</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200">
                <Upload className="w-5 h-5" />
                <span>{imageFile ? imageFile.name : "Upload Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </label>
              {imagePreview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md"
          >
            {loading ? "Saving..." : editingId ? "Update Service" : "Add Service"}
          </button>
        </form>
      </div>

      {/* Services List */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">All Services</h3>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <img
                  src={service.image_url || "https://via.placeholder.com/300x200"}
                  alt={service.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg text-gray-900">{service.title}</h4>
                  <ul className="list-disc list-inside text-gray-700 mt-2 text-sm space-y-1">
                    {service.description?.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">
              No services found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesAdmin;
