import { spawn } from 'child_process';
import path from 'path';
import { Script } from '@prisma/client';

export type ScriptResult = {
  stdout: any;
  stderr?: string;
};

export function runScript(script: Script, payload: any): Promise<ScriptResult> {
  return new Promise((resolve, reject) => {
    const scriptPath = script.path || path.join(process.cwd(), 'scripts', script.name);
    const command = script.command || inferCommand(scriptPath);

    const child = spawn(command, [scriptPath], { stdio: ['pipe', 'pipe', 'pipe'] });
    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();

    let out = '';
    let err = '';

    child.stdout.on('data', (data) => (out += data.toString()));
    child.stderr.on('data', (data) => (err += data.toString()));

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(err || `Script exited with code ${code}`));
        return;
      }
      try {
        const parsed = JSON.parse(out || '{}');
        resolve({ stdout: parsed, stderr: err });
      } catch (parseError: any) {
        reject(new Error(`Invalid JSON from script: ${parseError.message}`));
      }
    });
  });
}

function inferCommand(filePath: string) {
  if (filePath.endsWith('.py')) return 'python3';
  if (filePath.endsWith('.js')) return 'node';
  if (filePath.endsWith('.sh')) return 'bash';
  return 'node';
}
