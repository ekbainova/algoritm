import { useStudentStore } from '../../store/studentStore';

export function ProgressBar() {
  const { trajectory } = useStudentStore();
  if (trajectory.length === 0) return null;

  const completed = trajectory.filter((s) => s.isCompleted).length;
  const currentIdx = trajectory.findIndex((s) => s.isCurrent);
  const pct = trajectory.length > 0 ? ((completed + (currentIdx >= 0 ? 0.5 : 0)) / trajectory.length) * 100 : 0;

  return (
    <div className="px-8 py-3 bg-[#3d1560]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-white/60">Прогресс по траектории</span>
        <span className="text-xs font-bold text-[#ffd84d]">
          {completed} / {trajectory.length} модулей
        </span>
      </div>
      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#ffd84d] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
