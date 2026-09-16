import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import DonorCard from '../components/common/DonorCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { donorAPI } from '../services/api';
import { FiSearch, FiFilter, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

import { BLOOD_GROUPS, DISTRICTS, DEMO_DONORS } from '../utils/constants';

const DonorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBloodGroup = searchParams.get('bloodGroup') || '';
  const initialDistrict = searchParams.get('district') || '';
  const initialSearch = searchParams.get('search') || '';

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(initialBloodGroup);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodGroup, selectedDistrict]);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBloodGroup) params.bloodGroup = selectedBloodGroup;
      if (selectedDistrict) params.district = selectedDistrict;
      if (searchTerm) params.search = searchTerm;

      const res = await donorAPI.getAll(params);
      if (res.data?.donors && res.data.donors.length > 0) {
        setDonors(res.data.donors);
      } else {
        // Filter demo donors as fallback
        const filteredDemo = DEMO_DONORS.filter(d => {
          const matchBg = !selectedBloodGroup || d.bloodGroup === selectedBloodGroup;
          const matchDist = !selectedDistrict || d.district.includes(selectedDistrict);
          const matchSearch = !searchTerm || d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.district.includes(searchTerm);
          return matchBg && matchDist && matchSearch;
        });
        setDonors(filteredDemo);
      }
    } catch (err) {
      // Offline / API error: use demo donors
      const filteredDemo = DEMO_DONORS.filter(d => {
        const matchBg = !selectedBloodGroup || d.bloodGroup === selectedBloodGroup;
        const matchDist = !selectedDistrict || d.district.includes(selectedDistrict);
        const matchSearch = !searchTerm || d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.district.includes(searchTerm);
        return matchBg && matchDist && matchSearch;
      });
      setDonors(filteredDemo);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (selectedBloodGroup) newParams.bloodGroup = selectedBloodGroup;
    if (selectedDistrict) newParams.district = selectedDistrict;
    if (searchTerm) newParams.search = searchTerm;
    setSearchParams(newParams);
    fetchDonors();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedBloodGroup('');
    setSelectedDistrict('');
    setSearchParams({});
  };

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
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
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
                onChange={(e) => setSelectedDistrict(e.target.value)}
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
              {(selectedBloodGroup || selectedDistrict || searchTerm) && (
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
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            মোট ডোনার পাওয়া গেছে: <span className="font-bold text-primary-600 dark:text-primary-400">{donors.length} জন</span>
          </p>
          {selectedBloodGroup && (
            <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 font-semibold px-2.5 py-1 rounded-full">
              গ্রুপ: {selectedBloodGroup}
            </span>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : donors.length === 0 ? (
          <div className="card p-12 text-center max-w-md mx-auto my-8">
            <FiAlertCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">কোনো ডোনার পাওয়া যায়নি</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              আপনার ফিল্টার অনুযায়ী কোনো ডোনার পাওয়া যায়নি। অনুগ্রহ করে অন্য গ্রুপ বা এলাকা দিয়ে চেষ্টা করুন।
            </p>
            <button onClick={handleReset} className="btn-primary py-2 px-6 text-sm">
              সব ডোনার দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {donors.map((donor, idx) => (
              <DonorCard key={donor._id || donor.id || idx} donor={donor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorList;
