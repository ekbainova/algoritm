import { useStudentStore } from '../../store/studentStore';
import { RotateCcw } from 'lucide-react';

export function Header() {
  const { student, reset } = useStudentStore();

  return (
    <header className="bg-[#632895] px-8 py-4 flex items-center justify-between shadow-[0_4px_20px_rgba(99,40,149,0.3)]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#ffd84d] flex items-center justify-center">
          <span className="text-[#3d1560] font-extrabold text-sm">A</span>
        </div>
        <span className="font-bold text-white tracking-[3px] uppercase text-sm">Алгоритмика</span>
        <div className="h-5 w-px bg-white/30 mx-2" />
        <span className="text-[#ffd84d] text-sm font-semibold">AI-учитель Python</span>
      </div>
      <div className="flex items-center gap-4">
        {student && (
          <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full backdrop-blur-sm">
            <div className="w-6 h-6 rounded-full bg-[#ffd84d] flex items-center justify-center text-[#3d1560] text-xs font-bold">
              {student.name[0]}
            </div>
            <span className="text-sm font-medium text-white">
              {student.name}, {student.age} лет
            </span>
          </div>
        )}
        <button
          onClick={reset}
          className="p-2.5 rounded-xl hover:bg-white/15 transition-colors cursor-pointer text-white/70 hover:text-white"
          title="Начать заново"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
}
