import { useTypeWriter } from '../../hooks/useTypeWriter';

interface AIMessageProps {
  text: string;
  animate?: boolean;
}

export function AIMessage({ text, animate = true }: AIMessageProps) {
  const { displayed } = useTypeWriter(animate ? text : '', 18);
  const shown = animate ? displayed : text;

  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#ffd84d] flex items-center justify-center text-lg shadow-[0_4px_12px_rgba(255,216,77,0.3)]">
        🤖
      </div>
      <div className="flex-1 px-7 py-6 rounded-[20px] bg-[#3d1560] text-white border-l-4 border-[#ffd84d] text-[15px] leading-relaxed whitespace-pre-wrap">
        {shown}
      </div>
    </div>
  );
}
