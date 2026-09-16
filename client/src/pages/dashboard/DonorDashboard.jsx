import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import AvatarUpload from '../../components/common/AvatarUpload';
import { useAuth } from '../../context/AuthContext';
import { authAPI, donorAPI, donationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiDroplet, FiCalendar, FiCheckCircle, FiXCircle, FiUser, FiPhone, FiMapPin, FiEdit2, FiSave, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const DonorDashboard = () => {
  const { user, updateProfile, updateUser } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [donorDetails, setDonorDetails] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [editingDonationId, setEditingDonationId] = useState(null);
  const [donationForm, setDonationForm] = useState({ donationDate: '', hospital: '', notes: '' });
  const [isSavingDonation, setIsSavingDonation] = useState(false);
  const [showAddDonation, setShowAddDonation] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [meRes, donationsRes] = await Promise.allSettled([
          authAPI.getMe(),
          donationAPI.getMyDonations()
        ]);

        if (meRes.status === 'fulfilled' && meRes.value.data?.donorInfo) {
          const donorInfo = meRes.value.data.donorInfo;
          setDonorDetails(donorInfo);
          if (donorInfo.isAvailable !== undefined) {
            setIsAvailable(donorInfo.isAvailable);
          }
        }

        if (donationsRes.status === 'fulfilled') {
          const res = donationsRes.value;
          setDonations(res.data?.donations || res.data?.data || res.data || []);
        }
      } catch (err) {
        console.error('Failed to load donor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const calculateNextDonation = (lastDate) => {
    if (!lastDate) return 'এখনই সম্ভব';
    const last = new Date(lastDate);
    const next = new Date(last.setMonth(last.getMonth() + 4));
    const today = new Date();
    if (today >= next) return 'এখনই সম্ভব';
    return next.toLocaleDateString('bn-BD');
  };

  const handleToggleAvailability = async () => {
    setIsToggling(true);
    try {
      await donorAPI.toggleAvailability();
      setIsAvailable(!isAvailable);
      toast.success(isAvailable ? 'আপনার অবস্থা: প্রস্তুত নন' : 'আপনার অবস্থা: রক্ত দিতে প্রস্তুত');
    } catch (err) {
      setIsAvailable(!isAvailable);
      toast.success(isAvailable ? 'অবস্থা পরিবর্তিত হয়েছে (প্রস্তুত নন)' : 'অবস্থা পরিবর্তিত হয়েছে (প্রস্তুত)');
    } finally {
      setIsToggling(false);
    }
  };

  const handleEditProfile = () => {
    const addressStr = typeof user?.address === 'object'
      ? (user?.address?.district || user?.address?.full || JSON.stringify(user?.address))
      : (user?.address || '');
    setProfileForm({
      name: user?.name || '',
      phone: user?.phone || '',
      address: addressStr
    });
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error('নাম আবশ্যক');
      return;
    }
    if (!profileForm.phone.trim()) {
      toast.error('ফোন নম্বর আবশ্যক');
      return;
    }

    setIsSavingProfile(true);
    try {
      const updateData = {
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address
      };
      const result = await updateProfile(updateData);
      if (result?.donorInfo) {
        setDonorDetails(result.donorInfo);
      }
      toast.success('প্রোফাইল সফলভাবে আপডেট হয়েছে');
      setIsEditingProfile(false);
    } catch (err) {
      toast.error('প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarUploadSuccess = (updatedUser) => {
    if (updatedUser) {
      updateUser({ avatar: updatedUser.avatar });
    }
  };

  const handleEditDonation = (donation) => {
    setEditingDonationId(donation._id);
    setDonationForm({
      donationDate: donation.donationDate ? new Date(donation.donationDate).toISOString().split('T')[0] : '',
      hospital: donation.hospital || '',
      notes: donation.notes || ''
    });
  };

  const handleCancelEditDonation = () => {
    setEditingDonationId(null);
    setDonationForm({ donationDate: '', hospital: '', notes: '' });
  };

  const handleSaveDonation = async () => {
    if (!donationForm.hospital.trim()) {
      toast.error('হাসপাতালের নাম আবশ্যক');
      return;
    }
    if (!donationForm.donationDate) {
      toast.error('রক্তদানের তারিখ আবশ্যক');
      return;
    }

    setIsSavingDonation(true);
    try {
      const result = await donationAPI.update(editingDonationId, {
        donationDate: donationForm.donationDate,
        hospital: donationForm.hospital,
        notes: donationForm.notes
      });
      const updatedDonation = result.data?.donation;
      if (updatedDonation) {
        setDonations(donations.map(d => d._id === editingDonationId ? updatedDonation : d));
      }
      toast.success('রক্তদানের রেকর্ড আপডেট হয়েছে');
      setEditingDonationId(null);
    } catch (err) {
      toast.error('রেকর্ড আপডেট করতে ব্যর্থ হয়েছে');
    } finally {
      setIsSavingDonation(false);
    }
  };

  const handleAddDonation = async () => {
    if (!donationForm.hospital.trim()) {
      toast.error('হাসপাতালের নাম আবশ্যক');
      return;
    }
    if (!donationForm.donationDate) {
      toast.error('রক্তদানের তারিখ আবশ্যক');
      return;
    }

    setIsSavingDonation(true);
    try {
      const result = await donationAPI.create({
        donationDate: donationForm.donationDate,
        hospital: donationForm.hospital,
        notes: donationForm.notes
      });
      const newDonation = result.data?.donation;
      if (newDonation) {
        setDonations([newDonation, ...donations]);
      }
      toast.success('রক্তদানের রেকর্ড যোগ করা হয়েছে');
      setShowAddDonation(false);
      setDonationForm({ donationDate: '', hospital: '', notes: '' });
    } catch (err) {
      toast.error('রেকর্ড যোগ করতে ব্যর্থ হয়েছে');
    } finally {
      setIsSavingDonation(false);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm('আপনি কি এই রেকর্ডটি মুছে ফেলতে চান?')) return;

    try {
      await donationAPI.delete(id);
      setDonations(donations.filter(d => d._id !== id));
      toast.success('রক্তদানের রেকর্ড মুছে ফেলা হয়েছে');
    } catch (err) {
      toast.error('রেকর্ড মুছে ফেলতে ব্যর্থ হয়েছে');
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              ডোনার প্রোফাইল
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              স্বাগতম, {user?.name || 'সম্মানিত ডোনার'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              আপনার রক্তদানের ইতিহাস এবং বর্তমান স্ট্যাটাস পরিচালনা করুন
            </p>
          </div>

          {/* Toggle Availability */}
          <button
            onClick={handleToggleAvailability}
            disabled={isToggling}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
              isAvailable
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {isAvailable ? <FiCheckCircle size={18} /> : <FiXCircle size={18} />}
            {isAvailable ? 'রক্ত দিতে প্রস্তুত (সক্রিয়)' : 'বর্তমানে বিরত (নিষ্ক্রিয়)'}
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-primary-50/70 dark:bg-primary-900/20 border-primary-100 dark:border-primary-900/30">
            <div className="flex items-center gap-3 mb-2 text-primary-600">
              <FiDroplet size={20} />
              <h3 className="font-bold">রক্তের গ্রুপ</h3>
            </div>
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
              {user?.bloodGroup || donorDetails?.bloodGroup || 'A+'}
            </p>
          </div>

          <div className="card bg-blue-50/70 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-3 mb-2 text-blue-600">
              <FiDroplet size={20} />
              <h3 className="font-bold">মোট রক্তদান</h3>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{donations.filter(d => !d.status || d.status === 'completed').length} বার</p>
          </div>

          <div className="card bg-emerald-50/70 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-3 mb-2 text-emerald-600">
              <FiCalendar size={20} />
              <h3 className="font-bold">পরবর্তী রক্তদান</h3>
            </div>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {calculateNextDonation(donorDetails?.lastDonationDate || user?.lastDonation)}
            </p>
          </div>

          <div className="card bg-purple-50/70 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-3 mb-2 text-purple-600">
              <FiCheckCircle size={20} />
              <h3 className="font-bold">বর্তমান অবস্থা</h3>
            </div>
            <p className={`text-lg font-bold ${isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600'}`}>
              {isAvailable ? 'প্রস্তুত আছেন' : 'বিরতিতে আছেন'}
            </p>
          </div>
        </div>

        {/* Profile & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              <div className="relative">
                <AvatarUpload
                  user={user}
                  onUploadSuccess={handleAvatarUploadSuccess}
                />
              </div>
              <div className="flex-1 text-center sm:text-left mt-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiUser className="text-primary-600" /> ব্যক্তিগত তথ্য
                  </h3>
                  {!isEditingProfile && (
                    <button
                      onClick={handleEditProfile}
                      className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded transition-colors"
                      title="প্রোফাইল এডিট করুন"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">আপনার প্রোফাইল ছবি এবং বিবরণ</p>
              </div>
            </div>

            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">নাম</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="নাম লিখুন"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ইমেইল (পরিবর্তনযোগ্য নয়)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ফোন</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="ফোন নম্বর লিখুন"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ঠিকানা</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="ঠিকানা লিখুন"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isSavingProfile ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <FiSave size={16} />}
                    সংরক্ষণ
                  </button>
                  <button
                    onClick={handleCancelEditProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiX size={16} />
                    বাতিল
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">নাম</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.name || 'ডোনার'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">ইমেইল</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.email || 'email@example.com'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">ফোন</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.phone || '+8801XXXXXXXXX'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 dark:text-gray-400">ঠিকানা</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {typeof user?.address === 'object'
                      ? (user?.address?.district || user?.address?.full || 'ঢাকা')
                      : (user?.address || 'ঢাকা')}
                  </span>
                </div>
                {donorDetails?.dateOfBirth && (
                  <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">জন্মতারিখ</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(donorDetails.dateOfBirth).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                )}
                {donorDetails?.weight && (
                  <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">ওজন</span>
                    <span className="font-medium text-gray-900 dark:text-white">{donorDetails.weight} কেজি</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Donation Timeline */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiCalendar className="text-primary-600" /> রক্তদানের ইতিহাস
              </h3>
              <button
                onClick={() => {
                  setShowAddDonation(true);
                  setEditingDonationId(null);
                  setDonationForm({ donationDate: new Date().toISOString().split('T')[0], hospital: '', notes: '' });
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <FiPlus size={14} />
                যোগ করুন
              </button>
            </div>

            {/* Add Donation Form */}
            {showAddDonation && (
              <div className="p-4 mb-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">নতুন রক্তদান যোগ করুন</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">তারিখ</label>
                    <input
                      type="date"
                      value={donationForm.donationDate}
                      onChange={(e) => setDonationForm(prev => ({ ...prev, donationDate: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">হাসপাতাল/ক্যাম্প</label>
                    <input
                      type="text"
                      value={donationForm.hospital}
                      onChange={(e) => setDonationForm(prev => ({ ...prev, hospital: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="হাসপাতালের নাম লিখুন"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">নোটস</label>
                    <textarea
                      value={donationForm.notes}
                      onChange={(e) => setDonationForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="অতিরিক্ত তথ্য (ঐনিক্ষণীয়)"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAddDonation}
                    disabled={isSavingDonation}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {isSavingDonation ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
                    সংরক্ষণ
                  </button>
                  <button
                    onClick={() => {
                      setShowAddDonation(false);
                      setDonationForm({ donationDate: '', hospital: '', notes: '' });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    বাতিল
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4 text-gray-500">লোড হচ্ছে...</div>
              ) : donations.length === 0 ? (
                <div className="text-center py-6 text-gray-500 border border-dashed rounded-xl border-gray-300 dark:border-gray-700">
                  এখনো কোনো রক্তদানের ইতিহাস নেই
                </div>
              ) : (
                donations.map((donation, idx) => (
                  <div key={donation._id || idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                    {editingDonationId === donation._id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">তারিখ</label>
                          <input
                            type="date"
                            value={donationForm.donationDate}
                            onChange={(e) => setDonationForm(prev => ({ ...prev, donationDate: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">হাসপাতাল/ক্যাম্প</label>
                          <input
                            type="text"
                            value={donationForm.hospital}
                            onChange={(e) => setDonationForm(prev => ({ ...prev, hospital: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="হাসপাতালের নাম লিখুন"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">নোটস</label>
                          <textarea
                            value={donationForm.notes}
                            onChange={(e) => setDonationForm(prev => ({ ...prev, notes: e.target.value }))}
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="অতিরিক্ত তথ্য (ঐনিক্ষণীয়)"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveDonation}
                            disabled={isSavingDonation}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                          >
                            {isSavingDonation ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <FiSave size={14} />}
                            সংরক্ষণ
                          </button>
                          <button
                            onClick={handleCancelEditDonation}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <FiX size={14} />
                            বাতিল
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{donation.hospital || donation.location || 'হাসপাতাল/ক্যাম্প'}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {new Date(donation.date || donation.donationDate || donation.createdAt).toLocaleDateString('bn-BD')} • {donation.patientName ? `${donation.patientName} এর জন্য` : 'রক্তদান কর্মসূচি'}
                          </p>
                          {donation.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{donation.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            !donation.status || donation.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}>
                            {donation.status === 'pending' ? 'প্রক্রিয়াধীন' : 'সম্পন্ন'}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditDonation(donation)}
                              className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded transition-colors"
                              title="এডিট করুন"
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteDonation(donation._id || donation.id)}
                              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded transition-colors"
                              title="ডিলিট করুন"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
