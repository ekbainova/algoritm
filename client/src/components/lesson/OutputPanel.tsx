import { friendlyError } from '../../utils/pythonErrors';

interface OutputPanelProps {
  output: string;
  error: string | null;
}

export function OutputPanel({ output, error }: OutputPanelProps) {
  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-5 font-mono text-sm min-h-[100px]">
      <div className="text-[#ffd84d] text-xs mb-3 font-sans font-bold uppercase tracking-wider">Output</div>
      {error ? (
        <div className="text-[#EF4444]">{friendlyError(error)}</div>
      ) : output ? (
        <pre className="text-[#44d370] whitespace-pre-wrap">{output}</pre>
      ) : (
        <div className="text-white/30 italic">Запусти код, чтобы увидеть результат</div>
      )}
    </div>
  );
}
