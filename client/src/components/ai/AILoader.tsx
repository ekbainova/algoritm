interface AILoaderProps {
  message?: string;
}

export function AILoader({ message = 'ALGO думает...' }: AILoaderProps) {
  return (
    <div style={{
      maxWidth: '80%',
      padding: '16px 20px',
      borderRadius: 20,
      borderBottomLeftRadius: 4,
      background: 'linear-gradient(135deg, var(--purple), var(--purple-dark))',
      borderLeft: '3px solid var(--yellow)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
          background: 'var(--yellow)',
          animation: 'pulse-dot 1.4s infinite',
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
      <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{message}</span>
    </div>
  );
}
