import { Router } from 'express';
import { z } from 'zod';
import { OpenAIProvider } from './openaiProvider';
import { promptEngineer } from './promptEngineer';

const provider = new OpenAIProvider();
export const aiRouter = Router();

aiRouter.post('/complete', async (req, res) => {
  const { prompt } = req.body;
  const completion = await provider.complete(prompt);
  res.json(completion);
});

aiRouter.post('/prompt-engineer', async (req, res) => {
  const bodySchema = z.object({ text: z.string() });
  const { text } = bodySchema.parse(req.body);
  const result = await promptEngineer(text);
  res.json(result);
});
