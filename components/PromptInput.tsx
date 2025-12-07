'use client';
import React, { useState } from 'react';

export type PromptResult = {
  goal: string;
  steps: string[];
  scripts: string[];
  prompt: string;
};

export function PromptInput({ onSubmit }: { onSubmit: (text: string) => Promise<PromptResult> }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PromptResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const data = await onSubmit(text);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="card space-y-3">
      <h4 className="text-lg font-semibold">AI Prompt Engineer</h4>
      <textarea
        className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm min-h-[100px]"
        placeholder="Describe what you want to automate"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Thinking...' : 'Generate Plan'}
      </button>
      {result && (
        <div className="bg-slate-800 border border-slate-700 rounded-md p-3 space-y-2 text-sm">
          <p><span className="text-slate-400">Goal:</span> {result.goal}</p>
          <div>
            <p className="text-slate-400">Steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              {result.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
          <p><span className="text-slate-400">Scripts:</span> {result.scripts.join(', ') || 'none'}</p>
          <p className="text-sky-300 whitespace-pre-wrap">{result.prompt}</p>
        </div>
      )}
    </div>
  );
}
