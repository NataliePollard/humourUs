import React from 'react';

const ProgressBar = ({ progress = 0 }) => {
  return (
    <>
      <div className="absolute bottom-8 left-0 right-0 h-0.5 bg-gray-600 bg-opacity-50">
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black"></div>
    </>
  );
};

export default ProgressBar;