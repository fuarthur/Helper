import './globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Helper Automation Hub',
  description: 'Project, script, and AI orchestration hub',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Helper Automation Hub</h1>
              <p className="text-slate-400">Create projects, run scripts, and orchestrate AI-driven automation.</p>
            </div>
            <nav className="space-x-3 text-sm font-medium">
              <Link className="text-sky-400 hover:text-sky-300" href="/">Dashboard</Link>
              <Link className="text-sky-400 hover:text-sky-300" href="/projects/demo">Demo Project</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
