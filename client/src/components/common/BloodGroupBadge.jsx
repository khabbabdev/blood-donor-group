import React from 'react';

const BloodGroupBadge = ({ group, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-lg px-4 py-2',
  };

  return (
    <span className={`inline-flex items-center justify-center font-bold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-md border border-primary-200 dark:border-primary-800/50 ${sizeClasses[size]}`}>
      {group}
    </span>
  );
};

export default BloodGroupBadge;
