# EcoSphere — ESG Management Platform

**Odoo Hackathon submission** · Environmental, Social & Governance performance in one executive dashboard — plus an **employee mobile app**, **FastAPI backend**, and **ESG RAG** insight search.

Organizations must monitor carbon emissions, promote employee well-being, and maintain governance compliance. **EcoSphere** integrates ESG into day-to-day operations: executive dashboards for leadership, a mobile app for employees, typed & custom reports, digital twin facility monitoring, and an API + RAG layer for AI-assisted insights.

**Repo:** [github.com/Athina09/Odoo-Hackathon-](https://github.com/Athina09/Odoo-Hackathon-)

---

## Quick start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Python | 3.10+ |

### Install everything

```bash
git clone https://github.com/Athina09/Odoo-Hackathon-.git
cd Odoo-Hackathon-
npm run install:all
```

This installs frontend dependencies and creates `backend/.venv` with FastAPI, Uvicorn, and Streamlit.

### Run full stack (recommended)

Starts **frontend** (:8090), **FastAPI API** (:8000), and **RAG dashboard** (:8501):

```bash
npm run dev:all
```

| Service | URL |
|---------|-----|
| EcoSphere web app | http://localhost:8090/ |
| Login | http://localhost:8090/login |
| **Employee mobile app** | http://localhost:8090/mobile |
| API root | http://127.0.0.1:8000/ |
| API docs (Swagger) | http://127.0.0.1:8000/docs |
| **ESG RAG dashboard** | http://127.0.0.1:8501 |

Press `Ctrl+C` in the terminal to stop all services started by `dev:all`.

### Frontend only

```bash
npm run install:frontend
npm run dev
```

Works without Python — uses local mock data and `localStorage` for employee gamification.

### Backend only

```bash
npm run install:backend
cd backend
source .venv/bin/activate   # Windows: .venv\Scripts\activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### RAG dashboard only

```bash
cd backend
source .venv/bin/activate
streamlit run streamlit_rag_dashboard.py
```

Open http://127.0.0.1:8501 — search ESG insights, view pipeline stages, and retrieval metrics.

### Production build

```bash
npm run build
npm run preview
```

### npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Frontend dev server (port 8090) |
| `npm run dev:all` | Frontend + FastAPI + Streamlit RAG |
| `npm run install:all` | Frontend deps + Python venv |
| `npm run install:backend` | Create venv + `pip install -r requirements.txt` |
| `npm run install:frontend` | `npm install` in `frontend/` |
| `npm run build` | Production frontend build |
| `npm run lint` | ESLint |

---

## Login & passwords

Open **http://localhost:8090/login**

EcoSphere is for **leadership dashboards and the employee mobile app**. Pick your role → select your account → enter the role password.

| Role | Name | Email | Password | Lands on |
|------|------|-------|----------|----------|
| **Super Admin** | Priya Natarajan | `superadmin@ecosphere.in` | `admin123` | `/` |
| **ESG Manager** | Alex Morgan | `alex.morgan@ecosphere.in` | `manager` | `/` |
| **Department Manager** | John Carter (Manufacturing) | `john.carter@ecosphere.in` | `dept123` | `/department` |
| **Department Manager** | Emily Watson (HR) | `emily.watson@ecosphere.in` | `dept123` | `/department` |
| **Department Manager** | Michael Brown (Finance) | `michael.brown@ecosphere.in` | `dept123` | `/department` |
| **Employee** | Sarah Johnson (IT) | `sarah.j@ecosphere.in` | `employee` | `/mobile` |
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

**Sign out** is available in the top header (web roles) and mobile header (employees).

---

## What we built

### Web dashboards (role-gated)

| Route | Who | Highlights |
|-------|-----|------------|
| `/` | Super Admin, ESG Manager | KPI row, Tamil Nadu heatmap, AI live feed, department table, ESG charts |
| `/environment` | All web roles | Carbon transactions, emission factors, department carbon |
| `/social` | All web roles | CSR activities, participation heatmap |
| `/governance` | All web roles | Compliance kanban, policies, audits |
| `/gamification` | Super Admin, ESG Manager | Challenge kanban, leaderboard, badges |
| `/digital-twin` | Super Admin, ESG Manager | Live plant blueprint, zone telemetry, **AI confidence** KPI & per-zone scores |
| `/reports` | All web roles | Typed reports + **custom report builder** (PDF/Excel/CSV) |
| `/settings` | Super Admin | Org config, departments, notifications |
| `/admin` | Super Admin | Role assignments, people management |
| `/manager` | ESG Manager | Cross-department approvals |
| `/department` | Dept Manager | Scoped department dashboard |

### EcoSphere AI (all roles)

- Floating **EcoSphere AI** button (solid blue) on every logged-in screen
- Role-specific suggested prompts (executive, manager, employee)
- **AI confidence score** shown in the chat panel
- Employees see it above the bottom tab bar on mobile

### Employee mobile app (`/mobile`)

Designed for everyday employees — no ERP training required.

| Tab | Features |
|-----|----------|
| **Home** | XP ring, rank, badges, **CSR map + weekly XP chart** side-by-side, link to Impact |
| **Impact** | Personal kWh/CO₂ saved, **live digital twin floor**, impact charts (radar, energy trend, zones), **impact in words** narrative |
| **Challenges** | Join, progress bar, **camera photo evidence**, submit for approval |
| **CSR** | Browse activities, register, upload proof |
| **Ranks** | Full leaderboard with **your position** highlighted |
| **Rewards** | Points redemption catalog |
| **Alerts** | Approvals, badges, challenge updates |

Mobile bootstraps from **`GET /api/mobile/bootstrap/{employeeId}`** when the backend is running; falls back to `localStorage` offline.

**Try it:** `sarah.j@ecosphere.in` / `employee` → http://localhost:8090/mobile

### Reports

- **Typed reports** — Environmental, Social, Governance, ESG Summary: Generate → preview slide-over → export
- **Custom report builder** — filter by department, module, date range, employee, challenge, ESG category
- Field-aware filters (employee/challenge disabled unless module matches)
- Live preview table + export **PDF / Excel / CSV**

### Digital twin

- Live SCADA-style plant blueprint with zone widgets (energy, CO₂, temperature)
- Facility KPIs including **AI Model Confidence**
- Zone detail panel with per-zone confidence + AI insight
- Zone history table with **AI Conf.** column
- Employee Impact page shows a **compact live twin** linked to personal contribution

---

## FastAPI backend

Python backend mirroring frontend ESG mock data. Entry point: `backend/main.py`.

### Run manually

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info + quick links |
| GET | `/api/health` | Health check + seed version |
| GET | `/api/esg/kpis` | Command Center KPIs |
| GET | `/api/esg/departments` | Department master data |
| GET | `/api/esg/emission-factors` | Emission factor catalog |
| GET | `/api/esg/carbon-transactions` | Carbon ledger (`?department=` optional) |
| GET | `/api/esg/csr-activities` | CSR activities |
| GET | `/api/esg/compliance-issues` | Governance compliance issues |
| GET | `/api/esg/challenges` | Gamification challenges |
| GET | `/api/esg/insights` | AI insight feed chunks |
| GET | `/api/mobile/employees` | Employee list |
| GET | `/api/mobile/bootstrap/{employeeId}` | Initialize mobile app (XP, challenges, CSR, notifications) |
| GET | `/api/mobile/challenges/catalog` | Challenge catalog |
| GET | `/api/mobile/csr/catalog` | CSR catalog |
| GET | `/api/rag/search?query=` | ESG insight RAG search (`?module=` optional, `?n_results=`) |
| GET | `/api/rag/flow` | RAG pipeline stage definitions |
| GET | `/api/rag/metrics` | Retrieval evaluation metrics |

**Example**

```bash
curl "http://127.0.0.1:8000/api/health"
curl "http://127.0.0.1:8000/api/rag/search?query=manufacturing+carbon&module=Environmental"
curl "http://127.0.0.1:8000/api/mobile/bootstrap/emp-sarah"
```

Vite proxies `/api` → `http://127.0.0.1:8000` during `npm run dev` / `dev:all`.

### Backend files

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app, CORS, router registration |
| `seed_data.py` | ESG, mobile, and RAG seed data |
| `routes/esg.py` | `/api/esg/*` |
| `routes/mobile.py` | `/api/mobile/*` |
| `routes/rag.py` | `/api/rag/*` |
| `rag_pipeline.py` | Chunk retrieval + pipeline stage metadata |
| `rag_metrics.py` | Precision/recall-style eval on seed queries |
| `streamlit_rag_dashboard.py` | Interactive RAG UI |
| `requirements.txt` | fastapi, uvicorn, streamlit, pandas |

---

## RAG pipeline

ESG insight retrieval over seeded ERP text chunks (carbon events, CSR, compliance, challenges).

### Pipeline stages

1. **Ingest** — load carbon, CSR, compliance, challenge records from `seed_data.py`
2. **Chunk** — one searchable document per insight with `module` + `department` metadata
3. **Retrieve** — keyword overlap scoring via `/api/rag/search`
4. **Evaluate** — precision metrics on held-out queries (`/api/rag/metrics`)
5. **Dashboard** — Streamlit UI for live search and pipeline status

Planned extensions (documented in `/api/rag/flow`): embeddings, reranking, LLM answer generation.

### How to use RAG

**Option A — Streamlit dashboard**

```bash
npm run dev:all          # starts everything including :8501
# or backend only:
cd backend && source .venv/bin/activate && streamlit run streamlit_rag_dashboard.py
```

Open http://127.0.0.1:8501 → enter a query → filter by module → see matched chunks.

**Option B — REST API**

```bash
curl "http://127.0.0.1:8000/api/rag/search?query=plastic+waste&n_results=5"
curl "http://127.0.0.1:8000/api/rag/flow"
curl "http://127.0.0.1:8000/api/rag/metrics"
```

**Option C — Swagger UI**

http://127.0.0.1:8000/docs → expand **rag** tag → try `/api/rag/search`.

---

## Tech stack

| Layer | Stack |
|-------|--------|
| **Frontend** | React 19, TypeScript, TanStack Router, Tailwind CSS, Framer Motion |
| **Charts** | Recharts |
| **Map** | Leaflet + OpenStreetMap (Tamil Nadu heatmap) |
| **UI** | Radix UI / shadcn-style primitives |
| **Backend** | FastAPI, Python 3.10+, Uvicorn |
| **RAG** | Keyword retrieval + Streamlit dashboard + eval metrics |
| **Export** | SheetJS (Excel), jsPDF (PDF), client-side CSV |
| **CI** | GitHub Actions — frontend lint/build + backend smoke tests |

---

## Project structure

```
Odoo-Hackathon-/
├── frontend/
│   ├── src/
│   │   ├── routes/                     # TanStack file routes
│   │   │   ├── index.tsx               # Command Center
│   │   │   ├── login.tsx
│   │   │   ├── digital-twin.tsx
│   │   │   ├── reports.tsx
│   │   │   └── mobile/                 # Employee app (home, impact, challenges, csr, …)
│   │   ├── components/ecosphere/
│   │   │   ├── screens/                # Page dashboards + DigitalTwinPage
│   │   │   ├── mobile/                 # MobileShell, challenges, CSR, impact, twin
│   │   │   ├── digital-twin/           # FloorPanel, LiveZoneWidget, zone detail
│   │   │   ├── ds/                     # KPI, heatmap, ConfidenceBar, AiConfidenceBadge
│   │   │   ├── EcoAiFab.tsx            # AI chatbot (all roles)
│   │   │   ├── CustomReportBuilder.tsx
│   │   │   └── ReportPreview.tsx
│   │   ├── lib/
│   │   │   ├── ecosphere-api.ts        # Backend API client
│   │   │   ├── report-builder.ts       # Custom reports + export
│   │   │   ├── employee-impact.ts      # Personal impact + twin linkage
│   │   │   ├── eco-ai-confidence.ts    # Role/zone AI confidence helpers
│   │   │   └── ecosphere-auth.ts       # Role-based login
│   │   ├── data/                       # Mock ESG + digital twin data
│   │   └── context/                    # Auth + employee gamification
│   └── package.json
├── backend/
│   ├── main.py
│   ├── seed_data.py
│   ├── rag_pipeline.py
│   ├── rag_metrics.py
│   ├── streamlit_rag_dashboard.py
│   ├── requirements.txt
│   └── routes/
│       ├── esg.py
│       ├── mobile.py
│       └── rag.py
├── scripts/
│   ├── dev-all.sh                      # Start frontend + API + RAG
│   └── init-backend.sh                 # Backend venv setup
├── .env.example
├── .github/workflows/ci.yml
└── package.json
```

Demo data: `frontend/src/data/` · Backend mirror: `backend/seed_data.py`

---

## Environment (optional)

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `API_PORT` | `8000` | FastAPI port |
| `RAG_DASHBOARD_PORT` | `8501` | Streamlit RAG port |

---

## Challenge statement

Build an ESG Management Platform that enables organizations to **measure**, **manage**, and **improve** Environmental, Social and Governance performance — integrating operational data, **employee participation**, compliance, and gamification.

| Pillar | Scope |
|--------|--------|
| **Environmental** | Carbon accounting, emission factors, sustainability goals |
| **Social** | CSR activities, employee participation, diversity |
| **Governance** | Policies, audits, compliance tracking |
| **Gamification** | Challenges, badges, XP, rewards, leaderboards |

**Design mockup:** [Excalidraw wireframe](https://link.excalidraw.com/l/65VNwvy7c4X/2m6lz9Ln4)

---

## Business workflow

```
Master Configuration → Daily Operations → Carbon Transactions
  → Employee CSR & Challenges → E/S/G Scores → Org Dashboard & Reports
```

Weighted ESG: Environmental 40% / Social 30% / Governance 30% (configurable in settings).

---

## Core business rules

| Rule | Description |
|------|-------------|
| **Reward redemption** | Points/XP redeem for catalog rewards |
| **Notifications** | Compliance, CSR/challenge approvals, badge unlocks |
| **Auto emission calculation** | Carbon from Purchase/Manufacturing/Expense/Fleet via factors |
| **Evidence requirement** | CSR/challenges may require photo proof before approval |
| **Badge auto-award** | Badges when unlock rules are met |
| **Compliance ownership** | Issues have owner + due date; overdue flagged |

---

## Roadmap (Odoo ERP integration)

1. Sync master data from Odoo (departments, factors, policies, badges)
2. Ingest real ERP transactions into carbon ledger
3. Drive gamification from live employee actions
4. Replace keyword RAG with vector embeddings over ERP documents
5. Enforce business rules via Odoo settings

---

## License

Submitted for the **Odoo Hackathon** — [Athina09/Odoo-Hackathon-](https://github.com/Athina09/Odoo-Hackathon-).
