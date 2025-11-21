import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already admin
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if email is admin email
    const adminEmails = ['admin@mindease.com', 'admin@mind.com', 'devansh@mindease.com', 'jasica@kaur.com', 'devansh@gupta.com'];
    if (!adminEmails.includes(email.toLowerCase())) {
      toast.error('Access denied. This login is for administrators only.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      if (error.message.includes('Firebase authentication is not configured')) {
        toast.error('Authentication is currently in demo mode. Please contact support to enable full authentication.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('Admin account not found');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect admin password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-100 via-orange-100 to-yellow-100 p-4 pt-16 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-red-200/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism card */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Shield icon and title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              className="inline-block mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <FaShieldAlt className="text-6xl text-red-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Access</h1>
            <p className="text-gray-600">Authorized personnel only</p>
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 font-medium">Admin Login Required</p>
              <p className="text-xs text-red-600 mt-1">Use admin@mindease.com or similar admin email</p>
            </div>
          </motion.div>

          {/* Admin login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="admin@mindease.com"
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Password input */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Admin Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Access Admin Panel'
              )}
            </motion.button>
          </form>

          {/* Back to regular login */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-gray-600">
              Not an administrator?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-red-600 font-semibold hover:underline"
              >
                Regular Login
              </button>
            </p>
          </motion.div>

          {/* Admin info */}
          <motion.div variants={itemVariants} className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Authorized Admin Emails:</h3>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• admin@mindease.com</li>
              <li>• admin@mind.com</li>
              <li>• devansh@mindease.com</li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
