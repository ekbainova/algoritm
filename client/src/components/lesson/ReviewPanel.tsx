import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '../shared/Button';
import { AIMessage } from '../ai/AIMessage';
import { AILoader } from '../ai/AILoader';
import { useStudentStore } from '../../store/studentStore';
import { askClaudeJSON } from '../../api/claude';
import { GOAL_LABELS } from '../../types';
import type { Task } from '../../types';

export function ReviewScreen() {
  const { student, lastReview, currentTask, taskHistory, trajectory, setCurrentTask } = useStudentStore();
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!lastReview || !student) return null;

  const handleNextTask = async () => {
    if (!currentTask) return;
    setLoading(true);
    const goalLabel = GOAL_LABELS[student.goal];
    const currentModule = trajectory.find((s) => s.isCurrent)?.title || '';
    try {
      const task = await askClaudeJSON<Task>(`Ты ALGO — учитель Python. Следующее задание.\nУЧЕНИК: ${student.name}, ${student.age} лет, уровень: ${student.level}, цель: ${goalLabel}.\nМодуль: ${currentModule}. Прошлое: ${currentTask.title}, оценка: ${lastReview.score}/10.\nПройдено: ${taskHistory.map((t) => t.task.title).join(', ')}\n\nJSON (без markdown-блоков):\n{"id":"task-${taskHistory.length + 1}","title":"Название","description":"Описание","exampleOutput":"Пример","hint":"Подсказка","difficulty":"easy|medium|hard","conceptsTaught":["концепты"],"starterCode":"# код\\n"}\nscore<6 — проще, score>=6 — сложнее, score=10 — challenge. Не повторять.`);
      setCurrentTask(task);
    } catch { setCurrentTask({ id: `task-${taskHistory.length + 1}`, title: 'Следующий вызов', description: 'Напиши программу, которая решает новую задачу!', exampleOutput: '', hint: 'Вспомни, что изучил раньше', difficulty: 'medium', conceptsTaught: ['практика'], starterCode: '# Твой код здесь\n' }); }
    setLoading(false);
  };

  if (loading) return <AILoader message="ALGO готовит следующее задание..." />;

  const sectionStyle = { borderRadius: 24, padding: 28, background: 'linear-gradient(135deg, var(--purple), var(--purple-dark))', boxShadow: '0 4px 24px rgba(99,40,149,0.2)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, animation: 'fadeUp 0.6s ease forwards' }}>
      {/* Score */}
      <div style={{ ...sectionStyle, textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: 'white' }}>{lastReview.score} / 10</div>
      </div>

      <AIMessage text={lastReview.summary} />

      {lastReview.whatWasGreat.length > 0 && (
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--green)', fontSize: 18 }}>✅ Что хорошо</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lastReview.whatWasGreat.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ color: 'var(--green)', fontSize: 18 }}>●</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {lastReview.whatToImprove.length > 0 && (
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--purple)', fontSize: 18 }}>💡 Что улучшить</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lastReview.whatToImprove.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ color: 'var(--purple)', fontSize: 18 }}>●</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {lastReview.correctedCode && (
        <div style={{ borderRadius: 24, overflow: 'hidden', background: '#1a1028', border: '1px solid var(--border-strong)' }}>
          <button onClick={() => setShowCode(!showCode)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: 20, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit' }}>
            {showCode ? '▾ Скрыть код' : '▸ Показать улучшенный код'}
          </button>
          {showCode && (
            <div style={{ borderTop: '1px solid var(--border)' }}>
              <Editor height="200px" language="python" theme="vs-dark" value={lastReview.correctedCode}
                options={{ readOnly: true, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false }} />
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', padding: 20, borderRadius: 20, background: 'linear-gradient(135deg, rgba(255,216,77,0.1), rgba(255,216,77,0.04))', border: '1px solid rgba(255,216,77,0.15)', fontSize: 14, fontWeight: 600, fontStyle: 'italic', color: 'var(--purple)' }}>
        "{lastReview.nextTaskHint}"
      </div>

      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <Button size="lg" onClick={handleNextTask}>🚀 Следующее задание!</Button>
      </div>
    </div>
  );
}
