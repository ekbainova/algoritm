import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '../shared/Button';
import { AIMessage } from '../ai/AIMessage';
import { AILoader } from '../ai/AILoader';
import { useStudentStore } from '../../store/studentStore';
import { askClaudeJSON } from '../../api/claude';
import { GOAL_LABELS } from '../../types';
import type { Task } from '../../types';
import { ChevronDown, ChevronUp, Rocket } from 'lucide-react';

export function ReviewScreen() {
  const { student, lastReview, currentTask, taskHistory, trajectory, setCurrentTask } = useStudentStore();
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!lastReview || !student) return null;

  const stars = Array.from({ length: 10 }, (_, i) => i < lastReview.score ? '⭐' : '☆').join('');

  const handleNextTask = async () => {
    if (!currentTask) return;
    setLoading(true);
    const goalLabel = GOAL_LABELS[student.goal];
    const currentModule = trajectory.find((s) => s.isCurrent)?.title || '';

    try {
      const task = await askClaudeJSON<Task>(
        `Ты ALGO — учитель Python. Следующее задание.
УЧЕНИК: ${student.name}, ${student.age} лет, уровень: ${student.level}, цель: ${goalLabel}.
Модуль: ${currentModule}. Прошлое: ${currentTask.title}, оценка: ${lastReview.score}/10.
Пройдено: ${taskHistory.map((t) => t.task.title).join(', ')}

JSON (без markdown-блоков):
{
  "id": "task-${taskHistory.length + 1}",
  "title": "Название",
  "description": "Описание",
  "exampleOutput": "Пример",
  "hint": "Подсказка",
  "difficulty": "easy|medium|hard",
  "conceptsTaught": ["концепты"],
  "starterCode": "# код\\n"
}
score<6 — проще, score>=6 — сложнее, score=10 — challenge. Не повторять.`
      );
      setCurrentTask(task);
    } catch {
      setCurrentTask({
        id: `task-${taskHistory.length + 1}`,
        title: 'Следующий вызов',
        description: 'Напиши программу, которая решает новую задачу!',
        exampleOutput: '',
        hint: 'Вспомни, что изучил раньше',
        difficulty: 'medium',
        conceptsTaught: ['практика'],
        starterCode: '# Твой код здесь\n',
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AILoader />
        <p className="text-center text-[#632895] text-sm font-medium">ALGO готовит следующее задание...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Score */}
      <div className="bg-[#632895] rounded-[28px] p-8 text-center shadow-[0_8px_32px_rgba(99,40,149,0.3)]">
        <div className="text-3xl mb-3">{stars}</div>
        <div className="text-3xl font-extrabold text-white">{lastReview.score} / 10</div>
      </div>

      <AIMessage text={lastReview.summary} />

      {/* What was great */}
      {lastReview.whatWasGreat.length > 0 && (
        <div className="bg-[#632895] rounded-[24px] p-7 text-white shadow-[0_4px_16px_rgba(99,40,149,0.2)]">
          <h3 className="font-bold mb-4 text-[#44d370] flex items-center gap-2 text-lg">
            ✅ Что хорошо
          </h3>
          <ul className="space-y-3">
            {lastReview.whatWasGreat.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                <span className="text-[#44d370] mt-0.5 text-lg">●</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What to improve */}
      {lastReview.whatToImprove.length > 0 && (
        <div className="bg-[#632895] rounded-[24px] p-7 text-white shadow-[0_4px_16px_rgba(99,40,149,0.2)]">
          <h3 className="font-bold mb-4 text-[#ffd84d] flex items-center gap-2 text-lg">
            💡 Что улучшить
          </h3>
          <ul className="space-y-3">
            {lastReview.whatToImprove.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                <span className="text-[#ffd84d] mt-0.5 text-lg">●</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Corrected code */}
      {lastReview.correctedCode && (
        <div className="bg-white rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">
          <button
            onClick={() => setShowCode(!showCode)}
            className="w-full flex items-center justify-between p-5 hover:bg-[#f8f5fb] transition-colors cursor-pointer font-bold text-sm text-[#632895]"
          >
            Показать улучшенный код
            {showCode ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showCode && (
            <div className="border-t border-[#632895]/10">
              <Editor
                height="200px"
                language="python"
                theme="vs"
                value={lastReview.correctedCode}
                options={{
                  readOnly: true,
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Next task hint */}
      <div className="text-center p-5 text-sm text-[#3d1560] font-semibold italic bg-[#ffd84d] rounded-[20px]">
        "{lastReview.nextTaskHint}"
      </div>

      <div className="text-center pt-2">
        <Button size="lg" onClick={handleNextTask}>
          <Rocket size={20} />
          Следующее задание!
        </Button>
      </div>
    </div>
  );
}
