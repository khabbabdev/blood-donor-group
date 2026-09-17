import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & About */}
          <div>
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 mb-4">
              <img src="https://i.ibb.co.com/HfXHYvd7/logo.png" alt="logo" className="text-primary-600 w-32 h-32" />
              <span className="bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
                পানিতলাহাট ব্লাড ডোনার গ্রুপ
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              আমাদের লক্ষ্য হলো জরুরি মুহূর্তে মুমূর্ষু রোগীর জন্য রক্তের ব্যবস্থা করা এবং মানুষকে রক্তদানে উৎসাহিত করা। একটি রক্তদান বাঁচাতে পারে একটি প্রাণ।
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/groups/922964054200071/?ref=share&rdid=jPAT9u95Xr1fDx02&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F19DVRZX2rP%2F" target='_blank' className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors">
                <FiFacebook />
              </a>
              <a href="https://www.facebook.com/groups/922964054200071/?ref=share&rdid=jPAT9u95Xr1fDx02&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F19DVRZX2rP%2F" target='_blank' className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors">
                <FiTwitter />
              </a>
              <a href="https://www.facebook.com/groups/922964054200071/?ref=share&rdid=jPAT9u95Xr1fDx02&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F19DVRZX2rP%2F" target='_blank' className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors">
                <FiInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">গুরুত্বপূর্ণ লিংক</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">হোম</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">আমাদের সম্পর্কে</Link>
              </li>
              <li>
                <Link to="/donors" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">ডোনার তালিকা</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">সেবাসমূহ</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">যোগাযোগ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">পানিতলাহাট, গোবিন্দগঞ্জ, গাইবান্ধা।</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary-600 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">(বোরহান) ০১৭১১-৬০৬৮৬৩</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary-600 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">(আবু হাসান) ০১৩১২-৩০৬৩০৯</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary-600 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">sk.khabbab50@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Notice */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">জরুরি প্রয়োজনে</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              জরুরি রক্তের প্রয়োজনে আমাদের হটলাইনে যোগাযোগ করুন অথবা ওয়েবসাইট থেকে রক্ত খুঁজুন।
            </p>
            <Link to="/donors" className="btn-primary w-full text-center block">
              রক্ত খুঁজুন
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            &copy;  2026 - {new Date().getFullYear()} পানিতলাহাট ব্লাড ডোনার গ্রুপ (PBDG). সর্বস্বত্ব সংরক্ষিত 🩸 Developed by <a href="https://khabbabdev.github.io/khabbab-programmer/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-600 transition-colors">Khabbab.dev</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
