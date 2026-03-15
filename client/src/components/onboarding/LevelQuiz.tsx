import { useState } from 'react';
import { Card } from '../shared/Card';
import { AIMessage } from '../ai/AIMessage';
import { AILoader } from '../ai/AILoader';
import { useStudentStore } from '../../store/studentStore';
import { askClaude } from '../../api/claude';
import { GOAL_LABELS } from '../../types';
import { Button } from '../shared/Button';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Что выведет этот код?\n\nprint(2 + 3 * 4)',
    options: ['20', '14', '24', 'Ошибка'],
    correct: 1, // 14
    explanation: 'Python соблюдает порядок операций: сначала умножение!',
  },
  {
    id: 2,
    question: "Что делает эта строка?\n\nname = input('Как тебя зовут? ')",
    options: ['Запрашивает ввод от пользователя', 'Выводит текст на экран', 'Создаёт список', 'Это ошибка'],
    correct: 0,
    explanation: 'input() ждёт, пока пользователь напишет что-то и нажмёт Enter',
  },
  {
    id: 3,
    question: 'Что выведет этот код?\n\nfor i in range(3):\n    print(i)',
    options: ['1 2 3', 'Ошибка', '0 1 2', '0 1 2 3'],
    correct: 2,
    explanation: 'range(3) создаёт числа от 0 до 2 включительно',
  },
  {
    id: 4,
    question: 'Что такое функция в Python?',
    options: ['Специальное слово языка', 'Тип данных', 'Способ вывести текст', 'Блок кода, который можно вызывать по имени'],
    correct: 3,
    explanation: 'Функция — это именованный блок кода, который можно использовать много раз',
  },
  {
    id: 5,
    question: 'Что выведет этот код?\n\nnumbers = [1, 2, 3]\nprint(numbers[-1])',
    options: ['1', '-1', 'Ошибка', '3'],
    correct: 3,
    explanation: 'Индекс -1 в Python означает последний элемент списка',
  },
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
      if (current < QUIZ_QUESTIONS.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowExplanation(false);
      } else {
        finishQuiz(newScore);
      }
    }, 2000);
  };

  const finishQuiz = (finalScore: number) => {
    const level = finalScore <= 1 ? 'beginner' : finalScore <= 3 ? 'intermediate' : 'advanced';
    if (student) {
      setStudent({ ...student, quizScore: finalScore, level });
    }
    setFinished(true);
    setAiLoading(true);

    const goalLabel = student ? GOAL_LABELS[student.goal] : '';
    askClaude(
      `Ученик ${student?.name} (${student?.age} лет) прошёл тест по Python: ${finalScore} из 5 правильных. Уровень: ${level}. Цель: ${goalLabel}. Напиши персональное сообщение: похвали или подбодри по результату, скажи что определил его уровень, намекни что дальше будет персональная траектория. Тон: как старший друг. 2-3 предложения. Русский язык. Без markdown.`
    )
      .then(setAiMessage)
      .catch(() => setAiMessage(`Отлично, ${student?.name}! Твой уровень определён. Сейчас я составлю персональную траекторию обучения специально для тебя!`))
      .finally(() => setAiLoading(false));
  };

  if (finished) {
    return (
      <div className="space-y-10 animate-fade-in">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-[24px] bg-[#ffd84d] flex items-center justify-center text-5xl shadow-[0_8px_24px_rgba(255,216,77,0.4)] mb-6">
            🎯
          </div>
          <h2 className="text-3xl font-extrabold text-[#3d1560]">Тест пройден!</h2>
          <p className="text-[#632895] mt-2 text-lg font-semibold">
            {score} из {QUIZ_QUESTIONS.length} правильных
          </p>
        </div>
        {aiLoading ? <AILoader /> : aiMessage && <AIMessage text={aiMessage} />}
        {!aiLoading && aiMessage && (
          <div className="text-center">
            <Button size="lg" onClick={() => setPhase('trajectory')}>
              Моя траектория &rarr;
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="flex gap-2 mb-10">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-3 rounded-full transition-all duration-300 ${
              i < current ? 'bg-[#ffd84d]' : i === current ? 'bg-[#632895]' : 'bg-[#632895]/15'
            }`}
          />
        ))}
      </div>

      <div className="text-sm font-bold text-[#632895] mb-3 uppercase tracking-wider">
        Вопрос {current + 1} из {QUIZ_QUESTIONS.length}
      </div>

      {/* Question */}
      <div className="bg-[#632895] rounded-[24px] p-7 shadow-[0_8px_32px_rgba(99,40,149,0.3)] mb-6">
        <pre className="whitespace-pre-wrap font-mono text-sm bg-white/10 p-5 rounded-2xl leading-relaxed text-white">
          {q.question}
        </pre>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let extraClass = '';
          if (selected !== null) {
            if (i === q.correct) extraClass = 'ring-3 ring-[#44d370] bg-[#44d370]/10';
            else if (i === selected) extraClass = 'ring-3 ring-[#EF4444] bg-[#EF4444]/10';
          }
          return (
            <Card
              key={i}
              dark
              onClick={() => handleSelect(i)}
              className={`p-5 ${extraClass}`}
              selected={selected === i && i === q.correct}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  selected === i && i === q.correct ? 'bg-[#44d370] text-white' :
                  selected === i ? 'bg-[#EF4444] text-white' :
                  'bg-[#ffd84d] text-[#3d1560]'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm font-semibold">{opt}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mt-5 p-5 rounded-[20px] bg-[#ffd84d] text-sm text-[#3d1560] font-semibold animate-fade-in">
          💡 {q.explanation}
        </div>
      )}
    </div>
  );
}
