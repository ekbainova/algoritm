import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    loadPyodide: () => Promise<any>;
  }
}

export function usePyodide() {
  const pyodideRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const pyodide = await window.loadPyodide();
        pyodideRef.current = pyodide;
      } catch (e) {
        console.error('Failed to load Pyodide:', e);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const runCode = async (code: string): Promise<{ output: string; error: string | null }> => {
    if (!pyodideRef.current) return { output: '', error: 'Python ещё загружается...' };

    let output = '';
    pyodideRef.current.setStdout({
      batched: (s: string) => { output += s + '\n'; }
    });
    pyodideRef.current.setStderr({
      batched: (s: string) => { output += s + '\n'; }
    });

    try {
      await pyodideRef.current.runPythonAsync(code);
      return { output: output.trim(), error: null };
    } catch (err: any) {
      return { output: '', error: err.message };
    }
  };

  return { runCode, isLoading };
}
