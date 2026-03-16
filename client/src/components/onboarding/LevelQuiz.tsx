import { useState } from 'react';
import { Card } from '../shared/Card';
import { AIMessage } from '../ai/AIMessage';
import { AILoader } from '../ai/AILoader';
import { useStudentStore } from '../../store/studentStore';
import { askClaude } from '../../api/claude';
import { GOAL_LABELS } from '../../types';
import { Button } from '../shared/Button';

const QUIZ_QUESTIONS = [
  { id: 1, question: 'Что выведет этот код?\n\nprint(2 + 3 * 4)', options: ['20', '14', '24', 'Ошибка'], correct: 1, explanation: 'Python соблюдает порядок операций: сначала умножение!' },
  { id: 2, question: "Что делает эта строка?\n\nname = input('Как тебя зовут? ')", options: ['Запрашивает ввод от пользователя', 'Выводит текст на экран', 'Создаёт список', 'Это ошибка'], correct: 0, explanation: 'input() ждёт, пока пользователь напишет что-то и нажмёт Enter' },
  { id: 3, question: 'Что выведет этот код?\n\nfor i in range(3):\n    print(i)', options: ['1 2 3', 'Ошибка', '0 1 2', '0 1 2 3'], correct: 2, explanation: 'range(3) создаёт числа от 0 до 2 включительно' },
  { id: 4, question: 'Что такое функция в Python?', options: ['Специальное слово языка', 'Тип данных', 'Способ вывести текст', 'Блок кода, который можно вызывать по имени'], correct: 3, explanation: 'Функция — это именованный блок кода, который можно использовать много раз' },
  { id: 5, question: 'Что выведет этот код?\n\nnumbers = [1, 2, 3]\nprint(numbers[-1])', options: ['1', '-1', 'Ошибка', '3'], correct: 3, explanation: 'Индекс -1 в Python означает последний элемент списка' },
];

export function LevelQuiz() {
  const { student, setStudent, setPhase } = useStudentStore();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const q = QUIZ_QUESTIONS[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const newScore = idx === q.correct ? score + 1 : score;
    if (idx === q.correct) setScore(newScore);
    setTimeout(() => {
      if (current < QUIZ_QUESTIONS.length - 1) { setCurrent((c) => c + 1); setSelected(null); setShowExplanation(false); }
      else finishQuiz(newScore);
    }, 2000);
  };

  const finishQuiz = (finalScore: number) => {
    const level = finalScore <= 1 ? 'beginner' : finalScore <= 3 ? 'intermediate' : 'advanced';
    if (student) setStudent({ ...student, quizScore: finalScore, level });
    setFinished(true); setAiLoading(true);
    const goalLabel = student ? GOAL_LABELS[student.goal] : '';
    askClaude(`Ученик ${student?.name} (${student?.age} лет) прошёл тест по Python: ${finalScore} из 5 правильных. Уровень: ${level}. Цель: ${goalLabel}. Напиши персональное сообщение: похвали или подбодри по результату, скажи что определил его уровень, намекни что дальше будет персональная траектория. Тон: как старший друг. 2-3 предложения. Русский язык. Без markdown.`)
      .then(setAiMessage)
      .catch(() => setAiMessage(`Отлично, ${student?.name}! Твой уровень определён. Сейчас я составлю персональную траекторию обучения специально для тебя!`))
      .finally(() => setAiLoading(false));
  };

  if (finished) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, animation: 'fadeUp 0.6s ease forwards' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, margin: '0 auto', borderRadius: 24, background: 'linear-gradient(135deg, var(--yellow), var(--yellow-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, boxShadow: '0 0 40px var(--yellow-glow)', marginBottom: 24 }}>🎯</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, var(--purple-dark), var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Тест пройден!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 18, fontWeight: 600 }}>{score} из {QUIZ_QUESTIONS.length} правильных</p>
        </div>
        {aiLoading ? <AILoader /> : aiMessage && <AIMessage text={aiMessage} />}
        {!aiLoading && aiMessage && (
          <div style={{ textAlign: 'center' }}><Button size="lg" onClick={() => setPhase('trajectory')}>Моя траектория →</Button></div>
        )}
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeUp 0.6s ease forwards' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
        {QUIZ_QUESTIONS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < current ? 'var(--yellow)' : i === current ? 'var(--purple)' : 'rgba(99,40,149,0.15)', transition: 'all 0.3s' }} />
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 3 }}>
        Вопрос {current + 1} из {QUIZ_QUESTIONS.length}
      </div>

      <div style={{ borderRadius: 24, padding: 28, background: 'linear-gradient(135deg, var(--purple), var(--purple-dark))', boxShadow: '0 8px 40px rgba(99,40,149,0.3)', marginBottom: 24 }}>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: "'JetBrains Mono', monospace", fontSize: 14, background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 16, lineHeight: 1.6, color: 'white' }}>{q.question}</pre>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {q.options.map((opt, i) => {
          const isCorrect = selected !== null && i === q.correct;
          const isWrong = selected === i && i !== q.correct;
          const borderColor = isCorrect ? 'rgba(68,211,112,0.5)' : isWrong ? 'rgba(239,68,68,0.5)' : undefined;
          return (
            <Card key={i} onClick={() => handleSelect(i)} selected={isCorrect} style={{ padding: 20, ...(borderColor ? { border: `2px solid ${borderColor}` } : {}) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                  background: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'linear-gradient(135deg, var(--purple), var(--purple-dark))',
                  color: isCorrect || isWrong ? 'white' : 'var(--yellow)',
                }}>{String.fromCharCode(65 + i)}</div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{opt}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {showExplanation && (
        <div style={{ marginTop: 20, padding: 20, borderRadius: 20, background: 'linear-gradient(135deg, rgba(255,216,77,0.12), rgba(255,216,77,0.04))', border: '1px solid rgba(255,216,77,0.2)', fontSize: 14, fontWeight: 600, color: 'var(--purple)', animation: 'fadeUp 0.4s ease forwards' }}>
          💡 {q.explanation}
        </div>
      )}
    </div>
  );
}
