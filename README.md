# EcoSphere — ESG Management Platform

**Odoo Hackathon submission** · Environmental, Social & Governance performance in one executive dashboard.

Environmental, Social and Governance (ESG) has become a critical aspect of modern businesses. Organizations are expected to monitor carbon emissions, promote employee well-being, and maintain governance compliance. While many ERP systems collect operational data, ESG reporting is often manual, disconnected, and difficult to monitor in real time.

**EcoSphere** integrates ESG directly into day-to-day ERP operations by measuring sustainability metrics, encouraging employee participation, and providing meaningful reports for management.

**Repo:** [github.com/Athina09/Odoo-Hackathon-](https://github.com/Athina09/Odoo-Hackathon-)

---

## Login & passwords

```bash
npm run install:all   # or: npm run install:frontend
npm run dev:all       # full stack — or: npm run dev (frontend only)
```

Open **http://localhost:8090/login**

Passwords are **per role** — any account under a role uses the same password.

| Role | Name | Email | Password | Lands on |
|------|------|-------|----------|----------|
| **Super Admin** | Priya Natarajan | `superadmin@ecosphere.in` | `admin123` | `/` — ESG Command Dashboard |
| **ESG Manager** | Alex Morgan | `alex.morgan@ecosphere.in` | `manager` | `/` — ESG Command Dashboard |
| **Department Manager** | John Carter (Manufacturing) | `john.carter@ecosphere.in` | `dept123` | `/department` |
| **Department Manager** | Emily Watson (HR) | `emily.watson@ecosphere.in` | `dept123` | `/department` |
| **Department Manager** | Michael Brown (Finance) | `michael.brown@ecosphere.in` | `dept123` | `/department` |
| **Employee** | Sarah Johnson | `sarah.j@ecosphere.in` | `employee` | `/mobile` |
| **Employee** | David Wilson | `david.w@ecosphere.in` | `employee` | `/mobile` |

**Quick copy**

```
Super Admin:     superadmin@ecosphere.in / admin123
ESG Manager:     alex.morgan@ecosphere.in / manager
Dept Manager:    john.carter@ecosphere.in / dept123
Employee:        sarah.j@ecosphere.in / employee
```

| Role | Password |
|------|----------|
| Super Admin | `admin123` |
| ESG Manager | `manager` |
| Department Manager | `dept123` |
| Employee | `employee` |

On the login page: pick your **role** → select your **account** → enter the **role password** → **Sign in**.

---

## Quick start

### Prerequisites

- Node.js 18+
- npm
- Python 3.10+ (for backend / RAG dashboard)

### Frontend only

```bash
npm run install:frontend
npm run dev
```

### Full stack (recommended)

Starts **frontend** (:8090), **FastAPI backend** (:8000), and **RAG dashboard** (:8501).

```bash
npm run install:all
npm run dev:all
```

| Service | URL |
|---------|-----|
| EcoSphere web app | http://localhost:8090/ |
| Login | http://localhost:8090/login |
| **Mobile app** (Employee role) | http://localhost:8090/mobile |
| API docs (Swagger) | http://127.0.0.1:8000/docs |
| ESG RAG dashboard | http://127.0.0.1:8501 |

### Backend only

```bash
npm run install:backend
cd backend && source .venv/bin/activate && uvicorn main:app --host 127.0.0.1 --port 8000
```

### Production build

```bash
npm run build
npm run preview
```

### npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Frontend dev server (port 8090) |
| `npm run dev:all` | Frontend + API + RAG dashboard |
| `npm run install:all` | Install frontend deps + backend venv |
| `npm run install:backend` | Create Python venv and install requirements |
| `npm run build` | Production frontend build |
| `npm run lint` | ESLint |

---

## What is implemented

### Web dashboards (role-gated)

| Route | Module | Highlights |
|-------|--------|------------|
| `/` | Command Center | KPI row, Tamil Nadu heatmap, AI live feed, department table, charts |
| `/environment` | Environmental | Carbon transactions, emission factors, department carbon table |
| `/social` | Social | CSR activities, participation heatmap, diversity metrics |
| `/governance` | Governance | Compliance kanban, policy ack progress, audit scores |
| `/gamification` | Gamification | Challenge kanban, leaderboard, badges, rewards catalog |
| `/digital-twin` | Digital Twin | Plant blueprint, zone detail, zone history |
| `/reports` | Reports | Typed report generation (PDF/Excel/CSV) + custom report builder |
| `/settings` | Settings | Org config, departments, notification preferences |
| `/admin` | Super Admin | Role assignments, employee management |
| `/manager` | ESG Manager | Cross-department approvals and oversight |
| `/department` | Dept Manager | Scoped department dashboard |

### Mobile app (`/mobile` — Employee role)

- Home — XP, rank, badges, recommended challenges
- CSR — register and track activities
- Challenges — enroll, submit evidence, track progress
- Leaderboard — department rankings
- Rewards — redeem points catalog
- Notifications — approvals and badge unlocks

Mobile session bootstraps from **`GET /api/mobile/bootstrap/{employeeId}`** when the backend is running (falls back to local storage offline).

### Reports

- **Typed reports** — Environmental, Social, Governance, ESG Summary: Generate → preview slide-over → export
- **Custom report builder** — filter by department, module, date range, employee, challenge, ESG category; live preview; export PDF / Excel / CSV

### Backend API

FastAPI backend with seeded ESG data mirroring the frontend mock datasets.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/esg/kpis` | Command Center KPIs |
| GET | `/api/esg/departments` | Department master data |
| GET | `/api/esg/emission-factors` | Emission factor catalog |
| GET | `/api/esg/carbon-transactions` | Carbon ledger (`?department=` optional) |
| GET | `/api/esg/csr-activities` | CSR activities |
| GET | `/api/esg/compliance-issues` | Governance compliance issues |
| GET | `/api/esg/challenges` | Gamification challenges |
| GET | `/api/esg/insights` | AI insight feed chunks |
| GET | `/api/mobile/employees` | Employee list |
| GET | `/api/mobile/bootstrap/{employeeId}` | **Initialize mobile app** (XP, challenges, CSR, notifications) |
| GET | `/api/mobile/challenges/catalog` | Challenge catalog |
| GET | `/api/mobile/csr/catalog` | CSR catalog |
| GET | `/api/rag/search?query=` | ESG insight RAG retrieval (`?module=` optional) |
| GET | `/api/rag/flow` | RAG pipeline stage definitions |
| GET | `/api/rag/metrics` | Retrieval evaluation metrics |

Vite proxies `/api` → `http://127.0.0.1:8000` in development.

### RAG pipeline

ESG insight retrieval over seeded ERP chunks:

1. **Ingest** — carbon, CSR, compliance, challenge data
2. **Chunk** — one searchable row per insight with module + department metadata
3. **Retrieve** — keyword overlap via `/api/rag/search`
4. **Dashboard** — Streamlit UI at `:8501` for pipeline stages and live search

Planned stages (embed, rerank, generate) are documented in `/api/rag/flow`.

---

## Challenge statement

Build an ESG Management Platform that enables organizations to **measure**, **manage**, and **improve** their Environmental, Social and Governance performance. The platform should integrate operational data, employee participation, and compliance activities into a unified dashboard while encouraging sustainability through gamification.

### Core modules

| Pillar | Scope |
|--------|--------|
| **Environmental** | Carbon accounting, emission factors, sustainability goals, carbon reports |
| **Social** | CSR activities, employee participation, diversity metrics, engagement |
| **Governance** | Policies, audits, compliance tracking, governance reports |
| **Gamification** | Challenges, badges, XP, rewards, leaderboards |

**Design mockup:** [Excalidraw wireframe](https://link.excalidraw.com/l/65VNwvy7c4X/2m6lz9Ln4)

---

## Business workflow

```
Master Configuration
│
▼
Departments · Categories · Emission Factors · Products
Goals · Policies · Challenges
│
▼
Daily Business Operations
(Purchase • Manufacturing • Expenses • Fleet)
│
▼
Carbon Transactions
│
▼
Employee Participation (CSR) · Challenge Participation
Policy Acknowledgements · Audits
│
▼
Environmental Score    Social Score    Governance Score
│
▼
Department Total Score
│
▼
Overall ESG Score
(weighted: Environmental 40% / Social 30% / Governance 30%, configurable)
│
▼
Organization Dashboard & Reports
```

---

## Tech stack

| Layer | Stack |
|-------|--------|
| **Frontend** | React 19, TypeScript, TanStack Router, Tailwind CSS, Framer Motion |
| **Charts** | Recharts, Chart.js |
| **Map** | Leaflet + OpenStreetMap (Tamil Nadu facility heatmap) |
| **UI** | Radix UI / shadcn-style primitives |
| **Backend** | FastAPI, Python 3.10+, Uvicorn |
| **RAG** | Custom keyword retrieval + Streamlit dashboard |
| **Export** | SheetJS (Excel), jsPDF (PDF), client-side CSV |
| **CI** | GitHub Actions — frontend lint/build + backend smoke tests |

---

## Project structure

```
Odoo-Hackathon-/
├── frontend/
│   ├── src/
│   │   ├── routes/                   # TanStack file routes
│   │   │   ├── index.tsx             # Command Center (/)
│   │   │   ├── login.tsx
│   │   │   ├── environment.tsx
│   │   │   ├── social.tsx
│   │   │   ├── governance.tsx
│   │   │   ├── gamification.tsx
│   │   │   ├── digital-twin.tsx
│   │   │   ├── reports.tsx
│   │   │   ├── settings.tsx
│   │   │   └── mobile/               # Employee mobile app
│   │   ├── components/ecosphere/
│   │   │   ├── screens/              # Page-level dashboards
│   │   │   ├── ds/                   # Design system (KPI, heatmap, table)
│   │   │   ├── mobile/               # Mobile screens + shell
│   │   │   ├── digital-twin/         # Floor blueprint, zone widgets
│   │   │   ├── CustomReportBuilder.tsx
│   │   │   └── ReportPreview.tsx
│   │   ├── lib/
│   │   │   ├── ecosphere-api.ts      # Backend API client
│   │   │   ├── report-builder.ts     # Custom report filter + export
│   │   │   └── ecosphere-auth.ts     # Role-based login
│   │   ├── data/
│   │   │   ├── ecosphere.ts          # Command Center demo data
│   │   │   ├── ecosphere-modules.ts  # Per-module rows & KPIs
│   │   │   └── ecosphere-mock.ts     # Org master data
│   │   └── context/                  # Auth + gamification state
│   └── package.json
├── backend/
│   ├── main.py                       # FastAPI entry point
│   ├── seed_data.py                  # ESG + mobile + RAG seed data
│   ├── rag_pipeline.py               # Insight retrieval
│   ├── rag_metrics.py                # Eval metrics
│   ├── streamlit_rag_dashboard.py    # RAG UI (:8501)
│   └── routes/
│       ├── esg.py                    # /api/esg/*
│       ├── mobile.py                 # /api/mobile/*
│       └── rag.py                    # /api/rag/*
├── scripts/
│   ├── dev-all.sh                    # Start full dev stack
│   └── init-backend.sh               # Backend venv setup
├── .github/workflows/ci.yml          # CI pipeline
└── package.json
```

Demo data: `frontend/src/data/ecosphere.ts`, `ecosphere-modules.ts`, `ecosphere-mock.ts` · Backend mirror: `backend/seed_data.py`

---

## Core business rules

| Rule | Description |
|------|-------------|
| **Reward redemption** | Employees redeem Points/XP for catalog rewards; stock and balance are updated |
| **Notifications** | In-app/email for compliance issues, CSR/challenge approvals, policy reminders, badge unlocks |
| **Auto emission calculation** | When enabled, carbon transactions derive from Purchase/Manufacturing/Expense/Fleet via emission factors |
| **Evidence requirement** | When enabled, CSR participation cannot be approved without proof |
| **Badge auto-award** | When enabled, badges assign automatically when unlock rules are satisfied |
| **Compliance ownership** | Every issue has Owner + Due Date; overdue open issues are flagged and notified |

---

## Roadmap (ERP integration)

This submission focuses on the **unified executive dashboard**, **mobile employee app**, **reports**, and **API/RAG layer**. A full Odoo integration would:

1. Sync master data (departments, emission factors, policies, badges, rewards)
2. Ingest transactional ERP events (purchases, manufacturing, fleet) into carbon transactions
3. Drive gamification (challenges, XP, leaderboards) from real employee actions
4. Replace keyword RAG with vector embeddings over live ERP documents
5. Enforce business rules via Odoo settings (auto-carbon, evidence, notifications)

---

## License

Submitted for the **Odoo Hackathon** — [Athina09/Odoo-Hackathon-](https://github.com/Athina09/Odoo-Hackathon-).
