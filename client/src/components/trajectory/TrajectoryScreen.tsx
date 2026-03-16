import { useState, useEffect, type CSSProperties } from 'react';
import { AIMessage } from '../ai/AIMessage';
import { AILoader } from '../ai/AILoader';
import { Button } from '../shared/Button';
import { useStudentStore } from '../../store/studentStore';
import { askClaudeJSON } from '../../api/claude';
import { GOAL_LABELS } from '../../types';
import type { TrajectoryStep } from '../../types';

interface TrajectoryResponse {
  personalMessage: string;
  totalWeeks: number;
  steps: Array<{ id: string; title: string; emoji: string; durationWeeks: number; description: string }>;
}

export function TrajectoryScreen() {
  const { student, setTrajectory, setPhase } = useStudentStore();
  const [data, setData] = useState<TrajectoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<TrajectoryStep[]>([]);

  useEffect(() => {
    if (!student) return;
    const goalLabel = GOAL_LABELS[student.goal];
    askClaudeJSON<TrajectoryResponse>(
      `Ты ALGO — учитель Python. Ученик: ${student.name}, ${student.age} лет, уровень: ${student.level}, цель: ${goalLabel}, времени: ${student.weeklyHours} часов в неделю.
Сгенерируй персональную траекторию обучения Python.
Ответь ТОЛЬКО JSON (без markdown-блоков):
{ "personalMessage": "2-3 предложения почему именно эта траектория", "totalWeeks": число, "steps": [{ "id": "string", "title": "Название модуля", "emoji": "один emoji", "durationWeeks": число, "description": "одно предложение" }] }
Шагов 5-7. Адаптируй под уровень и цель.`
    ).then((res) => { setData(res); setSteps(res.steps.map((s, i) => ({ ...s, isCompleted: false, isCurrent: i === 0 }))); })
      .catch(() => {
        const fb: TrajectoryResponse = { personalMessage: `${student.name}, я составила для тебя план обучения Python!`, totalWeeks: 14, steps: [
          { id: '1', title: 'Переменные и типы данных', emoji: '📦', durationWeeks: 2, description: 'Научишься хранить данные' },
          { id: '2', title: 'Условия и логика', emoji: '🔀', durationWeeks: 2, description: 'Программа научится принимать решения' },
          { id: '3', title: 'Циклы', emoji: '🔁', durationWeeks: 2, description: 'Автоматизируем повторения' },
          { id: '4', title: 'Функции', emoji: '⚙️', durationWeeks: 2, description: 'Организуем код в блоки' },
          { id: '5', title: 'Списки и словари', emoji: '📋', durationWeeks: 3, description: 'Работа с коллекциями' },
          { id: '6', title: 'Финальный проект', emoji: '🚀', durationWeeks: 3, description: 'Создадим настоящий проект!' },
        ]};
        setData(fb); setSteps(fb.steps.map((s, i) => ({ ...s, isCompleted: false, isCurrent: i === 0 })));
      }).finally(() => setLoading(false));
  }, [student]);

  if (loading) return <AILoader message="ALGO составляет твою траекторию..." />;

  const dotStyle = (step: TrajectoryStep): CSSProperties => ({
    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700,
    background: step.isCompleted ? 'var(--green)' : step.isCurrent ? 'var(--yellow)' : 'rgba(255,255,255,0.08)',
    color: step.isCompleted ? 'white' : step.isCurrent ? 'var(--purple-dark)' : 'var(--text-muted)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, animation: 'fadeUp 0.6s ease forwards' }}>
      {data && <AIMessage text={data.personalMessage} />}
      <h2 style={{ fontSize: 24, fontWeight: 900, textAlign: 'center', background: 'linear-gradient(135deg, var(--purple-dark), var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Твоя траектория</h2>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {steps.map((step, i) => (
          <div key={step.id} style={{ animation: `fadeUp 0.5s ${i * 0.1}s ease forwards`, opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
              <div style={dotStyle(step)}>
                {step.isCompleted ? '✓' : step.isCurrent ? '▶' : i + 1}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: step.isCurrent || step.isCompleted ? 'var(--text)' : 'var(--text-muted)' }}>{step.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {step.isCompleted ? `${step.durationWeeks * 2} задания · завершён` : step.isCurrent ? `В процессе · задание 1 из ${step.durationWeeks * 2}` : step.description || 'Скоро'}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 2, height: 12, marginLeft: 17, background: 'rgba(99,40,149,0.08)' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', paddingTop: 16 }}>
        <Button size="lg" onClick={() => { setTrajectory(steps); setPhase('lesson'); }}>Начинаем! Первое задание →</Button>
      </div>
    </div>
  );
}
