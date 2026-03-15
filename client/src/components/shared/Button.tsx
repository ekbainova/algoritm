import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const base = 'font-bold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#ffd84d] text-[#3d1560] hover:bg-[#ffc800] hover:shadow-[0_8px_24px_rgba(255,216,77,0.4)] hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white/20 text-white border-2 border-white/40 hover:bg-white/30 backdrop-blur-sm',
    dark: 'bg-[#632895] text-white hover:bg-[#4a1a70]',
    ghost: 'bg-transparent text-[#6B7280] hover:text-[#0f1c2c] hover:bg-gray-100 rounded-xl',
  };

  const sizes = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
