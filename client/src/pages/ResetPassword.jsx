import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('রিসেট টোকেন পাওয়া যায়নি। পুনরায় ফরগেট পাসওয়ার্ড ফর্ম ব্যবহার করুন।');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, data.password);
      toast.success('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
      navigate('/login');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে। লিংকটি হয়তো মেয়াদোত্তীর্ণ।';
      toast.error(msg);
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
            🔑
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">নতুন পাসওয়ার্ড সেট করুন</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">আপনার নতুন পাসওয়ার্ড দিন</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          {/* নতুন পাসওয়ার্ড */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              নতুন পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                {...register('password', {
                  required: 'পাসওয়ার্ড দেওয়া আবশ্যক',
                  minLength: { value: 6, message: 'অন্তত ৬ অক্ষরের হতে হবে' },
                })}
                type={showPassword ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* কনফার্ম পাসওয়ার্ড */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              কনফার্ম পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword', {
                  required: 'পাসওয়ার্ড নিশ্চিত করা আবশ্যক',
                  validate: (value) => value === password || 'পাসওয়ার্ড মিলছে না',
                })}
                type={showConfirm ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                tabIndex={-1}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg mt-6"
          >
            {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
            নতুন রিসেট লিংক চান?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
