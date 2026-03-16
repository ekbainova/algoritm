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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48, animation: 'fadeUp 0.8s ease forwards' }}>
      {/* Avatar */}
      <div style={{ animation: 'float 3s ease-in-out infinite' }}>
        <div style={{
          width: 144, height: 144, borderRadius: 32,
          background: 'linear-gradient(135deg, var(--purple), var(--purple-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 72,
          boxShadow: '0 12px 60px rgba(99,40,149,0.4)',
          border: '1px solid rgba(99,40,149,0.3)',
        }}>
          🤖
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 48, fontWeight: 900, marginBottom: 12,
          background: 'linear-gradient(135deg, var(--purple-dark) 0%, var(--purple) 50%, var(--yellow) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>ALGO</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 20, fontWeight: 600 }}>Твой учитель Python</p>
      </div>

      <div style={{ width: '100%' }}>
        {loading ? <AILoader /> : <AIMessage text={greeting} />}
      </div>

      <Button size="lg" onClick={() => setPhase('profile')} disabled={loading}>
        Привет, ALGO! →
      </Button>
    </div>
  );
}
