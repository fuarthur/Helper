-- Example migration for SQLite
CREATE TABLE IF NOT EXISTS Project (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME
);
CREATE TABLE IF NOT EXISTS Script (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  command TEXT,
  path TEXT,
  projectId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME,
  FOREIGN KEY(projectId) REFERENCES Project(id)
);
CREATE TABLE IF NOT EXISTS Task (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  result TEXT,
  projectId TEXT,
  scriptId TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME,
  FOREIGN KEY(projectId) REFERENCES Project(id),
  FOREIGN KEY(scriptId) REFERENCES Script(id)
);
CREATE TABLE IF NOT EXISTS Rule (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  pattern TEXT,
  schedule TEXT,
  scriptId TEXT NOT NULL,
  projectId TEXT NOT NULL,
  FOREIGN KEY(scriptId) REFERENCES Script(id),
  FOREIGN KEY(projectId) REFERENCES Project(id)
);
CREATE TABLE IF NOT EXISTS Log (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  projectId TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(projectId) REFERENCES Project(id)
);
