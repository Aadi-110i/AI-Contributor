# AI Collab Builder

AI Collab Builder is a collaborative workspace for teams building software with AI. Each contributor owns a module such as frontend, backend, auth, database, or integrations. The platform standardizes uploaded code, merges the modules into one app, and runs build checks so the result is easier to review and demo.

## Why it stands out

- Built for team-based AI development, not solo prompting.
- Demo mode works without Supabase, so visitors can explore immediately.
- The merge pipeline creates a real handoff from module upload to combined output.
- The UI is polished enough for demos, interviews, and portfolio reviews.

## What it includes

- Landing page with a product-style presentation.
- Auth flow with Supabase or local demo login.
- Dashboard for creating projects and inviting collaborators.
- Module assignment, ZIP upload, standardization, and merge flow.
- Auto-test runner for merged output.

## Quick Start

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Copy [`.env.example`](.env.example) and fill in Supabase only if you want real auth and persistence. If you skip Supabase, the app uses local mock data and demo login.

### 3. Start the app

From the repo root:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Health check: http://localhost:5001/api/health

## Demo Mode

You do not need a database to open the app locally. If Supabase env vars are missing, the backend falls back to `mock-db.json` and the login screen supports demo/local auth.

## Architecture

```text
Frontend (Next.js)
    Landing | Auth | Dashboard | Project | Invite
                |
                v
Backend (Express)
    Projects | Modules | Invites | Merge | Test Runner
                |
                v
Supabase or local mock store
```

## Repository Layout

```text
ai-collab-builder/
├── backend/       Express API, merge pipeline, auth middleware
├── frontend/      Next.js app and UI components
├── scripts/       Database setup, seed data, root dev launcher
├── shared/        Shared types and constants
├── mock-db.json   Local fallback data store
└── README.md
```

## Key Flows

1. Sign in with Supabase or use demo login.
2. Create a project and auto-generate five modules.
3. Invite collaborators with a shareable link.
4. Assign modules and upload ZIP files.
5. Standardize, merge, and test the combined project.

## Environment

- `PORT=5001` for the backend.
- `NEXT_PUBLIC_API_URL=http://localhost:5001/api` for the frontend.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_JWT_SECRET` are optional for local demo mode.

## Deploying On Vercel

This repository is a monorepo. For Vercel, set the project root to `frontend/`, not the repository root.

- Frontend deployment target: `frontend/`
- Backend deployment target: a separate host such as Render, Railway, Fly, or another Node server
- Production frontend API URL: set `NEXT_PUBLIC_API_URL` to the deployed backend URL
- If you deploy only the frontend, the app can load, but API requests will fail until the backend is live

If Vercel is showing `404: NOT_FOUND`, it usually means the project is pointed at the wrong folder or the domain is attached to a deployment that does not contain the Next app.

## Tech Stack

- Next.js 16
- React 19
- Node.js + Express
- Supabase
- Multer
- adm-zip
