import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send } from 'lucide-react';
import { Button } from '../shared/Button';
import { OutputPanel } from './OutputPanel';
import { TaskCard } from './TaskCard';
import { AILoader } from '../ai/AILoader';
import { useStudentStore } from '../../store/studentStore';
import { usePyodide } from '../../hooks/usePyodide';
import { askClaudeJSON } from '../../api/claude';
import { GOAL_LABELS } from '../../types';
import type { Task, CodeReview } from '../../types';

const EDITOR_OPTIONS = {
  fontSize: 14,
  fontFamily: "'JetBrains Mono', monospace",
  minimap: { enabled: false },
  lineNumbers: 'on' as const,
  automaticLayout: true,
  padding: { top: 16 },
  scrollBeyondLastLine: false,
  roundedSelection: true,
};

export function LessonScreen() {
  const { student, currentTask, currentCode, setCurrentCode, setCurrentTask, submitReview, trajectory } = useStudentStore();
  const { runCode, isLoading: pyodideLoading } = usePyodide();
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [generating, setGenerating] = useState(!currentTask);

  useEffect(() => {
    if (currentTask || !student) return;
    generateFirstTask();
  }, [currentTask, student]);

  const generateFirstTask = async () => {
    if (!student) return;
    setGenerating(true);
    const currentModule = trajectory.find((s) => s.isCurrent)?.title || 'Переменные';
    const goalLabel = GOAL_LABELS[student.goal];

    try {
      const task = await askClaudeJSON<Task>(
        `Ты ALGO — учитель Python. Сгенерируй ПЕРВОЕ задание для ученика.
УЧЕНИК: ${student.name}, ${student.age} лет, уровень: ${student.level}, цель: ${goalLabel}.
Текущий модуль: ${currentModule}.

Сгенерируй задание в JSON (без markdown-блоков):
{
  "id": "task-1",
  "title": "Название задания",
  "description": "Подробное описание. Пиши как другу.",
  "exampleOutput": "Пример вывода",
  "hint": "Подсказка",
  "difficulty": "easy",
  "conceptsTaught": ["концепты"],
  "starterCode": "# начальный код\\n"
}
Тематика должна соответствовать цели ученика.`
      );
      setCurrentTask(task);
    } catch {
      setCurrentTask({
        id: 'task-1',
        title: 'Привет, Python!',
        description: 'Напиши программу, которая выводит приветствие. Используй print().',
        exampleOutput: 'Привет, мир!\nЯ учу Python!',
        hint: 'Используй print("текст")',
        difficulty: 'easy',
        conceptsTaught: ['print', 'строки'],
        starterCode: '# Напиши свой код здесь\n',
      });
    }
    setGenerating(false);
  };

  const handleRun = useCallback(async () => {
    setOutput('');
    setError(null);
    const result = await runCode(currentCode);
    setOutput(result.output);
    setError(result.error);
    setHasRun(true);
  }, [currentCode, runCode]);

  const handleSubmitReview = async () => {
    if (!currentTask || !student) return;
    setReviewing(true);
    const goalLabel = GOAL_LABELS[student.goal];

    try {
      const review = await askClaudeJSON<CodeReview>(
        `Ты ALGO — дружелюбный учитель Python для детей.
УЧЕНИК: ${student.name}, ${student.age} лет, уровень: ${student.level}, цель: ${goalLabel}
ЗАДАНИЕ: ${currentTask.description}
КОД:\n\`\`\`python\n${currentCode}\n\`\`\`
ВЫВОД: ${output || 'ничего'}

JSON (без markdown-блоков):
{
  "score": 1-10,
  "summary": "обратись по имени",
  "whatWasGreat": ["1-3 пункта"],
  "whatToImprove": ["0-2 пункта"],
  "correctedCode": "код или null",
  "nextTaskHint": "интрига"
}
Тон: как старший друг. Русский язык.`
      );
      submitReview(currentCode, review);
    } catch {
      submitReview(currentCode, {
        score: 7,
        summary: `${student.name}, хорошая работа!`,
        whatWasGreat: ['Код работает', 'Хороший подход'],
        whatToImprove: [],
        nextTaskHint: 'Следующее задание будет сложнее!',
      });
    }
    setReviewing(false);
  };

  if (generating) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4">
        <AILoader message="ALGO готовит задание..." />
      </div>
    );
  }

  if (!currentTask) return null;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left — Task */}
      <div className="w-[40%] p-5 overflow-y-auto bg-[#632895]">
        <TaskCard task={currentTask} />
      </div>

      {/* Right — Editor + Output */}
      <div className="w-[60%] flex flex-col bg-white">
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language="python"
            theme="vs"
            value={currentCode}
            onChange={useCallback((val?: string) => setCurrentCode(val || ''), [setCurrentCode])}
            options={EDITOR_OPTIONS}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-4 bg-[#f8f5fb] border-t border-[#632895]/10">
          <Button
            onClick={handleRun}
            variant="dark"
            disabled={pyodideLoading}
            size="sm"
          >
            <Play size={16} />
            {pyodideLoading ? 'Python загружается...' : 'Запустить'}
          </Button>
          {hasRun && (
            <Button
              onClick={handleSubmitReview}
              disabled={reviewing}
              size="sm"
            >
              <Send size={16} />
              {reviewing ? 'Проверяю...' : 'Сдать на проверку'}
            </Button>
          )}
        </div>

        {/* Output */}
        <div className="p-4 pt-0">
          {reviewing ? <AILoader /> : <OutputPanel output={output} error={error} />}
        </div>
      </div>
    </div>
  );
}
