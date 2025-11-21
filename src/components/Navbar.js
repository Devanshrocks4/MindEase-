import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  FaBrain, 
  FaHome, 
  FaChartLine, 
  FaComments, 
  FaUserShield, 
  FaSignInAlt, 
  FaUserPlus, 
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
      setIsProfileOpen(false);
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Dashboard', path: '/dashboard', icon: FaChartLine },
    { name: 'Chat', path: '/chat', icon: FaComments },
    { name: 'Find Help', path: '/counselors', icon: FaUserShield },
    { name: 'Admin', path: '/admin', icon: FaUserShield },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <FaBrain className="text-3xl text-indigo-600" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MindEase
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="text-lg" />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              </Link>
            ))}
          </div>

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser />
                  <span className="font-medium">
                    {currentUser.displayName || 'User'}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <Link to="/profile">
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                        >
                          <FaUser className="text-gray-600" />
                          <span>Profile</span>
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2 text-red-600"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUserPlus />
                    <span>Sign Up</span>
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl text-gray-700" />
            ) : (
              <FaBars className="text-2xl text-gray-700" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path}>
                  <motion.button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="text-lg" />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-600">
                      Signed in as <span className="font-semibold">{currentUser.displayName || currentUser.email}</span>
                    </div>
                    <Link to="/profile">
                      <motion.button
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaUser />
                        <span className="font-medium">Profile</span>
                      </motion.button>
                    </Link>
                    <motion.button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSignOutAlt />
                      <span className="font-medium">Logout</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <motion.button
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaSignInAlt />
                        <span className="font-medium">Login</span>
                      </motion.button>
                    </Link>
                    <Link to="/register">
                      <motion.button
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaUserPlus />
                        <span className="font-medium">Sign Up</span>
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
