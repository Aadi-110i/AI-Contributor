<div align="center">

# 🏗️ WiiBuild

### **Collaborative AI Development Platform**

> *Build projects together — each person uses their own AI tool, we handle the merge.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ai--contributor.vercel.app-black?style=for-the-badge&logo=vercel)](https://ai-contributor.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

---

## 🧩 The Problem We Solved

Modern AI coding tools — Claude, ChatGPT, Trae, Cursor, Copilot — are powerful **individually**. But when a **team** tries to build one application with different AI tools, everything breaks:

- One person uses ChatGPT for the backend, another uses Claude for the frontend
- Code styles conflict, imports clash, naming conventions differ
- There is no shared workspace, no handoff process, no way to merge it all

**WiiBuild fixes this.** It gives teams a shared platform where everyone works in their own AI tool, owns a specific module, and the platform standardizes and merges everything into one working application — automatically.

---

## ✨ What We Offer

| Feature | Description |
|---|---|
| 🧠 **Modular Architecture** | Every project is split into 5 independent modules: Frontend, Backend, Auth, Database, and Integrations |
| 🤝 **AI-Agnostic Collaboration** | Use Claude, ChatGPT, Trae, Cursor, or any AI — no lock-in |
| 🔀 **Automated Merge Engine** | Modules are merged with API wiring, auth bridges, and structure enforcement |
| 📦 **Module Upload & Standardization** | Each contributor uploads a ZIP, we standardize naming, imports, and types |
| 🔗 **Invite System** | Share a unique link to onboard collaborators to specific modules instantly |
| 📊 **Real-Time Analytics** | Track project completion, module status, and team contribution rates |
| 🚀 **Deployment-Ready** | Vercel-deployed frontend with Supabase-backed persistence and JWT auth |
| 🔐 **Secure Auth** | Email/password signup with bcrypt hashing, JWT access tokens, and refresh tokens |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   WiiBuild Platform                 │
│                                                     │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐ │
│  │ Contributor│    │ Contributor│    │ Contributor│ │
│  │  (Claude)  │    │ (ChatGPT)  │    │   (Trae)   │ │
│  └─────┬──────┘    └─────┬──────┘    └─────┬──────┘ │
│        │ Frontend        │ Backend          │ Auth  │
│        └─────────────────┴──────────────────┘       │
│                          │                          │
│              ┌───────────▼───────────┐              │
│              │   WiiBuild Dashboard   │             │
│              │  Assign · Upload · Merge│            │
│              └───────────┬───────────┘              │
│                          │                          │
│              ┌───────────▼───────────┐              │
│              │  Merge Engine (API)    │             │
│              │  Standardize · Test    │             │
│              └───────────┬───────────┘              │
│                          │                          │
│              ┌───────────▼───────────┐              │
│              │  Supabase (Postgres)   │             │
│              │  Users · Projects ·    │             │
│              │  Modules · Merge Logs  │             │
│              └───────────────────────┘              │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework, routing, SSR/SSG |
| **React 19** | UI rendering |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **Lucide React** | Icon system |
| **Cobe** | Interactive 3D globe on landing page |

### Backend (Serverless API — Next.js Route Handlers)
| Technology | Purpose |
|---|---|
| **Next.js API Routes** | Serverless API endpoints — no Express needed |
| **Supabase JS SDK** | Database queries via Postgres |
| **bcryptjs** | Secure password hashing |
| **jsonwebtoken (JWT)** | Access tokens (1h) + Refresh tokens (7d) |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| **Supabase (Postgres)** | Cloud database — users, projects, modules, merge logs |
| **Vercel** | Frontend + API deployment (serverless functions) |

---

## 🗂️ Database Schema

```
profiles        → user accounts (id, email, username, avatar)
projects        → workspace (id, name, owner, description, status)
modules         → module assignments (id, project_id, type, assignee, status)
invites         → invite links (id, project_id, token, module_type)
merge_logs      → deployment history (id, project_id, timestamp, status)
```

---

## 🚀 Quick Start (Local)

### 1. Clone the repo

```bash
git clone https://github.com/Aadi-110i/AI-Contributor.git
cd AI-Contributor/ai-collab-builder
```

### 2. Install dependencies

```bash
cd frontend && npm install
```

### 3. Set environment variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=any_long_random_string
```

> ⚠️ Use the **Framework tab** in Supabase's Connect modal to get the `anon` key (starts with `eyJ...`). The `sb_publishable_...` key from the Server tab will NOT work.

### 4. Run the app

```bash
npm run dev
```

App runs at: **http://localhost:3000**

---

## 📋 Key User Flows

```
1. Sign Up          → email + password → JWT tokens issued
2. Create Project   → 5 modules auto-scaffolded in DB
3. Invite Team      → unique token link → collaborator claims a module
4. Build Modules    → each person uses their own AI tool
5. Upload & Merge   → standardize → merge → test → deployment log
6. Analytics        → real-time KPIs: completion %, contributors, merge rate
```


## 🌐 Deployment (Vercel)

| Setting | Value |
|---|---|
| **Root Directory** | `frontend/` |
| **Framework** | Next.js |
| **Build Command** | `npm run build` |
| **Output** | `.next/` |

Required Vercel environment variables:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
JWT_SECRET
```

---

## 🎯 Why This Project?

This was built to solve a **real problem in AI-era team development**: there is no standard platform for teams to collaborate when every person is using a different AI coding tool. WiiBuild is the missing middleware — a shared workspace, merge engine, and collaboration layer for AI-assisted software teams.

It demonstrates:
- **Full-stack Next.js** with serverless API routes (no separate backend needed)
- **Secure auth** with JWT, bcrypt, refresh tokens
- **Real database integration** with Supabase Postgres
- **Production deployment** on Vercel with zero build errors
- **Clean, recruiter-ready UI** with thoughtful design and empty states

---

<div align="center">

**Built with ❤️ by [Aadi-110i](https://github.com/Aadi-110i)**

[Live Demo →](https://ai-contributor.vercel.app) · [Report Bug](https://github.com/Aadi-110i/AI-Contributor/issues) · [Request Feature](https://github.com/Aadi-110i/AI-Contributor/issues)

</div>
