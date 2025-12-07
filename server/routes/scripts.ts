import { Router } from 'express';
import { prisma } from '../services/prisma';
import { runScript } from '../services/scriptRunner';

const router = Router();

router.post('/run', async (req, res) => {
  const { scriptId, payload } = req.body;
  const script = await prisma.script.findUnique({ where: { id: scriptId } });
  if (!script) return res.status(404).json({ error: 'Script not found' });
  try {
    const output = await runScript(script, payload || {});
    res.json(output);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Run failed' });
  }
});

router.post('/', async (req, res) => {
  const { projectId, name, command, path } = req.body;
  const script = await prisma.script.create({ data: { projectId, name, command, path } });
  res.json(script);
});

export default router;
