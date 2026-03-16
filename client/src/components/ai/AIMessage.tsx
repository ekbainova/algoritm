import { useTypeWriter } from '../../hooks/useTypeWriter';

interface AIMessageProps {
  text: string;
  animate?: boolean;
}

export function AIMessage({ text, animate = true }: AIMessageProps) {
  const { displayed } = useTypeWriter(animate ? text : '', 18);
  const shown = animate ? displayed : text;

  return (
    <div style={{ animation: 'fadeUp 0.6s ease forwards' }}>
      <div style={{
        maxWidth: '80%',
        padding: '16px 20px',
        borderRadius: '20px',
        borderBottomLeftRadius: 4,
        background: 'linear-gradient(135deg, var(--purple), var(--purple-dark))',
        borderLeft: '3px solid var(--yellow)',
        color: 'white',
        fontSize: 14,
        lineHeight: 1.6,
        marginBottom: 12,
      }}>
        {shown}
      </div>
    </div>
  );
}
