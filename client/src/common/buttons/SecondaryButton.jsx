import React from 'react';

export const SecondaryButton = ({ children, onClick, type = 'button', disabled = false, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-xs bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-gray-500 
                 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};