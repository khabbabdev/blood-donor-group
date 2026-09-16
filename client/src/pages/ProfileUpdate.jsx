import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import SectionHeader from '../components/common/SectionHeader';

const ProfileUpdate = () => {
  const { user, updateProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || user?.phone_number || '',
      address: user?.address || '',
      reason: user?.reason || '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await updateProfile(data);
      toast.success('প্রফাইল সফলভাবে আপডেট হয়েছে');
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      const message = err.response?.data?.message || 'প্রফাইল আপডেট করতে ব্যর্থ হয়েছে।';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader
          title="প্রফাইল আপডেট"
          subtitle="আপনার ব্যক্তিগত তথ্য এবং যোগাযোগ আপডেট করুন"
          centered={false}
        />

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  পূর্ণ নাম
                </label>
                <input
                  {...register('name', { required: 'নাম দেওয়া আবশ্যক' })}
                  type="text"
                  className="input-field"
                  placeholder="আপনার পূর্ণ নাম"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ইমেইল
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="input-field bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ফোন নম্বর
                </label>
                <input
                  {...register('phone', {
                    required: 'ফোন নম্বর আবশ্যক',
                    pattern: {
                      value: /^(\+88)?01[3-9]\d{8}$/,
                      message: 'সঠিক ১০/১১ ডিজিটের বাংলাদেশি ফোন নম্বর দিন',
                    },
                  })}
                  type="tel"
                  className="input-field"
                  placeholder="01XXXXXXXXX"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ঠিকানা
                </label>
                <input
                  {...register('address', { required: 'ঠিকানা আবশ্যক' })}
                  type="text"
                  className="input-field"
                  placeholder="উপজেলা/গ্রাম, জেলা"
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>

              {user?.role === 'volunteer' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    কেন ভলান্টিয়ার হতে চান?
                  </label>
                  <textarea
                    {...register('reason', { required: 'কারণ লিখুন' })}
                    className="input-field"
                    rows="3"
                    placeholder="আপনার আগ্রহ বা অভিজ্ঞতার কথা সংক্ষিপ্তভাবে লিখুন..."
                  />
                  {errors.reason && (
                    <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/${user.role}`)}
                className="btn-outline py-2.5 px-6"
              >
                ফিরে যান
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary py-2.5 px-6 flex items-center gap-2 disabled:opacity-70"
              >
                {submitting ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
