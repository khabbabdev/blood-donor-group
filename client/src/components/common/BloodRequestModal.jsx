import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiDroplet } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { bloodRequestAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BloodRequestModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    const isUserLoggedIn = Boolean(user || isAuthenticated);
    if (!isUserLoggedIn) {
      toast.error('রক্তের আবেদন জানাতে প্রথমে লগইন করুন');
      onClose();
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await bloodRequestAPI.create({
        patientName: data.patientName,
        bloodGroup: data.bloodGroup,
        hospital: data.hospital,
        unitsNeeded: Number(data.unitsNeeded || 1),
        contactNumber: data.contactPhone,
        urgency: data.urgency || 'normal',
        notes: data.notes
      });
      toast.success('রক্তের আবেদন সফলভাবে পোস্ট করা হয়েছে!');
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'আবেদন পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="মোডাল বন্ধ করুন"
        >
          <FiX size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 text-primary-600 rounded-full flex items-center justify-center text-xl shrink-0">
            <FiDroplet />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">রক্তের আবেদন জানান</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">প্রয়োজনীয় সব তথ্য সঠিকভাবে পূরণ করুন</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">রোগীর নাম *</label>
            <input
              {...register('patientName', { required: 'রোগীর নাম দেওয়া আবশ্যক' })}
              type="text"
              className="input-field"
              placeholder="যেমন: আব্দুর রহিম"
            />
            {errors.patientName && <p className="text-xs text-red-500 mt-1">{errors.patientName.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">রক্তের গ্রুপ *</label>
              <select
                {...register('bloodGroup', { required: 'রক্তের গ্রুপ নির্বাচন করুন' })}
                className="input-field"
              >
                <option value="">নির্বাচন করুন</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              {errors.bloodGroup && <p className="text-xs text-red-500 mt-1">{errors.bloodGroup.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">পরিমাণ (ব্যাগ) *</label>
              <input
                {...register('unitsNeeded', { required: true, min: 1 })}
                type="number"
                defaultValue={1}
                min={1}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">হাসপাতাল / স্থান *</label>
            <input
              {...register('hospital', { required: 'হাসপাতালের নাম আবশ্যক' })}
              type="text"
              className="input-field"
              placeholder="যেমন: গাইবান্ধা সদর হাসপাতাল"
            />
            {errors.hospital && <p className="text-xs text-red-500 mt-1">{errors.hospital.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">যোগাযোগের ফোন নম্বর *</label>
              <input
                {...register('contactPhone', {
                  required: 'ফোন নম্বর আবশ্যক',
                  pattern: { value: /^(\+88)?01[3-9]\d{8}$/, message: 'সঠিক ফোন নম্বর দিন' }
                })}
                type="tel"
                className="input-field"
                placeholder="01XXXXXXXXX"
              />
              {errors.contactPhone && <p className="text-xs text-red-500 mt-1">{errors.contactPhone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">জরুরি মাত্রা</label>
              <select {...register('urgency')} className="input-field">
                <option value="normal">সাধারণ (Normal)</option>
                <option value="urgent">জরুরি (Urgent)</option>
                <option value="critical">অত্যন্ত জরুরি (Critical)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">অতিরিক্ত বিবরণ (ঐচ্ছিক)</label>
            <textarea
              {...register('notes')}
              rows="3"
              className="input-field"
              placeholder="রোগীর অবস্থা বা সময় সংক্রান্ত অতিরিক্ত তথ্য..."
            ></textarea>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2.5 px-5"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 px-6"
            >
              {loading ? 'পাঠানো হচ্ছে...' : 'আবেদন জমা দিন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BloodRequestModal;
