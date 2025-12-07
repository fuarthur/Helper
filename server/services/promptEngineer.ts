import { prisma } from './prisma';
import { OpenAIProvider } from './openaiProvider';

const provider = new OpenAIProvider();

type PromptPlan = {
  goal: string;
  steps: string[];
  scripts: string[];
  prompt: string;
};

export async function promptEngineer(text: string): Promise<PromptPlan> {
  const scripts = await prisma.script.findMany({});
  const scriptList = scripts.map((s) => `${s.name} (${s.command || 'auto'})`).join('\n');
  const systemPrompt = `You are an automation planner. Available scripts:\n${scriptList || 'hello.py, analyze.js, build.sh'}.`;
  const completion = await provider.complete(`${systemPrompt}\nUser request: ${text}. Build a JSON with goal, steps (array), scripts (array names), and professional prompt string.`);

  try {
    const parsed: PromptPlan = JSON.parse(completion.text);
    return parsed;
  } catch {
    return {
      goal: text,
      steps: [
        'Understand requirement',
        'Map to available scripts',
        'Run scripts and capture structured outputs',
        'Summarize results for the user',
      ],
      scripts: scripts.map((s) => s.name),
      prompt: completion.text || `Execute relevant scripts for: ${text}`,
    };
  }
}
