import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Eye, Mail, Phone, User, Calendar, Filter, Search, X } from 'lucide-react';
import { supabase } from '../../supabase/supabase';

const ContactManagement = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus]);

  const fetchSubmissions = async () => {
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      setError('Failed to load submissions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Submission deleted successfully!');
      fetchSubmissions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete: ' + err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setSuccess('Status updated successfully!');
      fetchSubmissions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update status: ' + err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.phone.includes(searchTerm) ||
    sub.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage and respond to customer inquiries</p>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
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
            <X className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm flex-1">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 text-sm font-medium appearance-none"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{submissions.filter(s => s.status === 'new').length}</p>
            <p className="text-xs text-gray-600">New</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{submissions.filter(s => s.status === 'read').length}</p>
            <p className="text-xs text-gray-600">Read</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{submissions.filter(s => s.status === 'replied').length}</p>
            <p className="text-xs text-gray-600">Replied</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{submissions.filter(s => s.status === 'archived').length}</p>
            <p className="text-xs text-gray-600">Archived</p>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{submission.full_name}</p>
                          <p className="text-xs text-gray-600 truncate flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {submission.email}
                          </p>
                          <p className="text-xs text-gray-600 truncate flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {submission.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-md">{submission.message}</p>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(submission.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={submission.status}
                        onChange={(e) => handleStatusUpdate(submission.id, e.target.value)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border ${getStatusColor(submission.status)} outline-none cursor-pointer`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedSubmission(submission)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(submission.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-xl font-bold text-gray-900">Submission Details</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedSubmission.full_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                    <div className="mt-1">
                      <span className={`inline-block text-xs font-medium px-3 py-1.5 rounded-full border ${getStatusColor(selectedSubmission.status)}`}>
                        {selectedSubmission.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedSubmission.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</label>
                    <p className="text-sm text-gray-900 mt-1">{formatDate(selectedSubmission.created_at)}</p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Message</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Re: Your inquiry&body=Hi ${selectedSubmission.full_name},%0D%0A%0D%0A`}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedSubmission.id, 'replied');
                      setSelectedSubmission(null);
                    }}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    Mark as Replied
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactManagement;