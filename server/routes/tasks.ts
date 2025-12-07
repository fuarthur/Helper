import { Router } from 'express';
import { prisma } from '../services/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title, status, result, projectId } = req.body;
  const task = await prisma.task.create({ data: { title, status, result, projectId } });
  res.json(task);
});

export default router;
