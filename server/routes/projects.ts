import { Router } from 'express';
import { prisma } from '../services/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const projects = await prisma.project.findMany({ include: { scripts: true } });
  res.json(projects.map((p) => ({
    id: p.id,
    name: p.name,
    path: p.path,
    scriptsCount: p.scripts.length,
    lastRun: p.updatedAt.toISOString(),
  })));
});

router.post('/', async (req, res) => {
  const { name, path } = req.body;
  const project = await prisma.project.create({ data: { name, path } });
  res.json(project);
});

router.get('/:id/scripts', async (req, res) => {
  const scripts = await prisma.script.findMany({ where: { projectId: req.params.id } });
  res.json(scripts);
});

export default router;
