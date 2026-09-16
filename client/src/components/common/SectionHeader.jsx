import React from 'react';

const SectionHeader = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p
          className={
            "section-subtitle mt-4 " +
            (centered ? "max-w-2xl mx-auto" : "max-w-2xl")
          }
        >
          {subtitle}
        </p>
      )}
      <div className={`h-1 w-20 bg-primary-600 rounded-full mt-6 ${centered ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionHeader;
