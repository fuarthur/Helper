'use client';
import React, { useState } from 'react';

export type Script = {
  id: string;
  name: string;
  description?: string;
};

export function ScriptRunner({ scripts, onRun }: { scripts: Script[]; onRun: (id: string, payload: any) => Promise<void> }) {
  const [selected, setSelected] = useState<string>(scripts[0]?.id || '');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');

  const handleRun = async () => {
    setStatus('Running...');
    await onRun(selected, input ? JSON.parse(input) : {});
    setStatus('Done');
  };

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Script Runner</h4>
        <select
          className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-sm"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {scripts.map((script) => (
            <option key={script.id} value={script.id}>
              {script.name}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm min-h-[120px]"
        placeholder="JSON payload for script stdin"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="button" onClick={handleRun}>
        Run
      </button>
      {status && <p className="text-xs text-slate-400">{status}</p>}
    </div>
  );
}
