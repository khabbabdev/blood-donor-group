import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { adminAPI, contactAPI, donationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiUsers, FiActivity, FiDroplet, FiClock, FiCheck, FiX, FiShield, FiMail, FiHeart } from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('approvals');
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalVolunteers: 0,
    totalBloodRequests: 0,
    pendingApprovals: 0
  });

  const [pendingUsers, setPendingUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminAPI.getStats();
      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }

    try {
      const pendingRes = await adminAPI.getPending();
      if (pendingRes.data?.users) {
        setPendingUsers(pendingRes.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch pending users:', err);
    }

    try {
      const contactRes = await contactAPI.getAll();
      if (contactRes.data?.contacts) {
        setContacts(contactRes.data.contacts);
      }
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    }

    try {
      const donationRes = await donationAPI.getAllDonations();
      if (donationRes.data?.donations) {
        setDonations(donationRes.data.donations);
      }
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approve(id);
      toast.success('ব্যবহারকারী সফলভাবে অনুমোদিত হয়েছে');
      setPendingUsers(prev => prev.filter(u => u._id !== id));
      setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
    } catch (err) {
      const message = err.response?.data?.message || 'অনুমোদন প্রক্রিয়া ব্যর্থ হয়েছে';
      toast.error(message);
    }
  };

  const handleBan = async (id) => {
    try {
      await adminAPI.ban(id);
      toast.success('অনুরোধ বাতিল বা অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে');
      setPendingUsers(prev => prev.filter(u => u._id !== id));
      setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
    } catch (err) {
      const message = err.response?.data?.message || 'বাতিল প্রক্রিয়া ব্যর্থ হয়েছে';
      toast.error(message);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      setContacts(prev => prev.map(c => c._id === id ? { ...c, isRead: true } : c));
      toast.success('পড়া হয়েছে হিসেবে চিহ্নিত করা হয়েছে');
    } catch (err) {
      toast.error('পড়া হিসেবে চিহ্নিত করা যায়নি');
    }
  };

  const handleVerifyDonation = async (id) => {
    try {
      await donationAPI.verifyDonation(id, 'verified');
      setDonations(prev => prev.map(d => d._id === id ? { ...d, status: 'completed' } : d));
      toast.success('রক্তদান যাচাই সম্পন্ন হয়েছে');
    } catch (err) {
      toast.error('যাচাইকরণ ব্যর্থ হয়েছে');
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center text-2xl">
            <FiShield />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">অ্যাডমিন ড্যাশবোর্ড</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">সিস্টেমের সামগ্রিক কার্যক্রম এবং অনুমোদন নিয়ন্ত্রণ করুন</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="card bg-primary-50/70 dark:bg-primary-900/20 border-primary-100 dark:border-primary-900/30">
            <div className="flex items-center gap-3 mb-2 text-primary-600">
              <FiUsers size={20} />
              <h3 className="font-bold">মোট ডোনার</h3>
            </div>
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">{stats.totalDonors}</p>
          </div>

          <div className="card bg-blue-50/70 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-3 mb-2 text-blue-600">
              <FiActivity size={20} />
              <h3 className="font-bold">মোট ভলান্টিয়ার</h3>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalVolunteers}</p>
          </div>

          <div className="card bg-emerald-50/70 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-3 mb-2 text-emerald-600">
              <FiDroplet size={20} />
              <h3 className="font-bold">রক্তের অনুরোধ</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{stats.totalBloodRequests}</p>
          </div>

          <div className="card bg-amber-50/70 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30">
            <div className="flex items-center gap-3 mb-2 text-amber-600">
              <FiClock size={20} />
              <h3 className="font-bold">অপেক্ষমাণ অনুমোদন</h3>
            </div>
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.pendingApprovals}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 gap-4">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'approvals'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <FiClock size={16} /> অপেক্ষমাণ অনুমোদন ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'contacts'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <FiMail size={16} /> যোগাযোগ বার্তা ({contacts.filter(c => !c.isRead).length})
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'donations'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <FiHeart size={16} /> রক্তদান যাচাইকরণের তালিকা
          </button>
        </div>
        
        {/* Tab 1: Pending Approvals Table */}
        {activeTab === 'approvals' && (
          <div className="card p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">অপেক্ষমাণ অ্যাকাউন্ট অনুমোদন</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">ভলান্টিয়ার এবং অ্যাডমিন হিসেবে রেজিস্ট্রেশন করা সদস্যদের অনুমোদন দিন</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full">
                {pendingUsers.length} টি পেন্ডিং
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">লোড হচ্ছে...</div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FiCheck className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <p>বর্তমানে কোনো অনুমোদনের অনুরোধ অপেক্ষমাণ নেই</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                      <th className="pb-3 font-semibold">নাম</th>
                      <th className="pb-3 font-semibold">ইমেইল</th>
                      <th className="pb-3 font-semibold">ফোন</th>
                      <th className="pb-3 font-semibold">আবেদিত রোল</th>
                      <th className="pb-3 font-semibold text-right">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {pendingUsers.map((pUser) => (
                      <tr key={pUser._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                        <td className="py-3.5 font-medium text-gray-900 dark:text-white">{pUser.name}</td>
                        <td className="py-3.5 text-gray-600 dark:text-gray-400">{pUser.email}</td>
                        <td className="py-3.5 text-gray-600 dark:text-gray-400">{pUser.phone}</td>
                        <td className="py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            pUser.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {pUser.role === 'admin' ? 'অ্যাডমিন' : 'ভলান্টিয়ার'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleApprove(pUser._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition-colors"
                          >
                            <FiCheck /> অনুমোদন দিন
                          </button>
                          <button
                            onClick={() => handleBan(pUser._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition-colors"
                          >
                            <FiX /> বাতিল করুন
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contact Messages */}
        {activeTab === 'contacts' && (
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ওয়েবসাইট যোগাযোগ বার্তা</h3>
            {contacts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">কোনো বার্তা পাওয়া যায়নি</div>
            ) : (
              <div className="space-y-4">
                {contacts.map((msg) => (
                  <div key={msg._id} className={`p-4 rounded-xl border ${msg.isRead ? 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900' : 'border-primary-200 dark:border-primary-900/50 bg-primary-50/30 dark:bg-primary-900/10'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{msg.subject}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">প্রেরক: {msg.name} ({msg.email}) • {new Date(msg.createdAt).toLocaleDateString('bn-BD')}</p>
                      </div>
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkRead(msg._id)}
                          className="btn-outline text-xs py-1 px-2.5"
                        >
                          পড়া হিসেবে চিহ্নিত করুন
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Donations Verification */}
        {activeTab === 'donations' && (
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">রক্তদান কার্যক্রমের তালিকা</h3>
            {donations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">কোনো রক্তদান কার্যক্রম রেকর্ডেড নেই</div>
            ) : (
              <div className="space-y-4">
                {donations.map((don) => (
                  <div key={don._id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{don.donorId?.name || 'ডোনার'} ({don.requestId?.bloodGroup || 'রক্তদান'})</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">স্থান: {don.hospital || don.requestId?.hospital || 'হাসপাতাল'} • তারিখ: {new Date(don.donationDate || don.createdAt).toLocaleDateString('bn-BD')}</p>
                    </div>
                    <button
                      onClick={() => handleVerifyDonation(don._id)}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <FiCheck /> যাচাই করুন
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
