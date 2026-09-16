import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import { FiDroplet, FiHeart, FiUsers, FiActivity } from 'react-icons/fi';

const Services = () => {
  const services = [
    { icon: FiDroplet, title: 'জরুরি রক্ত সরবরাহ', desc: 'জরুরি মুহূর্তে সঠিক সময়ে রক্তদাতার ব্যবস্থা করা।' },
    { icon: FiActivity, title: 'রক্তদান ক্যাম্প আয়োজন', desc: 'বিভিন্ন স্থানে রক্তদান ক্যাম্পের আয়োজন করা।' },
    { icon: FiHeart, title: 'সচেতনতা কর্মসূচি', desc: 'রক্তদান সম্পর্কে সাধারণ মানুষের মাঝে সচেতনতা বৃদ্ধি করা।' },
    { icon: FiUsers, title: 'স্বেচ্ছাসেবক নিয়োগ', desc: 'নতুন স্বেচ্ছাসেবক তৈরি করা যারা মানবতার সেবায় কাজ করবে।' },
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader title="আমাদের সেবাসমূহ" subtitle="আমরা যেসব সেবা প্রদান করে থাকি" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {services.map((service, i) => (
            <div key={i} className="card-hover p-8 flex gap-6">
              <div className="w-16 h-16 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-3xl flex-shrink-0">
                <service.icon />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
