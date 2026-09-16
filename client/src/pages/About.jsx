import React from 'react';
import SectionHeader from '../components/common/SectionHeader';

const About = () => {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader title="আমাদের সম্পর্কে" subtitle="মানবতার সেবায় আমরা অঙ্গীকারবদ্ধ" />
        <div className="card p-8 mb-10">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">আমাদের গল্প</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            আমাদের লক্ষ্য হলো জরুরি মুহূর্তে মুমূর্ষু রোগীর জন্য রক্তের ব্যবস্থা করা এবং মানুষকে রক্তদানে উৎসাহিত করা। একটি রক্তদান বাঁচাতে পারে একটি প্রাণ।
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            আমরা বিশ্বাস করি, স্বেচ্ছায় রক্তদান একটি মহৎ কাজ। আমাদের প্ল্যাটফর্মের মাধ্যমে আমরা রক্তদাতা এবং গ্রহীতার মধ্যে একটি সেতুবন্ধন তৈরি করতে চাই।
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
