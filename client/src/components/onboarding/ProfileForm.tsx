import { useState, type CSSProperties } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useStudentStore } from '../../store/studentStore';
import type { StudentGoal } from '../../types';

const GOALS: { value: StudentGoal; emoji: string; title: string; desc: string }[] = [
  { value: 'make_game', emoji: '🎮', title: 'Сделать свою игру', desc: 'Хочу создать игру как в Roblox' },
  { value: 'get_job', emoji: '👨‍💻', title: 'Стать программистом', desc: 'Хочу работать разработчиком' },
  { value: 'automate', emoji: '⚡', title: 'Автоматизировать', desc: 'Надоело делать одно и то же' },
  { value: 'learn_ml', emoji: '🤖', title: 'Изучить нейросети', desc: 'Хочу понять как работает AI' },
  { value: 'school_project', emoji: '🏆', title: 'Для олимпиады', desc: 'Нужно для ЕГЭ или контеста' },
  { value: 'just_curious', emoji: '🔍', title: 'Просто интересно', desc: 'Хочу разобраться, что это' },
];

const HOURS = [
  { value: 1, label: '1 час/нед' },
  { value: 3, label: '2-3 часа' },
  { value: 5, label: '4-5 часов' },
  { value: 7, label: 'Каждый день' },
];

type Experience = 'none' | 'some' | 'confident';

const inputStyle: CSSProperties = {
  width: '100%', padding: '16px 24px', borderRadius: 16,
  border: '1px solid rgba(99,40,149,0.15)', background: 'white',
  color: 'var(--text)', fontSize: 15, fontWeight: 500,
  fontFamily: 'inherit', outline: 'none',
};

const labelStyle: CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 16,
  color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: 3,
};

const labelOnPurple: CSSProperties = {
  ...labelStyle,
  color: '#ffd84d',
};

const sectionGap = 40;

export function ProfileForm() {
  const { setStudent, setPhase } = useStudentStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [experience, setExperience] = useState<Experience | null>(null);
  const [experienceDuration, setExperienceDuration] = useState('');
  const [goal, setGoal] = useState<StudentGoal | null>(null);
  const [hours, setHours] = useState<number | null>(null);

  const parsedAge = parseInt(age);
  const validAge = !isNaN(parsedAge) && parsedAge >= 6 && parsedAge <= 18;
  const canSubmit = name.trim() && validAge && goal && hours && experience;

  const handleSubmit = () => {
    if (!canSubmit || !goal || !hours || !experience) return;
    setStudent({ name: name.trim(), age: parsedAge, pythonExperience: experience, experienceDuration: experienceDuration || undefined, goal, weeklyHours: hours, quizScore: 0, level: 'beginner' });
    setPhase('quiz');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, animation: 'fadeUp 0.6s ease forwards' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, var(--purple-dark), var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Расскажи о себе</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 16, fontWeight: 500 }}>Чтобы ALGO построила твою персональную траекторию</p>
      </div>

      <div style={{ borderRadius: 28, padding: 32, background: 'linear-gradient(135deg, var(--purple), var(--purple-dark))', boxShadow: '0 8px 40px rgba(99,40,149,0.3)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <label style={labelOnPurple}>Имя</label>
            <input style={inputStyle} type="text" placeholder="Как тебя зовут?" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label style={labelOnPurple}>Возраст</label>
            <input style={inputStyle} type="number" placeholder="Сколько тебе лет?" value={age} onChange={(e) => setAge(e.target.value)} min={6} max={18} />
          </div>
        </div>
      </div>

      {name && age && (
        <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
          <label style={labelStyle}>Опыт с Python</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {([
              { value: 'none' as Experience, emoji: '🌱', label: 'Никогда не пробовал' },
              { value: 'some' as Experience, emoji: '📖', label: 'Чуть-чуть знаю' },
              { value: 'confident' as Experience, emoji: '💪', label: 'Уже умею' },
            ]).map((opt) => (
              <Card key={opt.value} selected={experience === opt.value} onClick={() => setExperience(opt.value)} style={{ padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{opt.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
              </Card>
            ))}
          </div>
          {experience && experience !== 'none' && (
            <div style={{ marginTop: 20, borderRadius: 20, padding: 24, background: 'linear-gradient(135deg, var(--purple), var(--purple-dark))' }}>
              <input style={inputStyle} type="text" placeholder="Как давно? (напр. полгода)" value={experienceDuration} onChange={(e) => setExperienceDuration(e.target.value)} />
            </div>
          )}
        </div>
      )}

      {experience && (
        <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
          <label style={labelStyle}>Твоя цель</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {GOALS.map((g) => (
              <Card key={g.value} selected={goal === g.value} onClick={() => setGoal(g.value)} style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <span style={{ fontSize: 32 }}>{g.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{g.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{g.desc}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {goal && (
        <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
          <label style={labelStyle}>Время в неделю</label>
          <div style={{ display: 'flex', gap: 16 }}>
            {HOURS.map((h) => (
              <Card key={h.value} selected={hours === h.value} onClick={() => setHours(h.value)} style={{ flex: 1, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{h.label}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {canSubmit && (
        <div style={{ textAlign: 'center', animation: 'fadeUp 0.5s ease forwards', paddingTop: 16 }}>
          <Button size="lg" onClick={handleSubmit}>Готово! Погнали →</Button>
        </div>
      )}
    </div>
  );
}
