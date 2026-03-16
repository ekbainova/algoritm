import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const base: CSSProperties = {
  fontFamily: 'inherit', fontWeight: 700, borderRadius: 100,
  cursor: 'pointer', border: 'none',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  transition: 'all 0.3s',
};

const variants: Record<string, CSSProperties> = {
  primary: { background: 'var(--yellow)', color: 'var(--purple-dark)', boxShadow: '0 0 40px var(--yellow-glow)' },
  secondary: { background: 'transparent', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.15)' },
  dark: { background: 'var(--purple-dark)', color: 'white' },
  ghost: { background: 'transparent', color: 'var(--text-muted)' },
};

const sizes: Record<string, CSSProperties> = {
  sm: { padding: '10px 24px', fontSize: 13 },
  md: { padding: '14px 32px', fontSize: 15 },
  lg: { padding: '18px 40px', fontSize: 17 },
};

export function Button({ variant = 'primary', size = 'md', children, style, ...props }: ButtonProps) {
  return (
    <button style={{ ...base, ...variants[variant], ...sizes[size], ...style, ...(props.disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }} {...props}>
      {children}
    </button>
  );
}
