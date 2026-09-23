import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import SectionHeader from '../components/common/SectionHeader';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await contactAPI.send(data);
      toast.success('আপনার বার্তা সফলভাবে পাঠানো হয়েছে');
      reset();
    } catch (err) {
      const message = err.response?.data?.message || 'বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader title="যোগাযোগ" subtitle="যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center text-xl shrink-0">
                  <FiMapPin />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">ঠিকানা</h4>
                  <p className="text-gray-600 dark:text-gray-400">পানিতলাহাট, গোবিন্দগঞ্জ, গাইবান্ধা।</p>
                </div>
              </div>

              <div className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center text-xl shrink-0">
                  <FiPhone />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">ফোন</h4>
                  <p><a href="tel:01711606863" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors font-semibold tracking-wide">(বোরহান) ০১৭১১-৬০৬৮৬৩</a></p>
                  <p><a href="tel:01312306309" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors font-semibold tracking-wide">(আবু হাসান) ০১৩১২-৩০৬৩০৯</a></p>
                </div>
              </div>

              <div className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center text-xl shrink-0">
                  <FiMail />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">ইমেইল</h4>
                  <p className="text-gray-600 dark:text-gray-400">sk.khabbab50@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="card overflow-hidden h-64 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <iframe
                title="Panitola Hat Location Map"
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1552.1185244624942!2d89.28139700109315!3d25.10485093377495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sPanitolahat!5e1!3m2!1sen!2sbd!4v1789362742351!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '10px' }}
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <FiSend className="text-primary-600" /> বার্তা পাঠান
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">নাম</label>
                <input {...register('name')} type="text" className="input-field" placeholder="আপনার পূর্ণ নাম" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ইমেইল</label>
                <input {...register('email')} type="email" className="input-field" placeholder="example@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">বিষয়</label>
                <input {...register('subject')} type="text" className="input-field" placeholder="বার্তার বিষয়" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">বার্তা</label>
                <textarea {...register('message')} rows="4" className="input-field" placeholder="আপনার বার্তা বিস্তারিত লিখুন..." required></textarea>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {loading ? 'পাঠানো হচ্ছে...' : 'পাঠিয়ে দিন'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
