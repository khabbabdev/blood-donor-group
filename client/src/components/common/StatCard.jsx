import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, count, label, color = 'primary' }) => {
  const colorMap = {
    primary: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card flex items-center p-6 gap-6"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${colorMap[color]}`}>
        <Icon />
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          <CountUp end={count} duration={2.5} />+
        </div>
        <div className="text-gray-600 dark:text-gray-400 font-medium">
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
