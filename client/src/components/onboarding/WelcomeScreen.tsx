import { useState, useEffect } from 'react';
import { Button } from '../shared/Button';
import { AIMessage } from '../ai/AIMessage';
import { AILoader } from '../ai/AILoader';
import { useStudentStore } from '../../store/studentStore';
import { askClaude } from '../../api/claude';

export function WelcomeScreen() {
  const { setPhase } = useStudentStore();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    askClaude(
      'Ты ALGO — дружелюбный AI-учитель Python для детей в школе Алгоритмика. Поприветствуй нового ученика. Скажи кто ты, что умеешь делать, что вместе изучите Python. Тон: как старший друг, не учитель. 2-3 предложения. Только русский язык. Без markdown.'
    )
      .then(setGreeting)
      .catch(() => setGreeting('Привет! Я ALGO — твой персональный AI-учитель Python. Вместе мы пройдём путь от первой строчки кода до настоящих проектов. Погнали!'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-12 animate-fade-in">
      {/* Avatar */}
      <div className="animate-float">
        <div className="w-36 h-36 rounded-[32px] bg-gradient-to-br from-[#632895] to-[#3d1560] flex items-center justify-center text-7xl shadow-[0_12px_40px_rgba(99,40,149,0.4)] border-4 border-[#ffd84d]/30">
          🤖
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-3 text-[#3d1560]">ALGO</h1>
        <p className="text-[#632895] text-xl font-semibold">Твой учитель Python</p>
      </div>

      <div className="w-full">
        {loading ? <AILoader /> : <AIMessage text={greeting} />}
      </div>

      <Button size="lg" onClick={() => setPhase('profile')} disabled={loading}>
        Привет, ALGO! &rarr;
      </Button>
    </div>
  );
}
