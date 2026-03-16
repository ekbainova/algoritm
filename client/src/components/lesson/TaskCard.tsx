import { useState } from 'react';
import { Badge } from '../shared/Badge';
import type { Task } from '../../types';

interface TaskCardProps { task: Task; }

const DIFFICULTY_MAP = {
  easy: { label: 'Лёгкое', color: 'green' as const },
  medium: { label: 'Среднее', color: 'light' as const },
  hard: { label: 'Сложное', color: 'red' as const },
};

export function TaskCard({ task }: TaskCardProps) {
  const [showHint, setShowHint] = useState(false);
  const diff = DIFFICULTY_MAP[task.difficulty];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'white' }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
        Модуль 1 · Задание
      </div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{task.title}</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{task.description}</div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Badge color={diff.color}>{diff.label}</Badge>
        {task.conceptsTaught.map((c) => <Badge key={c} color="light">{c}</Badge>)}
      </div>

      {task.exampleOutput && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd84d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2 }}>Пример вывода</div>
          <pre style={{ background: 'rgba(255,255,255,0.06)', padding: 16, borderRadius: 16, fontSize: 13, lineHeight: 1.6, color: 'var(--green)', border: '1px solid rgba(255,255,255,0.05)' }}>{task.exampleOutput}</pre>
        </div>
      )}

      {task.hint && (
        <div>
          <button onClick={() => setShowHint(!showHint)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#ffd84d', fontFamily: 'inherit' }}>
            {showHint ? '▾ Скрыть подсказку' : '▸ Подсказка'}
          </button>
          {showHint && (
            <div style={{ marginTop: 12, padding: 16, borderRadius: 16, background: 'rgba(255,216,77,0.1)', border: '1px solid rgba(255,216,77,0.2)', color: '#ffd84d', fontSize: 13, fontWeight: 600, animation: 'fadeUp 0.3s ease forwards' }}>
              {task.hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
