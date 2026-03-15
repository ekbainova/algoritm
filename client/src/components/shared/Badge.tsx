import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'purple' | 'green' | 'yellow' | 'red' | 'gray';
}

const colors = {
  purple: 'bg-white/20 text-white',
  green: 'bg-[#44d370]/20 text-[#44d370]',
  yellow: 'bg-[#ffd84d]/20 text-[#ffd84d]',
  red: 'bg-[#EF4444]/20 text-[#EF4444]',
  gray: 'bg-white/10 text-white/60',
};

export function Badge({ children, color = 'purple' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${colors[color]}`}>
      {children}
    </span>
  );
}
