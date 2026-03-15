export async function askClaude(prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout

  try {
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error('Claude API request failed');
    }

    const data = await res.json();
    return data.text;
  } finally {
    clearTimeout(timeout);
  }
}

export async function askClaudeJSON<T>(prompt: string): Promise<T> {
  const text = await askClaude(prompt);
  // Extract JSON from response — handle possible markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const jsonStr = jsonMatch[1]!.trim();
  return JSON.parse(jsonStr) as T;
}
