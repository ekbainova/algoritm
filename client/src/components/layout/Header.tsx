import { useStudentStore } from '../../store/studentStore';
import { RotateCcw } from 'lucide-react';

const nav: React.CSSProperties = {
  position: 'sticky', top: 0, zIndex: 100,
  padding: '0 48px', height: 56,
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'saturate(180%) blur(20px)',
  WebkitBackdropFilter: 'saturate(180%) blur(20px)',
  borderBottom: '1px solid var(--border)',
};

export function Header() {
  const { student, reset } = useStudentStore();

  return (
    <header style={nav}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--yellow-glow)' }}>
          <span style={{ color: 'var(--purple-dark)', fontWeight: 800, fontSize: 12 }}>A</span>
        </div>
        <span style={{ fontWeight: 800, color: 'var(--purple)', letterSpacing: 2, textTransform: 'uppercase', fontSize: 14 }}>ALGO</span>
        <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>AI-учитель Python</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {student && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(99,40,149,0.12)', border: '1px solid var(--border)' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-dark)', fontSize: 11, fontWeight: 700 }}>
              {student.name[0]}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{student.name}, {student.age} лет</span>
          </div>
        )}
        <button onClick={reset} title="Начать заново" style={{ padding: 8, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
}
