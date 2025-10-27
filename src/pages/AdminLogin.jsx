import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase/supabase';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (resetError) throw resetError;
      setSuccess('Password reset email sent! Please check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="SustainEco" className="h-16 w-auto" />
          </div>
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            {mode === 'login' ? 'Admin Login' : 'Reset Password'}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {mode === 'login'
              ? 'Enter your credentials to access the admin panel'
              : 'Enter your email to receive a password reset link'}
          </p>
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 text-green-700 text-sm"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}
          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleForgotPassword}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-200" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sustaineco.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
            {/* Password (only in login mode) */}
            {mode === 'login' && (
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            )}
            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-diag text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Send Reset Link'}
            </motion.button>
          </form>
          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <button
                onClick={() => {
                  setMode('forgot');
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors"
              >
                Forgot your password?
              </button>
            ) : (
              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors"
              >
                Back to Login
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
