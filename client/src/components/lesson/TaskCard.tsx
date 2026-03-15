import { useState } from 'react';
import { Badge } from '../shared/Badge';
import { Lightbulb } from 'lucide-react';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
}

const DIFFICULTY_MAP = {
  easy: { label: 'Лёгкое', color: 'green' as const },
  medium: { label: 'Среднее', color: 'yellow' as const },
  hard: { label: 'Сложное', color: 'red' as const },
};

export function TaskCard({ task }: TaskCardProps) {
  const [showHint, setShowHint] = useState(false);
  const diff = DIFFICULTY_MAP[task.difficulty];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-[24px] p-7 h-full flex flex-col text-white">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge color={diff.color}>{diff.label}</Badge>
        {task.conceptsTaught.map((c) => (
          <Badge key={c} color="purple">{c}</Badge>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-4">{task.title}</h3>

      <div className="text-sm leading-relaxed whitespace-pre-wrap flex-1 text-white/90">
        {task.description}
      </div>

      {task.exampleOutput && (
        <div className="mt-5">
          <div className="text-xs font-bold text-[#ffd84d] mb-2 uppercase tracking-wider">Пример вывода</div>
          <pre className="bg-white/10 p-4 rounded-2xl text-sm font-mono text-white leading-relaxed">
            {task.exampleOutput}
          </pre>
        </div>
      )}

      {task.hint && (
        <div className="mt-5">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-sm font-bold text-[#ffd84d] hover:text-[#ffe680] transition-colors cursor-pointer"
          >
            <Lightbulb size={16} />
            {showHint ? 'Скрыть подсказку' : 'Подсказка'}
          </button>
          {showHint && (
            <div className="mt-3 p-4 rounded-2xl bg-[#ffd84d] text-[#3d1560] text-sm font-semibold animate-fade-in">
              {task.hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
