import cron from 'node-cron';
import chokidar from 'chokidar';
import { prisma } from './prisma';
import { runScript } from './scriptRunner';

export function initScheduler() {
  cron.schedule('* * * * *', async () => {
    const rules = await prisma.rule.findMany({ where: { type: 'cron' }, include: { script: true } });
    for (const rule of rules) {
      await runScript(rule.script, { trigger: 'cron', ruleId: rule.id });
      await prisma.task.create({ data: { title: `Cron: ${rule.script.name}`, status: 'done', result: 'Executed', projectId: rule.script.projectId } });
    }
  });

  const watchers: Record<string, chokidar.FSWatcher> = {};
  prisma.rule.findMany({ where: { type: 'watch' }, include: { script: true } }).then((rules) => {
    rules.forEach((rule) => {
      if (!watchers[rule.id]) {
        watchers[rule.id] = chokidar.watch(rule.pattern || '.', { ignoreInitial: true });
        watchers[rule.id].on('all', async () => {
          await runScript(rule.script, { trigger: 'watch', ruleId: rule.id });
          await prisma.task.create({ data: { title: `Watch: ${rule.script.name}`, status: 'done', result: 'File change', projectId: rule.script.projectId } });
        });
      }
    });
  });
}
