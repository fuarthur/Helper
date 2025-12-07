import { ProjectCard, Project } from '../components/ProjectCard';
import { TaskList } from '../components/TaskList';

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch('http://localhost:4000/api/projects', { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('failed');
    return await res.json();
  } catch (err) {
    return [
      {
        id: 'demo',
        name: 'Demo Workspace',
        path: '~/demo',
        scriptsCount: 2,
        lastRun: 'just now',
      },
    ];
  }
}

export default async function Page() {
  const projects = await getProjects();
  const tasks = [
    { id: '1', title: 'Run hello.py', status: 'done', result: 'Message printed' },
    { id: '2', title: 'Daily backup', status: 'running', result: 'In progress' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Projects</h2>
        <div className="grid gap-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
      <TaskList tasks={tasks} />
    </div>
  );
}
