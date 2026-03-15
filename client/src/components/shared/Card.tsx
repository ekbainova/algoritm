import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  dark?: boolean;
}

export function Card({ children, className = '', selected, onClick, dark }: CardProps) {
  const bg = dark
    ? 'bg-[#3d1560]/80 backdrop-blur-sm text-white'
    : 'bg-white text-[#0f1c2c]';
  const base = `rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 ${bg}`;
  const interactive = onClick ? 'cursor-pointer hover:shadow-[0_8px_30px_rgba(99,40,149,0.18)] hover:-translate-y-1' : '';
  const selectedStyle = selected
    ? dark
      ? 'ring-3 ring-[#ffd84d] bg-[#4a1a70]'
      : 'ring-3 ring-[#632895] bg-[#f3eef8]'
    : '';

  return (
    <div className={`${base} ${interactive} ${selectedStyle} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
