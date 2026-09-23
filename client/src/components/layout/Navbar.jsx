import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiPlusCircle, FiEdit } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import BloodRequestModal from '../common/BloodRequestModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'আমাদের সম্পর্কে', path: '/about' },
    { name: 'ডোনার তালিকা', path: '/donors' },
    { name: 'সেবাসমূহ', path: '/services' },
    { name: 'যোগাযোগ', path: '/contact' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <img src="https://i.ibb.co.com/HfXHYvd7/logo.png" alt="logo" className="w-16 h-16" />
            <span className="bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
              PBDG
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `font-medium transition-colors ${isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="btn-primary py-2 px-4 flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <FiPlusCircle size={17} />
              <span>রক্তের আবেদন</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="থিম পরিবর্তন করুন"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'Avatar'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                  )}
                  <span className="font-medium text-gray-700 dark:text-gray-200">{user?.name || 'ব্যবহারকারী'}</span>
                  <FiChevronDown className="text-gray-500" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                    >
                      <Link
                        to={`/dashboard/${user.role}`}
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser /> ড্যাশবোর্ড
                      </Link>
                      {user.role === 'volunteer' && (
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiEdit /> প্রফাইল আপডেট
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FiLogOut /> লগআউট
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-outline py-2 px-4">
                  লগইন
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4">
                  রেজিস্ট্রেশন
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1 font-medium"
            >
              <FiPlusCircle size={14} />
              <span>আবেদন</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block font-medium ${isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                  {user ? (
                    <>
                      <div className="mb-4 flex items-center gap-3">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name || 'Avatar'}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {user?.name ? user.name.charAt(0) : 'U'}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{user?.name || 'ব্যবহারকারী'}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
                        </div>
                      </div>
                      <Link
                        to={`/dashboard/${user.role}`}
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left py-2 text-gray-700 dark:text-gray-300"
                      >
                        ড্যাশবোর্ড
                      </Link>
                      {user.role === 'volunteer' && (
                        <Link
                          to="/profile"
                          onClick={() => setIsOpen(false)}
                          className="block w-full text-left py-2 text-gray-700 dark:text-gray-300"
                        >
                          প্রফাইল আপডেট
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="block w-full text-left py-2 text-red-600"
                      >
                        লগআউট
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="btn-outline text-center py-2"
                      >
                        লগইন
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="btn-primary text-center py-2"
                      >
                        রেজিস্ট্রেশন
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Blood Request Modal */}
      <BloodRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
