import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight,
} from 'react-icons/fi';
import SectionHeader from '../../../components/common/SectionHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import BloodGroupBadge from '../../../components/common/BloodGroupBadge';
import { donorAPI } from '../../../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const DonorManagement = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBloodGroup) params.bloodGroup = selectedBloodGroup;
      if (searchTerm) params.search = searchTerm;

      const res = await donorAPI.getAll(params);
      setDonors(res.data?.donors || res.data || []);
    } catch (err) {
      console.error('Failed to fetch donors', err);
      toast.error('ডোনার তালিকা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodGroup]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`আপনি কি ${name} ডোনারটি মুছে ফেলতে চান?`)) return;
    try {
      await donorAPI.remove(id);
      setDonors((prev) => prev.filter((d) => (d._id || d.id) !== id));
      toast.success('ডোনার মুছে ফেলা হয়েছে');
    } catch (err) {
      toast.error('ডোনার মুছে ফেলতে ব্যর্থ হয়েছে');
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await donorAPI.toggleAvailability(id);
      setDonors((prev) =>
        prev.map((d) =>
          (d._id || d.id) === id
            ? { ...d, isAvailable: d.isAvailable !== false ? false : true }
            : d,
        ),
      );
    } catch (err) {
      toast.error('অবস্থা আপডেট করতে ব্যর্থ হয়েছে');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedBloodGroup('');
    fetchDonors();
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionHeader
          title="ডোনার ম্যানেজমেন্ট"
          subtitle="ডোনার যুক্ত, আপডেট বা মুছে ফেলতে পারেন"
          centered={false}
        />

        <div className="flex justify-between items-center mb-6">
          <Link
            to="/dashboard/volunteer/donors/add"
            className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm font-semibold"
          >
            <FiPlus size={17} />
            ডোনার যুক্ত করুন
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="card p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
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
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                <FiSearch /> খুজুন
              </button>
              {(selectedBloodGroup || searchTerm) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-outline px-3.5 py-2.5 text-sm flex items-center justify-center"
                  title="রিসেট"
                >
                  <FiRefreshCw />
                </button>
              )}
            </div>
          </div>
        </form>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          মোট ডোনার:{' '}
          <span className="font-bold text-primary-600 dark:text-primary-400">
            {donors.length} জন
          </span>
        </p>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : donors.length === 0 ? (
          <div className="card p-12 text-center max-w-md mx-auto my-8">
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              কোনো ডোনার পাওয়া যায়নি।
            </p>
            <Link
              to="/dashboard/volunteer/donors/add"
              className="btn-primary py-2 px-6 text-sm inline-flex items-center gap-2"
            >
              <FiPlus /> প্রথম ডোনার যুক্ত করুন
            </Link>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    নাম
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    গ্রুপ
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    ফোন
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    ঠিকানা
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    অবস্থা
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-right">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {donors.map((donor) => {
                  const donorId = donor._id || donor.id;
                  const name = donor.name || donor.userId?.name || 'অজ্ঞাত';
                  const phone =
                    donor.phone || donor.userId?.phone || '—';
                  const address =
                    donor.address ||
                    (typeof donor.userId?.address === 'object'
                      ? donor.userId.address.district
                      : donor.userId?.address) ||
                    '—';
                  const group = donor.bloodGroup || 'A+';
                  const isAvailable = donor.isAvailable !== false;
                  return (
                    <tr
                      key={donorId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {name}
                      </td>
                      <td className="px-4 py-3">
                        <BloodGroupBadge group={group} />
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {phone}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {address}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            isAvailable
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          ></span>
                          {isAvailable ? 'প্রস্তুত' : 'অপ্রস্তুত'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleToggleAvailability(donorId)}
                            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            title={
                              isAvailable ? 'অপ্রস্তুত করুন' : 'প্রস্তুত করুন'
                            }
                          >
                            {isAvailable ? (
                              <FiToggleRight size={17} />
                            ) : (
                              <FiToggleLeft size={17} />
                            )}
                          </button>
                          <Link
                            to={`/dashboard/volunteer/donors/${donorId}/edit`}
                            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            title="এডিট"
                          >
                            <FiEdit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(donorId, name)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="মুছে ফেলুন"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorManagement;
