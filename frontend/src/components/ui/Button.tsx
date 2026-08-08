import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: any;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-6 py-3.5 text-sm'
  }[size];

  const variantClasses = {
    primary: 'bg-[#0EA89A] hover:bg-[#0C8E82] text-white shadow-md shadow-[#0EA89A]/20 font-bold',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white font-semibold',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold',
    danger: 'bg-[#D95353] hover:bg-[#C24141] text-white font-bold',
    ghost: 'hover:bg-slate-100 text-slate-600 font-medium'
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`rounded-xl font-mono transition-all duration-150 inline-flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
