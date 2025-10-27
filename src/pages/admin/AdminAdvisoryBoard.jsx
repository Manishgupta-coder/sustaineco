import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import { Pencil, Trash2, Upload, UserRound } from "lucide-react";

const AdminAdvisoryBoard = () => {
  const [advisors, setAdvisors] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    title: "",
    description: "",
    imageFile: null,
    imagePreview: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch advisors
  const fetchAdvisors = async () => {
    const { data, error } = await supabase
      .from("advisory_board")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.error(error);
    else setAdvisors(data);
  };

  useEffect(() => {
    fetchAdvisors();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files?.length > 0) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Upload image to Supabase Storage
  const uploadImage = async (file) => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("advisory_board")
      .upload(fileName, file);
    if (error) {
      console.error("Image upload failed:", error.message);
      return null;
    }
    const { data: publicUrl } = supabase.storage
      .from("advisory_board")
      .getPublicUrl(fileName);
    return publicUrl.publicUrl;
  };

  // ✅ Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = formData.imagePreview;

    if (formData.imageFile) {
      const uploadedUrl = await uploadImage(formData.imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const payload = {
      name: formData.name,
      title: formData.title,
      description: formData.description,
      image_url: imageUrl,
    };

    if (formData.id) {
      const { error } = await supabase
        .from("advisory_board")
        .update(payload)
        .eq("id", formData.id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase.from("advisory_board").insert([payload]);
      if (error) console.error(error);
    }

    setFormData({
      id: null,
      name: "",
      title: "",
      description: "",
      imageFile: null,
      imagePreview: "",
    });
    setLoading(false);
    fetchAdvisors();
  };

  // ✅ Edit
  const handleEdit = (advisor) => {
    setFormData({
      id: advisor.id,
      name: advisor.name,
      title: advisor.title,
      description: advisor.description,
      imageFile: null,
      imagePreview: advisor.image_url,
    });
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advisor?")) return;
    const { error } = await supabase.from("advisory_board").delete().eq("id", id);
    if (error) console.error(error);
    fetchAdvisors();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Manage Advisory Board
      </h2>

      {/* ✅ Form Section */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
          {formData.id ? "Edit Advisory Member" : "Add New Advisory Member"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title or role"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description *
            </label>
            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter short description or bio"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200">
                <Upload size={18} />
                <span>{formData.imageFile ? formData.imageFile.name : "Upload Image"}</span>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md"
            >
              {loading
                ? "Saving..."
                : formData.id
                ? "Update Advisor"
                : "Add Advisor"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Advisor Cards - Gradient Style */}
      <div className="max-w-6xl mx-auto mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Advisory Board Members</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {advisors.length > 0 ? (
            advisors.map((advisor) => (
              <div
                key={advisor.id}
                className="rounded-2xl shadow-lg bg-gradient-to-b from-sky-500 to-blue-600 text-white text-center p-6 flex flex-col items-center"
              >
                {advisor.image_url ? (
                  <img
                    src={advisor.image_url}
                    alt={advisor.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center mb-4">
                    <UserRound size={36} className="text-white opacity-90" />
                  </div>
                )}

                <h4 className="text-lg font-bold mb-1">{advisor.name}</h4>
                <p className="text-sm font-medium mb-3 opacity-90">
                  {advisor.title}
                </p>
                <p className="text-sm opacity-90 leading-relaxed">
                  {advisor.description}
                </p>

                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => handleEdit(advisor)}
                    className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-100 flex items-center gap-1 text-sm font-medium"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(advisor.id)}
                    className="bg-white text-red-600 px-3 py-1 rounded-md hover:bg-gray-100 flex items-center gap-1 text-sm font-medium"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              No advisory members found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAdvisoryBoard;
