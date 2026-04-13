# AI Collab Builder

A collaborative platform where teams build projects using different AI tools — each person contributes a separate module (frontend, backend, auth, database, integrations), and the platform merges everything into one working application.

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                │
│  Landing │ Auth │ Dashboard │ Project Detail │ Invite │
└──────────────────────┬───────────────────────────────┘
                       │ REST API
┌──────────────────────┴───────────────────────────────┐
│                   Backend (Express)                  │
│  Auth MW │ Projects │ Modules │ Invites │ Merge API  │
│                                                      │
│  ┌─────────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Standardizer│ │  Merger  │ │  Auto-Test Runner│  │
│  └─────────────┘ └──────────┘ └──────────────────┘  │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────┐
│                   Supabase                           │
│       Auth │ PostgreSQL │ Storage                    │
└──────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm
- A Supabase project (free tier works)

### 1. Clone / Enter the project
```bash
cd ai-collab-builder
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the contents of `scripts/setup-db.sql` — run it
3. Copy your credentials from **Settings > API**

### 3. Configure environment variables

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your Supabase credentials
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your Supabase credentials
```

### 4. Install dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 5. Run the application
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health check**: http://localhost:5000/api/health

### 6. (Optional) Seed demo data
```bash
cd scripts && node seed.js
```

## Demo Mode

The app includes a **Demo Login** option that works without Supabase. Click "Try Demo" on the login page to explore the UI with mock data.

## Project Structure

```
ai-collab-builder/
├── backend/
│   ├── server.js              # Express entry point
│   ├── lib/supabase.js        # Supabase client
│   ├── middleware/auth.js     # JWT auth middleware
│   ├── routes/
│   │   ├── projects.js        # Project CRUD
│   │   ├── modules.js         # Module management + upload
│   │   ├── invites.js         # Invite link system
│   │   └── merge.js           # Merge + test pipeline
│   └── services/
│       ├── standardizer.js    # Code standardization engine
│       ├── merger.js          # Module merge engine
│       └── tester.js          # Auto build/test runner
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── login/page.tsx     # Auth page
│   │   │   ├── dashboard/page.tsx # Projects dashboard
│   │   │   ├── project/[id]/     # Project detail
│   │   │   └── invite/[token]/   # Invite acceptance
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ModuleCard.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── LogViewer.tsx
│   │   │   └── InviteModal.tsx
│   │   └── lib/
│   │       ├── api.ts            # Typed API client
│   │       └── supabase.ts       # Browser Supabase client
├── shared/
│   ├── types.ts               # Shared TypeScript types
│   └── constants.ts           # Shared constants
├── scripts/
│   ├── setup-db.sql           # Database migration
│   └── seed.js                # Demo data seeder
└── README.md
```

## User Flow

1. **Sign up / Sign in** — Supabase Auth or demo mode
2. **Create project** — Auto-creates 5 modules (frontend, backend, auth, database, integrations)
3. **Invite team** — Generate a shareable link
4. **Claim modules** — Each team member picks a module
5. **Upload code** — ZIP your module code and upload
6. **Standardization** — Engine normalizes folder structure and naming
7. **Merge** — Combines all uploaded modules into one project
8. **Auto-test** — Runs npm install + build check, shows logs

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | List user's projects |
| GET | `/api/projects/:id` | Get project detail |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/modules/project/:id` | List modules |
| POST | `/api/modules/:id/assign` | Claim a module |
| POST | `/api/modules/:id/upload` | Upload code (ZIP) |
| POST | `/api/invites` | Generate invite |
| POST | `/api/invites/accept/:token` | Accept invite |
| POST | `/api/merge/project/:id/merge` | Trigger merge |
| GET | `/api/merge/project/:id/logs` | Get merge logs |

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + JWT
- **File Upload**: Multer
- **ZIP Processing**: adm-zip
