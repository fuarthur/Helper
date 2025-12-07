# Helper Automation Hub

A minimal but end-to-end automation workbench that combines a React/Next.js UI, an Express + Prisma backend, script execution via JSON stdin/stdout, scheduling, file watching, and a pluggable AI provider layer.

## Directory Structure
```
helper/
├── app/                 # Next.js App Router UI
├── components/          # Shared UI components
├── server/              # Express backend + services
├── prisma/              # SQLite schema and example migration
├── scripts/             # Example executable scripts (JSON in/out)
├── package.json         # Combined workspace dependencies
├── tailwind.config.ts   # Tailwind setup
└── README.md            # This document
```

## Architecture (ASCII)
```
[Next.js UI] --fetch--> [Express API] --Prisma--> [SQLite]
        |                    |  
        |                    +--> [Script Runner -> child_process -> scripts/* (JSON in/out)]
        |                    +--> [Task Scheduler -> node-cron/chokidar]
        |                    +--> [AI Layer -> AiProvider (OpenAI/Copilot/Mock)]
        |
        +<------------------------- structured results/logs ------------------
```

## Data Flow
1. User interacts with the UI (project list, script runner, AI prompt engineer).
2. UI calls Express API (`/api/projects`, `/api/scripts/run`, `/api/ai/prompt-engineer`).
3. Backend persists and reads data through Prisma + SQLite.
4. Script runner spawns scripts under `scripts/` with JSON stdin, expects JSON stdout.
5. AI layer (default OpenAI, fallback mock) creates professional prompts and structured plans.
6. Results return to the UI and are recorded as tasks/logs.

## Getting Started
0. **Node version**
   - Use **Node.js >= 18.17** (Next.js enforces this). With `nvm`: `nvm install 18.19 && nvm use 18.19` (a `.nvmrc` is provided).
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Generate Prisma client & seed a tiny DB**
   ```bash
   npx prisma generate
   npx prisma db push
   # optional example migration (idempotent with IF NOT EXISTS, safe to rerun)
   sqlite3 prisma/dev.db < prisma/migrations/000_init/migration.sql
   ```
   > If you already used `db push`, you don't need the migration. It is kept for reference and demos.
3. **Run dev servers (Next.js + Express)**
   ```bash
   npm run dev
   # Next.js: http://localhost:3000
   # Express: http://localhost:4000
   ```
4. **Run a sample script manually**
   ```bash
   echo '{"name":"Ada"}' | python3 scripts/hello.py
   echo '{"numbers":[1,2,3,4]}' | node scripts/analyze.js
   echo '{"project":"demo"}' | bash scripts/build.sh
   ```

## Adding a New Script
1. Drop the executable in `scripts/` and ensure it reads JSON from stdin and prints JSON to stdout.
2. Register it through the API:
   ```bash
   curl -X POST http://localhost:4000/api/scripts \
     -H 'Content-Type: application/json' \
     -d '{"projectId":"<project-id>","name":"my-script.py","command":"python3","path":"/absolute/or/relative/path"}'
   ```
3. Trigger it from the UI via the Script Runner.

## Extending AI Providers
- The AI layer lives in `server/services/openaiProvider.ts` and is accessed through `aiProvider.ts`.
- To add GitHub Copilot CLI, implement `server/services/copilotAdapter.ts` using `child_process` and wire it into `aiProvider.ts`.
- Swap providers by instantiating a different class or adding routing logic.

## Packaging as Desktop (Tauri/Electron)
- **Electron**: Wrap the Next.js production build (`npm run build` then `next start`) and proxy API calls to the Express server on `4000`. Use `BrowserWindow` to load `http://localhost:3000`.
- **Tauri**: Serve the built UI as static files and run the Express server as a sidecar binary. Configure Tauri `tauri.conf.json` to allow `http://localhost:4000` requests.

## Development Notes
- Tailwind + shadcn-ready; adjust UI tokens in `globals.css` or add components under `components/`.
- All core routes are under `server/routes/*`; services under `server/services/*` keep logic isolated.
- Default OpenAI calls fall back to mock text when `OPENAI_API_KEY` is not provided.

## Demo Walkthrough (User Perspective)
1. **Create project**: `POST /api/projects {"name":"Website","path":"/Users/me/site"}`.
2. **Bind directory**: stored in `Project.path`; shown in UI cards.
3. **Add script**: `POST /api/scripts` with `name:"hello.py", path:"scripts/hello.py", command:"python3"`.
4. **Enter natural language**: In UI Prompt Engineer, type “Send a greeting to release channel and summarize numbers”.
5. **AI plan**: Backend returns structured JSON `{goal, steps, scripts:["hello.py","analyze.js"], prompt:"..."}`.
6. **Execute**: AI/automation triggers `/api/scripts/run` for each script; UI shows task status and outputs.
7. **Summarize**: AI composes final text displayed in UI and stored in logs/tasks.

