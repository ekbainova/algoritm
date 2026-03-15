import { useState } from 'react';
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

const INPUT_CLASS = 'w-full px-6 pt-5 pb-5 rounded-2xl border-2 border-white/20 bg-white text-[#3d1560] placeholder-[#999] focus:border-[#ffd84d] focus:outline-none transition-colors text-base font-medium';

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
    setStudent({
      name: name.trim(),
      age: parsedAge,
      pythonExperience: experience,
      experienceDuration: experienceDuration || undefined,
      goal,
      weeklyHours: hours,
      quizScore: 0,
      level: 'beginner',
    });
    setPhase('quiz');
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-[#3d1560]">Расскажи о себе</h2>
        <p className="text-[#632895] mt-3 text-lg font-medium">Чтобы ALGO построил твою персональную траекторию</p>
      </div>

      {/* Name & Age */}
      <div className="bg-[#632895] rounded-[28px] p-8 shadow-[0_8px_32px_rgba(99,40,149,0.3)]">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-4 text-[#ffd84d]">Имя</label>
            <input
              type="text"
              placeholder="Как тебя зовут?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-4 text-[#ffd84d]">Возраст</label>
            <input
              type="number"
              placeholder="Сколько тебе лет?"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={6}
              max={18}
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      {/* Experience */}
      {name && age && (
        <div className="animate-fade-in">
          <label className="block text-sm font-bold mb-5 text-[#3d1560] uppercase tracking-wider">Опыт с Python</label>
          <div className="grid grid-cols-3 gap-4">
            {([
              { value: 'none' as Experience, emoji: '🌱', label: 'Никогда не пробовал' },
              { value: 'some' as Experience, emoji: '📖', label: 'Чуть-чуть знаю' },
              { value: 'confident' as Experience, emoji: '💪', label: 'Уже умею' },
            ]).map((opt) => (
              <Card
                key={opt.value}
                dark
                selected={experience === opt.value}
                onClick={() => setExperience(opt.value)}
                className="p-6 text-center"
              >
                <div className="text-3xl mb-3">{opt.emoji}</div>
                <div className="text-sm font-semibold">{opt.label}</div>
              </Card>
            ))}
          </div>
          {experience && experience !== 'none' && (
            <div className="bg-[#632895] rounded-2xl p-6 mt-5">
              <input
                type="text"
                placeholder="Как давно? (напр. полгода)"
                value={experienceDuration}
                onChange={(e) => setExperienceDuration(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          )}
        </div>
      )}

      {/* Goals */}
      {experience && (
        <div className="animate-fade-in">
          <label className="block text-sm font-bold mb-5 text-[#3d1560] uppercase tracking-wider">Твоя цель</label>
          <div className="grid grid-cols-2 gap-4">
            {GOALS.map((g) => (
              <Card
                key={g.value}
                dark
                selected={goal === g.value}
                onClick={() => setGoal(g.value)}
                className="p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{g.emoji}</span>
                  <div className="text-left">
                    <div className="font-bold text-sm">{g.title}</div>
                    <div className="text-xs text-white/60 mt-1">{g.desc}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Hours */}
      {goal && (
        <div className="animate-fade-in">
          <label className="block text-sm font-bold mb-5 text-[#3d1560] uppercase tracking-wider">Время в неделю</label>
          <div className="flex gap-4">
            {HOURS.map((h) => (
              <Card
                key={h.value}
                dark
                selected={hours === h.value}
                onClick={() => setHours(h.value)}
                className="flex-1 p-5 text-center"
              >
                <div className="text-sm font-bold">{h.label}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      {canSubmit && (
        <div className="text-center animate-fade-in pt-4">
          <Button size="lg" onClick={handleSubmit}>
            Готово! Погнали &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
