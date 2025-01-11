import React from 'react';

// Changed to named export
export const Button = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    outline: 'border-2 border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500',
    ghost: 'text-red-500 hover:bg-red-50 focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};