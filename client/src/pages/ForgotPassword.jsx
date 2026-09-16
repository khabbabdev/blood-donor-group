import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(data.email);
      setSent(true);
      if (res.data?.resetUrl) {
        setDevResetUrl(res.data.resetUrl);
      }
      toast.success(res.data?.message || 'পাসওয়ার্ড রিসেট লিংক প্রস্তুত করা হয়েছে!');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'লিংক পাঠাতে ব্যর্থ হয়েছে। ইমেইল চেক করুন।';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/50 text-primary-600 rounded-full flex items-center justify-center text-3xl mb-4">
            🔒
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">পাসওয়ার্ড ভুলে গেছেন?</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            আপনার অ্যাকাউন্টের ইমেইল ঠিকানা দিন, আমরা একটি রিসেট লিংক পাঠিয়ে দেবো।
          </p>
        </div>

        {sent ? (
          <div className="relative z-10 space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-center">
              ✅ ইমেইলে রিসেট লিংক পাঠানো হয়েছে। দয়া করে আপনার ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।
            </div>

            {devResetUrl && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-left border border-blue-200 dark:border-blue-700">
                <span className="font-bold block mb-2 text-sm">🔗 সরাসরি পাসওয়ার্ড রিসেট লিংক:</span>
                <a
                  href={devResetUrl}
                  className="text-primary-600 hover:text-primary-700 underline font-medium text-sm break-all"
                >
                  এখানে ক্লিক করে পাসওয়ার্ড রিসেট করুন
                </a>
              </div>
            )}

            <Link to="/login" className="btn-primary w-full py-3 text-center block">
              লগইন পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ইমেইল ঠিকানা
              </label>
              <input
                {...register('email', {
                  required: 'ইমেইল ঠিকানা দেওয়া আবশ্যক',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'সঠিক ইমেইল ঠিকানা দিন',
                  },
                })}
                type="email"
                className="input-field"
                placeholder="example@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            লগইন পেজে ফিরে যান
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
