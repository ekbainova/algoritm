import { useState, useEffect } from 'react';
import { AIMessage } from '../ai/AIMessage';
import { AILoader } from '../ai/AILoader';
import { Button } from '../shared/Button';
import { useStudentStore } from '../../store/studentStore';
import { askClaudeJSON } from '../../api/claude';
import { GOAL_LABELS } from '../../types';
import type { TrajectoryStep } from '../../types';
import { Lock, CheckCircle } from 'lucide-react';

interface TrajectoryResponse {
  personalMessage: string;
  totalWeeks: number;
  steps: Array<{
    id: string;
    title: string;
    emoji: string;
    durationWeeks: number;
    description: string;
  }>;
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
{
  "personalMessage": "2-3 предложения почему именно эта траектория",
  "totalWeeks": число,
  "steps": [
    { "id": "string", "title": "Название модуля", "emoji": "один emoji", "durationWeeks": число, "description": "одно предложение" }
  ]
}
Шагов 5-7. Адаптируй под уровень и цель.`
    )
      .then((res) => {
        setData(res);
        setSteps(res.steps.map((s, i) => ({ ...s, isCompleted: false, isCurrent: i === 0 })));
      })
      .catch(() => {
        const fallback: TrajectoryResponse = {
          personalMessage: `${student.name}, я составил для тебя план обучения Python!`,
          totalWeeks: 14,
          steps: [
            { id: '1', title: 'Переменные и типы данных', emoji: '📦', durationWeeks: 2, description: 'Научишься хранить данные' },
            { id: '2', title: 'Условия и логика', emoji: '🔀', durationWeeks: 2, description: 'Программа научится принимать решения' },
            { id: '3', title: 'Циклы', emoji: '🔁', durationWeeks: 2, description: 'Автоматизируем повторения' },
            { id: '4', title: 'Функции', emoji: '⚙️', durationWeeks: 2, description: 'Организуем код в блоки' },
            { id: '5', title: 'Списки и словари', emoji: '📋', durationWeeks: 3, description: 'Работа с коллекциями' },
            { id: '6', title: 'Финальный проект', emoji: '🚀', durationWeeks: 3, description: 'Создадим настоящий проект!' },
          ],
        };
        setData(fallback);
        setSteps(fallback.steps.map((s, i) => ({ ...s, isCompleted: false, isCurrent: i === 0 })));
      })
      .finally(() => setLoading(false));
  }, [student]);

  const handleStart = () => {
    setTrajectory(steps);
    setPhase('lesson');
  };

  if (loading) {
    return (
      <div className="max-w-lg w-full mx-auto py-16 px-4 space-y-6">
        <AILoader />
        <p className="text-center text-[#632895] text-sm font-medium">ALGO составляет твою траекторию...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full mx-auto py-10 px-4 space-y-8 animate-fade-in">
      {data && <AIMessage text={data.personalMessage} />}

      <h2 className="text-2xl font-extrabold text-center text-[#3d1560] mt-6">Твоя траектория</h2>

      {/* Timeline */}
      <div className="relative pl-10">
        <div className="absolute left-[18px] top-6 bottom-6 w-[3px] bg-gradient-to-b from-[#632895] to-[#632895]/20 rounded-full" />

        <div className="space-y-5">
          {steps.map((step, i) => (
            <div key={step.id} className="relative flex items-start gap-5 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div
                className={`absolute left-[-26px] w-7 h-7 rounded-full flex items-center justify-center text-xs z-10 ${
                  step.isCurrent
                    ? 'bg-[#ffd84d] text-[#3d1560] ring-4 ring-[#ffd84d]/30 shadow-[0_4px_12px_rgba(255,216,77,0.4)]'
                    : step.isCompleted
                    ? 'bg-[#44d370] text-white'
                    : 'bg-[#632895]/20 text-[#632895]'
                }`}
              >
                {step.isCompleted ? <CheckCircle size={14} /> : step.isCurrent ? <span className="text-xs font-bold">▶</span> : <Lock size={11} />}
              </div>

              <div
                className={`flex-1 rounded-[20px] p-5 transition-all ${
                  step.isCurrent
                    ? 'bg-[#632895] text-white shadow-[0_8px_32px_rgba(99,40,149,0.3)]'
                    : 'bg-white/60 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{step.emoji}</span>
                    <span className="font-bold text-sm">{step.title}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    step.isCurrent ? 'bg-white/15 text-white' : 'bg-[#632895]/10 text-[#632895]'
                  }`}>{step.durationWeeks} нед.</span>
                </div>
                {step.description && (
                  <p className={`text-xs mt-2 ml-9 ${step.isCurrent ? 'text-white/70' : 'text-[#6B7280]'}`}>{step.description}</p>
                )}
                {step.isCurrent && (
                  <span className="inline-block mt-3 ml-9 px-3 py-1 rounded-full bg-[#ffd84d] text-[#3d1560] text-xs font-bold">
                    Сейчас
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <Button size="lg" onClick={handleStart}>
          Начинаем! Первое задание &rarr;
        </Button>
      </div>
    </div>
  );
}
