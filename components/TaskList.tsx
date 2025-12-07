'use client';
import React from 'react';

type Task = {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  result?: string;
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  const badgeColor = (status: Task['status']) => {
    switch (status) {
      case 'running':
        return 'bg-amber-500';
      case 'done':
        return 'bg-emerald-500';
      case 'failed':
        return 'bg-rose-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold">Recent Tasks</h4>
        <span className="text-xs text-slate-400">Automations & manual runs</span>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-start justify-between">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-xs text-slate-400">{task.result || 'Pending result'}</p>
            </div>
            <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-md ${badgeColor(task.status)} text-slate-900 font-bold`}>
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
