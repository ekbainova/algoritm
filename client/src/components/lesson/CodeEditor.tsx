import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { TaskCard } from './TaskCard';
import { OutputPanel } from './OutputPanel';
import { AILoader } from '../ai/AILoader';
import { useStudentStore } from '../../store/studentStore';
import { usePyodide } from '../../hooks/usePyodide';
import { askClaudeJSON } from '../../api/claude';
import { GOAL_LABELS } from '../../types';
import type { Task, CodeReview } from '../../types';

const EDITOR_OPTIONS = {
  fontSize: 14, fontFamily: "'JetBrains Mono', monospace",
  minimap: { enabled: false }, lineNumbers: 'on' as const,
  automaticLayout: true, padding: { top: 16 },
  scrollBeyondLastLine: false, roundedSelection: true,
};

export function LessonScreen() {
  const { student, currentTask, currentCode, setCurrentCode, setCurrentTask, submitReview, trajectory } = useStudentStore();
  const { runCode, isLoading: pyodideLoading } = usePyodide();
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [generating, setGenerating] = useState(!currentTask);

  useEffect(() => { if (currentTask || !student) return; generateFirstTask(); }, [currentTask, student]);

  const generateFirstTask = async () => {
    if (!student) return;
    setGenerating(true);
    const currentModule = trajectory.find((s) => s.isCurrent)?.title || 'Переменные';
    const goalLabel = GOAL_LABELS[student.goal];
    try {
      const task = await askClaudeJSON<Task>(`Ты ALGO — учитель Python. Сгенерируй ПЕРВОЕ задание для ученика.\nУЧЕНИК: ${student.name}, ${student.age} лет, уровень: ${student.level}, цель: ${goalLabel}.\nТекущий модуль: ${currentModule}.\n\nСгенерируй задание в JSON (без markdown-блоков):\n{"id":"task-1","title":"Название задания","description":"Подробное описание. Пиши как другу.","exampleOutput":"Пример вывода","hint":"Подсказка","difficulty":"easy","conceptsTaught":["концепты"],"starterCode":"# начальный код\\n"}\nТематика должна соответствовать цели ученика.`);
      setCurrentTask(task);
    } catch { setCurrentTask({ id: 'task-1', title: 'Привет, Python!', description: 'Напиши программу, которая выводит приветствие. Используй print().', exampleOutput: 'Привет, мир!\nЯ учу Python!', hint: 'Используй print("текст")', difficulty: 'easy', conceptsTaught: ['print', 'строки'], starterCode: '# Напиши свой код здесь\n' }); }
    setGenerating(false);
  };

  const handleRun = useCallback(async () => {
    setOutput(''); setError(null);
    const result = await runCode(currentCode);
    setOutput(result.output); setError(result.error); setHasRun(true);
  }, [currentCode, runCode]);

  const handleSubmitReview = async () => {
    if (!currentTask || !student) return;
    setReviewing(true);
    const goalLabel = GOAL_LABELS[student.goal];
    try {
      const review = await askClaudeJSON<CodeReview>(`Ты ALGO — дружелюбный учитель Python для детей.\nУЧЕНИК: ${student.name}, ${student.age} лет, уровень: ${student.level}, цель: ${goalLabel}\nЗАДАНИЕ: ${currentTask.description}\nКОД:\n\`\`\`python\n${currentCode}\n\`\`\`\nВЫВОД: ${output || 'ничего'}\n\nJSON (без markdown-блоков):\n{"score":1-10,"summary":"обратись по имени","whatWasGreat":["1-3 пункта"],"whatToImprove":["0-2 пункта"],"correctedCode":"код или null","nextTaskHint":"интрига"}\nТон: как старший друг. Русский язык.`);
      submitReview(currentCode, review);
    } catch { submitReview(currentCode, { score: 7, summary: `${student.name}, хорошая работа!`, whatWasGreat: ['Код работает', 'Хороший подход'], whatToImprove: [], nextTaskHint: 'Следующее задание будет сложнее!' }); }
    setReviewing(false);
  };

  if (generating) return <div style={{ maxWidth: 500, margin: '64px auto', padding: 16 }}><AILoader message="ALGO готовит задание..." /></div>;
  if (!currentTask) return null;

  const btnBase = { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 100, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' } as const;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24, height: 'calc(100vh - 64px)' }}>
      {/* Device frame */}
      <div style={{
        width: '100%', maxWidth: 1100, display: 'flex', flexDirection: 'column',
        borderRadius: 20, background: '#1a1028',
        border: '1px solid var(--border-strong)',
        boxShadow: '0 40px 120px rgba(99,40,149,0.2), 0 0 0 1px rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}>
        {/* Browser bar */}
        <div style={{ height: 40, background: 'rgba(99,40,149,0.12)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: 24, padding: '4px 16px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>algoai.duckdns.org</span>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Left — Task */}
          <div style={{ width: '40%', padding: 32, overflowY: 'auto', background: 'linear-gradient(180deg, var(--purple) 0%, var(--purple-dark) 100%)' }}>
            <TaskCard task={currentTask} />
          </div>

          {/* Right — Editor + Output */}
          <div style={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
              <Editor height="100%" language="python" theme="vs-dark" value={currentCode}
                onChange={useCallback((val?: string) => setCurrentCode(val || ''), [setCurrentCode])}
                options={EDITOR_OPTIONS} />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, padding: '12px 24px', background: 'rgba(99,40,149,0.06)', borderTop: '1px solid rgba(99,40,149,0.1)', flexShrink: 0 }}>
              <button onClick={handleRun} disabled={pyodideLoading}
                style={{ ...btnBase, background: 'var(--purple-dark)', color: 'white', opacity: pyodideLoading ? 0.4 : 1 }}>
                ▶ {pyodideLoading ? 'Python загружается...' : 'Запустить'}
              </button>
              {hasRun && (
                <button onClick={handleSubmitReview} disabled={reviewing}
                  style={{ ...btnBase, background: 'var(--yellow)', color: 'var(--purple-dark)', opacity: reviewing ? 0.4 : 1 }}>
                  ✎ {reviewing ? 'Проверяю...' : 'Сдать на проверку'}
                </button>
              )}
            </div>

            {/* Output */}
            <div style={{ padding: '16px 24px', background: '#0f0a1a', borderTop: '1px solid rgba(99,40,149,0.1)', flexShrink: 0 }}>
              {reviewing ? <AILoader /> : <OutputPanel output={output} error={error} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
