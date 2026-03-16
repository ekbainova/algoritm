import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'purple' | 'green' | 'yellow' | 'red' | 'gray' | 'light';
}

const colors: Record<string, { bg: string; color: string }> = {
  purple: { bg: 'rgba(99,40,149,0.25)', color: '#c4a6e0' },
  green: { bg: 'rgba(68,211,112,0.15)', color: '#44d370' },
  yellow: { bg: 'rgba(99,40,149,0.08)', color: '#632895' },
  light: { bg: 'rgba(255,216,77,0.15)', color: '#ffd84d' },
  red: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
  gray: { bg: 'rgba(255,255,255,0.05)', color: '#a89cb8' },
};

export function Badge({ children, color = 'purple' }: BadgeProps) {
  const c = colors[color];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 12px', borderRadius: 100,
      background: c.bg, color: c.color,
      fontSize: 12, fontWeight: 600,
    }}>
      {children}
    </span>
  );
}
