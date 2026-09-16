import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiUsers,
} from "react-icons/fi";
import SectionHeader from "../../components/common/SectionHeader";
import { bloodRequestAPI, donorAPI } from "../../services/api";

const VolunteerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [donorCount, setDonorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [pendingRes, completedRes, statsRes] = await Promise.allSettled([
        bloodRequestAPI.getAll({ status: "pending" }),
        bloodRequestAPI.getAll({ status: "completed" }),
        donorAPI.getStats(),
      ]);

      if (
        pendingRes.status === "fulfilled" &&
        pendingRes.value.data?.requests
      ) {
        setRequests(pendingRes.value.data.requests);
      }
      if (
        completedRes.status === "fulfilled" &&
        completedRes.value.data?.total !== undefined
      ) {
        setCompletedCount(
          completedRes.value.data.total ||
            completedRes.value.data.requests?.length ||
            0,
        );
      }
      if (statsRes.status === "fulfilled") {
        const stats = statsRes.value.data;
        setDonorCount(
          stats?.totalDonors || stats?.total || stats?.count || 0,
        );
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await bloodRequestAPI.update(id, { status: "completed" });
      setRequests((prev) => prev.filter((r) => (r.id || r._id) !== id));
      setCompletedCount((prev) => prev + 1);
      toast.success("রক্তের অনুরোধ সফলভাবে সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে");
    } catch (err) {
      toast.error("অনুরোধ সম্পন্ন করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionHeader
          title="ভলান্টিয়ার ড্যাশবোর্ড"
          subtitle="আপনার দায়িত্ব এবং অ্যাসাইন করা রক্তের অনুরোধসমূহ"
          centered={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-primary-50/70 dark:bg-primary-900/20 border-primary-100 dark:border-primary-900/30">
            <h3 className="font-bold text-lg mb-2 text-primary-600">
              জরুরি রিকোয়েস্ট
            </h3>
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
              {requests.length} টি
            </p>
          </div>
          <div className="card bg-emerald-50/70 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30">
            <h3 className="font-bold text-lg mb-2 text-emerald-600">
              সম্পন্ন করা অনুরোধ
            </h3>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              {completedCount} টি
            </p>
          </div>
          <div className="card bg-blue-50/70 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
            <h3 className="font-bold text-lg mb-2 text-blue-600">মোট অনুরোগ</h3>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {requests.length + completedCount} টি
            </p>
          </div>
          <div className="card bg-purple-50/70 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30">
            <h3 className="font-bold text-lg mb-2 text-purple-600">মোট ডোনার</h3>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              {donorCount} জন
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            to="/dashboard/volunteer/donors/add"
            className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm font-semibold"
          >
            <FiPlus size={17} />
            ডোনার যুক্ত করুন
          </Link>
          <Link
            to="/dashboard/volunteer/donors"
            className="btn-outline py-2.5 px-5 flex items-center gap-2 text-sm font-semibold"
          >
            <FiUsers size={17} />
            ডোনার ম্যানেজমেন্ট
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                জরুরি রক্তের অনুরোধসমূহ
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ডোনারের সাথে যোগাযোগ করে রোগীকে রক্ত পেতে সাহায্য করুন
              </p>
            </div>
            <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-semibold px-2.5 py-1 rounded-full">
              {requests.length} টি সক্রিয়
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">লোড হচ্ছে...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FiCheckCircle className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
              <p>বর্তমানে আপনার কোনো অমীমাংসিত অনুরোধ নেই। চমৎকার কাজ!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req._id || req.id}
                  className="card p-5 border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-base text-gray-900 dark:text-white">
                        {req.patientName}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                        {req.bloodGroup}
                      </span>
                      <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded">
                        {req.urgency}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiMapPin /> {req.hospital}
                      </span>
                      <span>পরিমাণ: {req.units}</span>
                      <span className="flex items-center gap-1">
                        <FiPhone /> {req.contactNumber || req.contactPhone}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${req.contactNumber || req.contactPhone}`}
                      className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
                    >
                      <FiPhone /> কল করুন
                    </a>
                    <button
                      onClick={() => handleResolve(req._id || req.id)}
                      className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
                    >
                      <FiCheck /> সম্পন্ন করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
