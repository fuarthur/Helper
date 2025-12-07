'use client';
import React from 'react';
import Link from 'next/link';

export type Project = {
  id: string;
  name: string;
  path: string;
  scriptsCount: number;
  lastRun?: string;
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="block card hover:border-sky-500 transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{project.name}</h3>
          <p className="text-slate-400 text-sm">{project.path}</p>
        </div>
        <span className="text-xs bg-sky-900 text-sky-200 px-2 py-1 rounded-md">{project.scriptsCount} scripts</span>
      </div>
      <div className="text-sm text-slate-300 mt-2 flex items-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
        <span>Last run: {project.lastRun || 'never'}</span>
      </div>
    </Link>
  );
}
