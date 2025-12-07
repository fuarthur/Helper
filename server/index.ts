import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import projectsRouter from './routes/projects';
import scriptsRouter from './routes/scripts';
import tasksRouter from './routes/tasks';
import { aiRouter } from './services/aiProvider';
import { initScheduler } from './services/taskScheduler';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/projects', projectsRouter);
app.use('/api/scripts', scriptsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/ai', aiRouter);

const port = process.env.PORT || 4000;

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

initScheduler();

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
