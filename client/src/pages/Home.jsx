import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiDroplet, FiUsers, FiHeart, FiActivity, FiChevronDown, FiPlusCircle } from 'react-icons/fi';
import SectionHeader from '../components/common/SectionHeader';
import StatCard from '../components/common/StatCard';
import BloodRequestModal from '../components/common/BloodRequestModal';
import HeroBackground from '../components/common/HeroBackground';
import { donorAPI } from '../services/api';
import { BLOOD_GROUPS, DISTRICTS } from '../utils/constants';

const Home = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalDonors: 0,
    availableDonors: 0,
    bloodGroupStats: {}
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await donorAPI.getStats();
        if (res.data?.success) {
          setStats({
            totalDonors: res.data.totalDonors || 0,
            availableDonors: res.data.availableDonors || 0,
            bloodGroupStats: res.data.bloodGroupStats || {}
          });
        }
      } catch (err) {
        console.error('Failed to fetch home stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedGroup) params.append('bloodGroup', selectedGroup);
    if (selectedDistrict) params.append('district', selectedDistrict);
    navigate(`/donors?${params.toString()}`);
  };

  const faqs = [
    {
      q: 'কে রক্ত দিতে পারবে?',
      a: '১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ মানুষ, যার ওজন অন্তত ৫০ কেজি, তিনি রক্ত দিতে পারবেন।'
    },
    {
      q: 'রক্তদানের পর কতদিন অপেক্ষা করতে হবে?',
      a: 'একজন পুরুষ প্রতি ৩ মাস অন্তর এবং একজন নারী প্রতি ৪ মাস অন্তর রক্ত দিতে পারেন।'
    },
    {
      q: 'রক্তদান কি নিরাপদ?',
      a: 'হ্যাঁ, রক্তদান সম্পূর্ণ নিরাপদ। রক্তদানের জন্য ব্যবহৃত সব সুই এবং ব্যাগ জীবাণুমুক্ত এবং একবার ব্যবহারের পর ফেলে দেওয়া হয়।'
    },
    {
      q: 'রক্তদানের আগে কি কি করণীয়?',
      a: 'রক্তদানের আগে পর্যাপ্ত ঘুমান, পুষ্টিকর খাবার খান এবং প্রচুর পরিমাণ পানি পান করুন। খালি পেটে রক্ত দেওয়া উচিত নয়।'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-950">
        <HeroBackground />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-sm font-semibold mb-6 hero-glow"
              >
                জীবন বাঁচাতে এগিয়ে আসুন
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              >
                রক্ত দিন, <span className="text-primary-600">জীবন বাঁচান</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
              >
                একটি রক্তদান, একটি নতুন জীবন। আমাদের সাথে যুক্ত হোন এবং মানবতার সেবায় এগিয়ে আসুন। আপনার এক ফোঁটা রক্ত হতে পারে কারো বেঁচে থাকার আশা।
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/register" className="btn-primary text-lg px-8 py-3.5">
                  ডোনার হোন
                </Link>
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="btn-secondary text-lg px-8 py-3.5 flex items-center justify-center gap-2"
                >
                  <FiPlusCircle /> রক্তের আবেদন জানান
                </button>
                <Link to="/donors" className="btn-outline text-lg px-8 py-3.5 bg-white dark:bg-transparent">
                  রক্ত খুঁজুন
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="relative -mt-16 z-20 container mx-auto px-4 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 p-6 md:p-8 max-w-5xl mx-auto"
        >
          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">রক্তের গ্রুপ</label>
              <div className="relative">
                <select 
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="input-field appearance-none pr-10"
                >
                  <option value="">সকল গ্রুপ</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">জেলা</label>
              <div className="relative">
                <select 
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="input-field appearance-none pr-10"
                >
                  <option value="">সকল জেলা</option>
                  {DISTRICTS.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full h-[50px] flex items-center justify-center gap-2">
                <FiSearch /> রক্ত খুঁজুন
              </button>
            </div>
          </form>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={FiUsers} count={stats.totalDonors || 50} label="নিবন্ধিত ডোনার" color="primary" />
            <StatCard icon={FiActivity} count={stats.availableDonors || 35} label="প্রস্তুত ডোনার" color="blue" />
            <StatCard icon={FiDroplet} count={120} label="সফল রক্তদান" color="green" />
            <StatCard icon={FiHeart} count={115} label="জীবন বাঁচানো" color="orange" />
          </div>
        </div>
      </section>

      {/* Blood Groups */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="রক্তের গ্রুপ অনুযায়ী খুঁজুন" 
            subtitle="আপনার প্রয়োজনীয় রক্তের গ্রুপ নির্বাচন করে সহজেই ডোনার খুঁজে নিন"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {BLOOD_GROUPS.map((bg, index) => {
              const count = stats.bloodGroupStats[bg] || 0;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  key={bg}
                >
                  <Link to={`/donors?bloodGroup=${encodeURIComponent(bg)}`} className="card-hover flex flex-col items-center justify-center py-8 gap-4 text-center group">
                    <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                      {bg}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">ব্লাড গ্রুপ {bg}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {count > 0 ? `${count} জন ডোনার` : 'ডোনার খুঁজুন'}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader 
            title="সচরাচর জিজ্ঞাসিত প্রশ্ন" 
            subtitle="রক্তদান সম্পর্কে আপনার মনের সব প্রশ্নের উত্তর"
          />
          <div className="space-y-4 mt-10">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900 dark:text-white">
                  {faq.q}
                  <FiChevronDown className="transition-transform duration-300 group-open:-rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden bg-primary-600 dark:bg-primary-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">আজই আমাদের সাথে যুক্ত হোন</h2>
          <p className="text-primary-100 mb-10 max-w-2xl mx-auto text-lg">
            আপনার একটি ছোট সিদ্ধান্ত বাঁচিয়ে দিতে পারে একটি মুমূর্ষু প্রাণ। আজই ডোনার হিসেবে রেজিস্ট্রেশন করুন অথবা রক্তের আবেদন জানান।
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="inline-block bg-white text-primary-600 font-bold py-3.5 px-8 rounded-lg shadow-xl hover:bg-gray-50 transition-colors">
              রেজিস্ট্রেশন করুন
            </Link>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="inline-block bg-primary-700 text-white font-bold py-3.5 px-8 rounded-lg shadow-xl hover:bg-primary-800 border border-white/20 transition-colors"
            >
              রক্তের আবেদন জানান
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      <BloodRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
};

export default Home;
