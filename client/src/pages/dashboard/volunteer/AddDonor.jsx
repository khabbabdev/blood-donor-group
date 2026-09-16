import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSave, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import SectionHeader from '../../../components/common/SectionHeader';
import { donorAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const addressToString = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    return address.full || address.label || JSON.stringify(address);
  }
  return '';
};

const AddDonor = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      bloodGroup: 'A+',
      lastDonation: '',
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (isEdit) {
      const loadDonor = async () => {
        try {
          const res = await donorAPI.getById(id);
          const donor = res.data?.donor || res.data;
          const userInfo = donor?.userId || {};

          setValue('name', donor?.name || userInfo.name || '');
          setValue(
            'email',
            donor?.email || userInfo.email || '',
          );
          setValue('phone', donor?.phone || userInfo.phone || '');
          setValue('address', donor?.address || addressToString(userInfo.address) || '');
          setValue('bloodGroup', donor?.bloodGroup || 'A+');

          if (donor?.lastDonationDate) {
            setValue(
              'lastDonation',
              new Date(donor.lastDonationDate).toISOString().split('T')[0],
            );
          }
          setValue('isAvailable', donor?.isAvailable !== false);
        } catch (err) {
          toast.error('ডোনার তথ্য লোড করতে ব্যর্থ হয়েছে');
        }
      };
      loadDonor();
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await donorAPI.update(id, data);
        toast.success('ডোনার তথ্য আপডেট করা হয়েছে');
      } else {
        await donorAPI.create(data);
        toast.success('ডোনার সফলভাবে যুক্ত করা হয়েছে');
      }
      navigate('/dashboard/volunteer/donors');
    } catch (err) {
      const message =
        err.response?.data?.message || 'অপারেশন সফল হয়নি। আবার চেষ্টা করুন।';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader
          title={isEdit ? 'ডোনার আপডেট' : 'ডোনার যুক্ত করুন'}
          subtitle={
            isEdit ? 'ডোনারের তথ্য আপডেট করুন' : 'নতুন ডোনার যুক্ত করুন'
          }
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
                  placeholder="ডোনারের পূর্ণ নাম"
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
                  {...register('email', {
                    required: 'ইমেইল আবশ্যক',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'সঠিক ইমেইল ঠিকানা দিন',
                    },
                  })}
                  type="email"
                  className="input-field"
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'পাসওয়ার্ড আবশ্যক',
                        minLength: {
                          value: 6,
                          message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
                        },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="input-field pr-10"
                      placeholder="কমপক্ষে ৬ অক্ষর"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ফোন নম্বর
                </label>
                <input
                  {...register('phone', {
                    required: 'ফোন নম্বর আবশ্যক',
                    pattern: {
                      value: /^(\+88)?01[3-9]\d{8}$/,
                      message: 'সঠিক ১০/১১ ডিজিটের ফোন নম্বর দিন',
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
                  রক্তের গ্রুপ
                </label>
                <select
                  {...register('bloodGroup', {
                    required: 'রক্তের গ্রুপ নির্বাচন করুন',
                  })}
                  className="input-field"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="text-xs text-red-500 mt-1">{errors.bloodGroup.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক)
                </label>
                <input
                  {...register('lastDonation')}
                  type="date"
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
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

              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <input
                    {...register('isAvailable')}
                    type="checkbox"
                    id="isAvailable"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="isAvailable"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    রক্ত দিতে প্রস্তুত?
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <Link
                to="/dashboard/volunteer/donors"
                className="btn-outline py-2.5 px-6 flex items-center gap-2"
              >
                <FiX /> বাতিল
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary py-2.5 px-6 flex items-center gap-2 disabled:opacity-70"
              >
                <FiSave />
                {submitting
                  ? 'সংরক্ষণ হচ্ছে...'
                  : isEdit
                  ? 'আপডেট করুন'
                  : 'যুক্ত করুন'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDonor;
