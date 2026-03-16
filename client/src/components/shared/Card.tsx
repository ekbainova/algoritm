import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  dark?: boolean;
  style?: CSSProperties;
}

export function Card({ children, selected, onClick, style }: CardProps) {
  const s: CSSProperties = {
    background: 'linear-gradient(145deg, rgba(99,40,149,0.06), rgba(99,40,149,0.02))',
    border: '1px solid rgba(99,40,149,0.1)',
    borderRadius: 20,
    transition: 'all 0.3s',
    cursor: onClick ? 'pointer' : undefined,
    ...(selected ? { border: '1px solid rgba(255,216,77,0.4)', background: 'linear-gradient(145deg, rgba(99,40,149,0.2), rgba(99,40,149,0.1))' } : {}),
    ...style,
  };

  return (
    <div style={s} onClick={onClick}>
      {children}
    </div>
  );
}
