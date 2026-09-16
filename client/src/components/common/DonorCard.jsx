import React from 'react';
import { FiMapPin, FiPhone, FiCalendar, FiDroplet } from 'react-icons/fi';
import BloodGroupBadge from './BloodGroupBadge';
import { useAuth } from '../../context/AuthContext';

const DonorCard = ({ donor }) => {
  const { user } = useAuth();
  
  // Data extraction handling both backend populated user and mock data
  const data = {
    name: donor?.userId?.name || donor?.name || 'অজ্ঞাত ডোনার',
    avatar: donor?.userId?.avatar || donor?.avatar || '',
    bloodGroup: donor?.bloodGroup || 'A+',
    district: (typeof donor?.userId?.address === 'object' ? donor?.userId?.address?.district : donor?.userId?.address) || donor?.district || 'ঢাকা',
    phone: donor?.userId?.phone || donor?.phone || '+8801700000000',
    lastDonation: donor?.lastDonationDate 
      ? new Date(donor.lastDonationDate).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })
      : (donor?.lastDonation || 'তথ্য নেই'),
    totalDonations: donor?.totalDonations ?? (donor?.donationCount || 0),
    isAvailable: donor?.isAvailable !== false,
  };

  return (
    <div className="card-hover overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt={data.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800/50 flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-800/50 flex items-center justify-center text-xl font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">
                {data.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{data.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <FiMapPin size={14} />
                <span>{data.district}</span>
              </div>
            </div>
          </div>
          <BloodGroupBadge group={data.bloodGroup} />
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <FiDroplet className="text-primary-500" /> মোট রক্তদান
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{data.totalDonations} বার</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <FiCalendar className="text-primary-500" /> শেষ রক্তদান
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{data.lastDonation}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">অবস্থা</span>
            <span className={`flex items-center gap-1.5 font-medium ${data.isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full ${data.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              {data.isAvailable ? 'রক্ত দিতে প্রস্তুত' : 'প্রস্তুত নন'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        {user ? (
          <a 
            href={`tel:${data.phone}`}
            className="w-full btn-outline py-2.5 flex items-center justify-center gap-2 text-center text-sm font-semibold hover:no-underline"
          >
            <FiPhone /> কল করুন ({data.phone})
          </a>
        ) : (
          <div className="w-full text-center py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            নাম্বার দেখতে <a href="/login" className="text-primary-600 font-medium hover:underline">লগইন</a> করুন
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorCard;
