import { ScriptRunner } from '../../../components/ScriptRunner';
import { PromptInput, PromptResult } from '../../../components/PromptInput';
import { TaskList } from '../../../components/TaskList';

async function fetchScripts(id: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/projects/${id}/scripts`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('failed');
    return await res.json();
  } catch (err) {
    return [
      { id: 'hello', name: 'hello.py', description: 'Greet in JSON' },
      { id: 'analyze', name: 'analyze.js', description: 'Analyze numbers' },
    ];
  }
}

async function runScript(id: string, payload: any) {
  await fetch('http://localhost:4000/api/scripts/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scriptId: id, payload }),
  });
}

async function generatePrompt(text: string): Promise<PromptResult> {
  const res = await fetch('http://localhost:4000/api/ai/prompt-engineer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    cache: 'no-store',
  });
  if (!res.ok) {
    return {
      goal: 'Fallback goal',
      steps: ['Understand request', 'Select script', 'Execute', 'Summarize'],
      scripts: ['hello.py'],
      prompt: 'Please run hello.py',
    };
  }
  return res.json();
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const scripts = await fetchScripts(params.id);
  const tasks = [
    { id: '1', title: 'Demo task', status: 'pending', result: 'Waiting...' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Project {params.id}</h2>
      <ScriptRunner scripts={scripts} onRun={runScript} />
      <PromptInput onSubmit={generatePrompt} />
      <TaskList tasks={tasks} />
    </div>
  );
}
