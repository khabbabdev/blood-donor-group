import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [role, setRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...submitData } = data;
      const formData = { ...submitData, role };
      await registerUser(formData);
      toast.success('সফলভাবে রেজিস্ট্রেশন হয়েছে');
      if (role !== 'donor') {
        toast.success('আপনার অ্যাকাউন্ট অ্যাডমিন অনুমোদনের অপেক্ষায় আছে', { duration: 5000 });
      }
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 flex justify-center items-center">
      <div className="max-w-2xl w-full card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">রেজিস্ট্রেশন করুন</h2>
          <p className="text-gray-600 dark:text-gray-400">নতুন অ্যাকাউন্ট তৈরি করতে সঠিক তথ্য দিন</p>
        </div>

        {/* Role Selection Tabs (Only donor and volunteer) */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8 max-w-md mx-auto">
          {['donor', 'volunteer'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                role === r 
                  ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm font-semibold' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {r === 'donor' ? '🩸 ডোনার হিসেবে যুক্ত হোন' : '🤝 ভলান্টিয়ার হিসেবে যুক্ত হোন'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">নাম</label>
              <input 
                {...register('name', { required: 'নাম দেওয়া আবশ্যক' })} 
                type="text" 
                className="input-field" 
                placeholder="আপনার পূর্ণ নাম"
                required 
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ইমেইল</label>
              <input 
                {...register('email', { 
                  required: 'ইমেইল আবশ্যক',
                  pattern: { value: /^\S+@\S+$/i, message: 'সঠিক ইমেইল ঠিকানা দিন' }
                })} 
                type="email" 
                className="input-field" 
                placeholder="example@email.com"
                required 
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">পাসওয়ার্ড</label>
              <div className="relative">
                <input 
                  {...register('password', { 
                    required: 'পাসওয়ার্ড আবশ্যক', 
                    minLength: { value: 6, message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' } 
                  })} 
                  type={showPassword ? 'text' : 'password'} 
                  className="input-field pr-10" 
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
              <div className="relative">
                <input 
                  {...register('confirmPassword', { 
                    required: 'পাসওয়ার্ড পুনরায় নিশ্চিত করুন',
                    validate: (value) => value === password || 'পাসওয়ার্ড মিলছে না'
                  })} 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  className="input-field pr-10" 
                  placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 focus:outline-none"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ফোন নম্বর</label>
              <input 
                {...register('phone', { 
                  required: 'ফোন নম্বর আবশ্যক',
                  pattern: {
                    value: /^(\+88)?01[3-9]\d{8}$/,
                    message: 'সঠিক ১০/১১ ডিজিটের বাংলাদেশি ফোন নম্বর দিন'
                  }
                })} 
                type="tel" 
                className="input-field" 
                placeholder="01XXXXXXXXX"
                required 
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ঠিকানা</label>
              <input 
                {...register('address', { required: 'ঠিকানা আবশ্যক' })} 
                type="text" 
                className="input-field" 
                placeholder="উপজেলা/গ্রাম, জেলা"
                required 
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
            </div>
            
            {role === 'donor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">রক্তের গ্রুপ</label>
                  <select {...register('bloodGroup', { required: 'রক্তের গ্রুপ নির্বাচন করুন' })} className="input-field" required>
                    <option value="">নির্বাচন করুন</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  {errors.bloodGroup && <p className="text-xs text-red-500 mt-1">{errors.bloodGroup.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক)</label>
                  <input {...register('lastDonation')} type="date" className="input-field" />
                </div>
              </>
            )}

            {role === 'volunteer' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">কেন ভলান্টিয়ার হতে চান?</label>
                <textarea 
                  {...register('reason', { required: 'কারণ লিখুন' })} 
                  className="input-field" 
                  rows="3" 
                  placeholder="আপনার আগ্রহ বা অভিজ্ঞতার কথা সংক্ষিপ্তভাবে লিখুন..."
                  required
                ></textarea>
                {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary w-full mt-6 py-3">
            রেজিস্ট্রেশন সম্পন্ন করুন
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          ইতিমধ্যেই অ্যাকাউন্ট আছে?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
