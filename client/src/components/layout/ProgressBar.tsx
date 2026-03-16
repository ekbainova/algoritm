import { useStudentStore } from '../../store/studentStore';

export function ProgressBar() {
  const { trajectory } = useStudentStore();
  if (trajectory.length === 0) return null;

  const completed = trajectory.filter((s) => s.isCompleted).length;
  const currentIdx = trajectory.findIndex((s) => s.isCurrent);
  const pct = trajectory.length > 0 ? ((completed + (currentIdx >= 0 ? 0.5 : 0)) / trajectory.length) * 100 : 0;

  return (
    <div style={{ padding: '12px 48px', background: '#f8f5fb', borderBottom: '1px solid rgba(99,40,149,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>Прогресс по траектории</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)' }}>{completed} / {trajectory.length} модулей</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(to right, var(--yellow), var(--yellow-hover))', borderRadius: 4, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}
