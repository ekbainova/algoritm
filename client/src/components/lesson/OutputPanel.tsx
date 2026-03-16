import { friendlyError } from '../../utils/pythonErrors';

interface OutputPanelProps { output: string; error: string | null; }

export function OutputPanel({ output, error }: OutputPanelProps) {
  return (
    <div style={{ minHeight: 40, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      {error ? (
        <div style={{ color: 'var(--red)' }}>{friendlyError(error)}</div>
      ) : output ? (
        <pre style={{ whiteSpace: 'pre-wrap', color: '#cdd6f4' }}>
          {output.split('\n').map((line, i) => (
            <div key={i}><span style={{ color: 'var(--green)' }}>→</span> {line}</div>
          ))}
        </pre>
      ) : (
        <div style={{ color: 'rgba(168,156,184,0.3)', fontStyle: 'italic', fontSize: 13 }}>Запусти код, чтобы увидеть результат</div>
      )}
    </div>
  );
}
