import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiPlusCircle,
  FiEdit,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const BloodRequestModal = lazy(() => import('../common/BloodRequestModal'));

export const navLinks = [
  { name: 'হোম', path: '/' },
  { name: 'আমাদের সম্পর্কে', path: '/about' },
  { name: 'ডোনার তালিকা', path: '/donors' },
  { name: 'সেবাসমূহ', path: '/services' },
  { name: 'যোগাযোগ', path: '/contact' },
];

const roleLabels = {
  donor: 'ডোনার',
  volunteer: 'স্বেচ্ছাসেবক',
  admin: 'অ্যাডমিন',
};

const getInitial = (name) => Array.from(name || '')[0]?.toUpperCase() || 'U';

const userMenuItems = (user, navigate, closeDropdown, closeMobileMenu) => [
  {
    label: 'ড্যাশবোর্ড',
    icon: FiUser,
    to: `/dashboard/${user?.role || 'donor'}`,
    onClick: () => {
      closeDropdown();
      closeMobileMenu();
    },
  },
  ...(user?.role === 'volunteer'
    ? [
        {
          label: 'প্রফাইল আপডেট',
          icon: FiEdit,
          to: '/profile',
          onClick: () => {
            closeDropdown();
            closeMobileMenu();
          },
        },
      ]
    : []),
  {
    label: 'লগআউট',
    icon: FiLogOut,
    variant: 'danger',
    onClick: async () => {
      closeDropdown();
      closeMobileMenu();
      const { logout } = useAuth();
      await logout();
      navigate('/login');
    },
  },
];

const UserAvatar = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-lg',
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt=""
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white dark:border-gray-800 shadow`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-primary-600 text-white rounded-full flex items-center justify-center font-bold`}>
      {getInitial(user?.name)}
    </div>
  );
};

const ThemeToggle = ({ theme, toggleTheme, ariaLabel = 'থিম পরিবর্তন করুন', className = '' }) => (
  <button
    onClick={toggleTheme}
    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors ${className}`}
    aria-label={ariaLabel}
  >
    {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
  </button>
);

const RequestButton = ({ onClick, variant = 'desktop', className = '' }) => {
  const baseClasses = 'flex items-center gap-2 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-shadow';
  const variants = {
    desktop: 'btn-primary py-2 px-4 text-sm',
    mobile: 'btn-primary py-1.5 px-3 text-xs',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <FiPlusCircle size={variant === 'desktop' ? 17 : 14} />
      <span>{variant === 'desktop' ? 'রক্তের আবেদন' : 'আবেদন'}</span>
    </button>
  );
};

const NavItem = ({ link, isMobile = false }) => (
  <NavLink
    key={link.path}
    to={link.path}
    className={({ isActive }) =>
      `font-medium transition-colors ${isActive
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
      }${isMobile ? ' block' : ''}`
    }
  >
    {link.name}
  </NavLink>
);

const UserMenu = ({
  user,
  dropdownOpen,
  setDropdownOpen,
  isOpen,
  setIsOpen,
  navigate,
}) => {
  const dropdownRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    const { logout } = useAuth();
    await logout();
    navigate('/login');
  };

  const closeAll = () => {
    setDropdownOpen(false);
    setIsOpen(false);
  };

  const items = userMenuItems(user, navigate, setDropdownOpen, setIsOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={menuButtonRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label={dropdownOpen ? 'ব্যবহারকারী মেনু বন্ধ করুন' : 'ব্যবহারকারী মেনু খুলুন'}
      >
        <UserAvatar user={user} />
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {user?.name || 'ব্যবহারকারী'}
        </span>
        <FiChevronDown
          className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
            role="menu"
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              if (item.variant === 'danger') {
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
                      isLast ? '' : 'border-b border-gray-100 dark:border-gray-800'
                    }`}
                    role="menuitem"
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={item.onClick}
                  className={`flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    isLast ? '' : 'border-b border-gray-100 dark:border-gray-800'
                  }`}
                  role="menuitem"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileUserMenu = ({ user, isOpen, setIsOpen, navigate }) => {
  const closeAll = () => setIsOpen(false);

  const items = userMenuItems(user, navigate, () => {}, setIsOpen);

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
      {user ? (
        <>
          <div className="mb-4 flex items-center gap-3">
            <UserAvatar user={user} size="lg" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {user?.name || 'ব্যবহারকারী'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {roleLabels[user?.role] || user?.role || 'ডোনার'}
              </div>
            </div>
          </div>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            if (item.variant === 'danger') {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`block w-full text-left py-2 ${
                    isLast ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={item.onClick}
                className={`block w-full text-left py-2 ${
                  isLast ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            onClick={closeAll}
            className="btn-outline text-center py-2"
          >
            লগইন
          </Link>
          <Link
            to="/register"
            onClick={closeAll}
            className="btn-primary text-center py-2"
          >
            রেজিস্ট্রেশন
          </Link>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const closeMobileMenu = useCallback(() => setIsOpen(false), []);
  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  useEffect(() => {
    closeMobileMenu();
    closeDropdown();
  }, [location.pathname, closeMobileMenu, closeDropdown]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeMobileMenu();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeMobileMenu]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        closeDropdown();
        setIsRequestModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeMobileMenu, closeDropdown]);

  const openRequestModal = useCallback(() => {
    setIsRequestModalOpen(true);
    closeMobileMenu();
  }, [closeMobileMenu]);

  if (authLoading) {
    return (
      <nav
        className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800 transition-colors duration-300"
        aria-label="প্রধান মেনু"
        role="navigation"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2" aria-label="PBDG হোম">
            <img src="/icons/logo.png" alt="" className="w-16 h-16" width={64} height={64} />
            <span className="bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
              PBDG
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800 transition-colors duration-300"
        aria-label="প্রধান মেনু"
        role="navigation"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2" aria-label="PBDG হোম">
            <img src="/icons/logo.png" alt="" className="w-16 h-16" width={64} height={64} />
            <span className="bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
              PBDG
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex space-x-6" role="menubar">
              {navLinks.map((link) => (
                <li key={link.path} role="none">
                  <NavItem link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <RequestButton onClick={openRequestModal} variant="desktop" />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {user ? (
              <UserMenu
                user={user}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                navigate={navigate}
              />
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
          <div className="lg:hidden flex items-center gap-2">
            <RequestButton onClick={openRequestModal} variant="mobile" />
            <ThemeToggle
              theme={theme}
              toggleTheme={toggleTheme}
              ariaLabel="থিম পরিবর্তন করুন"
              className="p-2"
            />
            <button
              ref={menuButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
              aria-label={isOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              ref={mobileMenuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
              role="navigation"
              aria-label="মোবাইল মেনু"
            >
              <div className="px-4 py-4 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
                <ul role="menubar">
                  {navLinks.map((link) => (
                    <li key={link.path} role="none">
                      <NavLink
                        to={link.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block font-medium py-2 ${isActive
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <MobileUserMenu
                  user={user}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  navigate={navigate}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Blood Request Modal */}
      <Suspense fallback={null}>
        <BloodRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      </Suspense>
    </>
  );
};

export default Navbar;