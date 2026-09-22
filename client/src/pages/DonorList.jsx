import React, { useState, useEffect, useId } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import DonorCard from '../components/common/DonorCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { donorAPI } from '../services/api';
import { 
  FiSearch, 
  FiFilter, 
  FiRefreshCw, 
  FiAlertCircle, 
  FiChevronLeft, 
  FiChevronRight,
  FiUsers
} from 'react-icons/fi';

import { BLOOD_GROUPS, DISTRICTS, DEMO_DONORS } from '../utils/constants';

// Helper to convert English digits to Bengali digits
const toBnNum = (num) => {
  if (num === undefined || num === null) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
};

// Generates smart pagination range with ellipsis (e.g., [1, '...', 4, 5, 6, '...', 10])
const getPaginationItems = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
};

const PAGE_LIMIT = 12;

const DonorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(searchParams.get('bloodGroup') || '');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDonors, setTotalDonors] = useState(0);

  // Sync with URL params on navigation
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page')) || 1;
    const bgFromUrl = searchParams.get('bloodGroup') || '';
    const distFromUrl = searchParams.get('district') || '';
    const searchFromUrl = searchParams.get('search') || '';

    setCurrentPage(pageFromUrl);
    setSelectedBloodGroup(bgFromUrl);
    setSelectedDistrict(distFromUrl);
    setSearchTerm(searchFromUrl);

    fetchDonors(pageFromUrl, bgFromUrl, distFromUrl, searchFromUrl);
  }, [searchParams]);

  const fallbackDemo = (pageToFetch, bg, dist, search) => {
    const filteredDemo = DEMO_DONORS.filter(d => {
      const matchBg = !bg || d.bloodGroup === bg;
      const matchDist = !dist || d.district.includes(dist);
      const matchSearch = !search || 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.district.includes(search);
      return matchBg && matchDist && matchSearch;
    });

    const total = filteredDemo.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
    const safePage = Math.min(Math.max(1, pageToFetch), pages);
    const start = (safePage - 1) * PAGE_LIMIT;

    setTotalDonors(total);
    setTotalPages(pages);
    setCurrentPage(safePage);
    setDonors(filteredDemo.slice(start, start + PAGE_LIMIT));
  };

  const fetchDonors = async (pageToFetch, bg, dist, search) => {
    setLoading(true);
    try {
      const params = {
        page: pageToFetch,
        limit: PAGE_LIMIT,
      };
      if (bg) params.bloodGroup = bg;
      if (dist) params.district = dist;
      if (search) params.search = search;

      const res = await donorAPI.getAll(params);

      // If backend successfully responded
      if (res.data?.success) {
        setDonors(res.data.donors || []);
        const total = res.data.total !== undefined ? res.data.total : (res.data.donors?.length || 0);
        setTotalDonors(total);
        setTotalPages(res.data.totalPages || Math.max(1, Math.ceil(total / PAGE_LIMIT)));
        setCurrentPage(res.data.currentPage || pageToFetch);
      } else if (res.data?.donors && Array.isArray(res.data.donors)) {
        setDonors(res.data.donors);
        const total = res.data.total || res.data.donors.length;
        setTotalDonors(total);
        setTotalPages(res.data.totalPages || Math.max(1, Math.ceil(total / PAGE_LIMIT)));
      } else {
        fallbackDemo(pageToFetch, bg, dist, search);
      }
    } catch (err) {
      // Offline / network failure: fallback to demo donors with pagination
      console.warn('Backend unavailable, falling back to demo donors:', err.message);
      fallbackDemo(pageToFetch, bg, dist, search);
    } finally {
      setLoading(false);
    }
  };

  const updateFiltersAndPage = (newBg, newDist, newSearch, newPage = 1) => {
    const params = {};
    if (newBg) params.bloodGroup = newBg;
    if (newDist) params.district = newDist;
    if (newSearch) params.search = newSearch;
    if (newPage > 1) params.page = newPage;
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFiltersAndPage(selectedBloodGroup, selectedDistrict, searchTerm, 1);
  };

  const handleBloodGroupChange = (e) => {
    const val = e.target.value;
    setSelectedBloodGroup(val);
    updateFiltersAndPage(val, selectedDistrict, searchTerm, 1);
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setSelectedDistrict(val);
    updateFiltersAndPage(selectedBloodGroup, val, searchTerm, 1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedBloodGroup('');
    setSelectedDistrict('');
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    updateFiltersAndPage(selectedBloodGroup, selectedDistrict, searchTerm, page);
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionHeader 
          title="ডোনার তালিকা" 
          subtitle="আপনার প্রয়োজনীয় রক্তের গ্রুপের বিশ্বস্ত ও প্রস্তুত ডোনার খুঁজে নিন" 
        />
        
        {/* Filters */}
        <form onSubmit={handleSearchSubmit} className="card p-5 mb-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="নাম বা এলাকা দিয়ে খুঁজুন..." 
                className="input-field pl-10" 
              />
            </div>
            
            <div>
              <select 
                value={selectedBloodGroup} 
                onChange={handleBloodGroupChange}
                className="input-field"
              >
                <option value="">সকল রক্তের গ্রুপ</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <select 
                value={selectedDistrict} 
                onChange={handleDistrictChange}
                className="input-field"
              >
                <option value="">সকল জেলা</option>
                {DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button 
                type="submit" 
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
              >
                <FiFilter /> ফিল্টার
              </button>
              {(selectedBloodGroup || selectedDistrict || searchTerm || currentPage > 1) && (
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="btn-secondary px-3.5 py-3 text-sm flex items-center justify-center"
                  title="ফিল্টার রিসেট করুন"
                >
                  <FiRefreshCw />
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Status bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
            <FiUsers className="text-primary-600" />
            <span>
              মোট ডোনার পাওয়া গেছে: <strong className="text-primary-600 dark:text-primary-400">{toBnNum(totalDonors)}</strong> জন
            </span>
            {totalPages > 1 && (
              <span className="text-gray-400 dark:text-gray-500">
                • পৃষ্ঠা {toBnNum(currentPage)} / {toBnNum(totalPages)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedBloodGroup && (
              <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 font-semibold px-2.5 py-1 rounded-full">
                গ্রুপ: {selectedBloodGroup}
              </span>
            )}
            {selectedDistrict && (
              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-2.5 py-1 rounded-full">
                জেলা: {selectedDistrict}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-500 dark:text-gray-400">ডোনারদের তথ্য লোড করা হচ্ছে...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="card p-12 text-center max-w-md mx-auto my-8">
            <FiAlertCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">কোনো ডোনার পাওয়া যায়নি</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              আপনার ফিল্টার অনুযায়ী কোনো ডোনার খুঁজে পাওয়া যায়নি। অনুগ্রহ করে অন্য রক্তের গ্রুপ বা জেলা নির্বাচন করুন।
            </p>
            <button onClick={handleReset} className="btn-primary py-2 px-6 text-sm">
              সব ডোনার দেখুন
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {donors.map((donor, idx) => (
                <DonorCard key={donor._id || donor.id || idx} donor={donor} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav 
                aria-label="ডোনার তালিকা পেজিনেশন" 
                className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-800"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
                  মোট <span className="font-semibold text-gray-900 dark:text-white">{toBnNum(totalDonors)}</span> জনের মধ্যে{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {toBnNum((currentPage - 1) * PAGE_LIMIT + 1)}-{toBnNum(Math.min(currentPage * PAGE_LIMIT, totalDonors))}
                  </span>{' '}
                  দেখানো হচ্ছে (পৃষ্ঠা {toBnNum(currentPage)} / {toBnNum(totalPages)})
                </p>

                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-sm"
                    aria-label="পূর্ববর্তী পৃষ্ঠা"
                  >
                    <FiChevronLeft />
                    <span className="hidden sm:inline">পূর্ববর্তী</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {paginationItems.map((item, index) => {
                      if (item === '...') {
                        return (
                          <span 
                            key={`ellipsis-${index}`} 
                            className="px-2.5 py-2 text-gray-400 dark:text-gray-500 select-none text-sm font-semibold"
                          >
                            ...
                          </span>
                        );
                      }

                      const isCurrent = item === currentPage;
                      return (
                        <button
                          key={`page-${item}`}
                          type="button"
                          onClick={() => handlePageChange(item)}
                          disabled={loading}
                          aria-current={isCurrent ? 'page' : undefined}
                          className={`min-w-[38px] h-9 px-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${
                            isCurrent
                              ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/40 ring-2 ring-primary-600 ring-offset-2 dark:ring-offset-gray-900'
                              : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                          }`}
                        >
                          {toBnNum(item)}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-sm"
                    aria-label="পরবর্তী পৃষ্ঠা"
                  >
                    <span className="hidden sm:inline">পরবর্তী</span>
                    <FiChevronRight />
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DonorList;
