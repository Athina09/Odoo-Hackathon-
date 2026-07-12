# EcoSphere — ESG Management Platform

**Odoo Hackathon submission** · Environmental, Social & Governance performance in one executive dashboard.

Environmental, Social and Governance (ESG) has become a critical aspect of modern businesses. Organizations are expected to monitor carbon emissions, promote employee well-being, and maintain governance compliance. While many ERP systems collect operational data, ESG reporting is often manual, disconnected, and difficult to monitor in real time.

**EcoSphere** integrates ESG directly into day-to-day ERP operations by measuring sustainability metrics, encouraging employee participation, and providing meaningful reports for management.

---

## Login & passwords

Run the app (`npm run install:frontend && npm run dev` from this folder), then open **http://localhost:8090/login**.

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

**Role passwords**

| Role | Password |
|------|----------|
| Super Admin | `admin123` |
| ESG Manager | `manager` |
| Department Manager | `dept123` |
| Employee | `employee` |

On the login page: pick your **role** → select your **account** → enter the **role password** → **Sign in**.

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

## What this repo demonstrates

The **Executive Command Center** (`/`) is a working frontend prototype aligned with the hackathon brief:

- **KPI row** — overall ESG score, carbon footprint, AI confidence, compliance issues, CSR participation, active challenges
- **Tamil Nadu ESG heatmap** — facility-level environmental exposure across TN districts (Chennai, Coimbatore, Madurai, Salem, and more)
- **AI live feed** — environment, social, governance, and carbon insights
- **Department performance table** — E, S, G scores, risk, and status per department
- **Charts** — carbon trend, CSR participation, governance compliance, top emitters, ESG health breakdown
- **Navigation shell** — Environment · Social · Governance · Digital Twin · Gamification · Reports · Settings (sidebar IA from spec)

Demo data lives in `frontend/src/data/ecosphere.ts`. The heatmap reuses Tamil Nadu district coordinates for geographic consistency.

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

## Suggested data model

### Master data

| Model | Purpose | Key fields |
|-------|---------|------------|
| **Department** | Org hierarchy and ESG ownership | Name, Code, Head, Parent Department, Employee Count, Status |
| **Category** | Shared values for Social & Gamification | Name, Type (CSR Activity / Challenge), Status |
| **Emission Factor** | Carbon values for calculations | Factor metadata per activity type |
| **Product ESG Profile** | ESG data linked to products | Product-linked environmental attributes |
| **Environmental Goal** | Sustainability targets | Goal name, target, deadline, status |
| **ESG Policy** | Governance policies | Title, version, effective date, status |
| **Badge** | Employee achievements | Name, Description, Unlock Rule, Icon |
| **Reward** | Redeemable incentives | Name, Description, Points Required, Stock, Status |

### Transactional data

| Model | Purpose | Key fields |
|-------|---------|------------|
| **Carbon Transaction** | Emissions from ERP operations | Source, amount, emission factor, calculated tCO₂ |
| **CSR Activity** | Social initiatives | Title, category, date, organizer, status |
| **Employee Participation** | CSR involvement | Employee, Activity, Proof, Approval Status, Points, Completion Date |
| **Challenge** | Sustainability challenges | Title, Category, XP, Difficulty, Evidence Required, Deadline, Status |
| **Challenge Participation** | Progress in challenges | Challenge, Employee, Progress, Proof, Approval, XP Awarded |
| **Policy Acknowledgement** | Policy acceptance | Employee, Policy, acknowledged at |
| **Audit** | Governance audits | Scope, date, findings, status |
| **Compliance Issue** | Violations | Audit, Severity, Description, Owner, Due Date, Status |
| **Department Score** | Aggregated ESG per dept | Environmental, Social, Governance, Total Score |

### Challenge lifecycle

`Draft` → `Active` → `Under Review` → `Completed` (or `Archived` at any point)

---

## Expected features (full platform)

### Environmental
- Configure emission factors
- Calculate carbon emissions
- Department carbon tracking
- Sustainability goals
- Environmental dashboard

### Social
- CSR activities
- Employee participation
- Diversity metrics
- Training completion

### Governance
- ESG policies
- Policy acknowledgements
- Audits
- Compliance issues

### Gamification
- Challenges (full lifecycle)
- XP and badges (auto-awarded when unlock rules are met)
- Rewards (redeemable with points/XP, stock-aware)
- Leaderboards

### Settings & administration
- Departments and category management
- ESG configuration
- Notification settings

### Reports
- Environmental, Social, Governance, and ESG Summary reports
- Custom report builder (filters + export PDF / Excel / CSV)
- Filters: department, date range, module, employee, challenge, ESG category

---

## Core business rules (in scope)

| Rule | Description |
|------|-------------|
| **Reward redemption** | Employees redeem Points/XP for catalog rewards; stock and balance are updated |
| **Notifications** | In-app/email for compliance issues, CSR/challenge approvals, policy reminders, badge unlocks |
| **Auto emission calculation** | When enabled, carbon transactions derive from Purchase/Manufacturing/Expense/Fleet via emission factors |
| **Evidence requirement** | When enabled, CSR participation cannot be approved without proof |
| **Badge auto-award** | When enabled, badges assign automatically when unlock rules are satisfied |
| **Compliance ownership** | Every issue has Owner + Due Date; overdue open issues are flagged and notified |

### Bonus ideas (optional)
- Department ESG rankings
- Smart dashboard visualizations
- Mobile-responsive interface

---

## Tech stack

| Layer | Stack |
|-------|--------|
| UI | React 19, TypeScript, TanStack Router, Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Map | Leaflet + OpenStreetMap (Tamil Nadu facility heatmap) |
| Components | Radix UI / shadcn-style primitives |

---

## Quick start

### Prerequisites
- Node.js 18+
- npm

### Install & run (frontend only)

```bash
npm run install:frontend
npm run dev
```

### Full stack (frontend + API + RAG + mobile bootstrap)

```bash
npm run install:all
npm run dev:all
```

| Service | URL |
|---------|-----|
| EcoSphere app | http://localhost:8090/ |
| Login | http://localhost:8090/login |
| **Mobile app** (Employee role) | http://localhost:8090/mobile |
| API docs | http://127.0.0.1:8000/docs |
| RAG dashboard | http://127.0.0.1:8501 |

Open **http://localhost:8090/** — you will be redirected to **`/login`** if not signed in.

### API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Backend health check |
| GET | `/api/esg/kpis` | Command Center KPIs |
| GET | `/api/esg/departments` | Department master data |
| GET | `/api/esg/carbon-transactions` | Carbon ledger (`?department=` optional) |
| GET | `/api/esg/csr-activities` | CSR activities |
| GET | `/api/esg/compliance-issues` | Governance issues |
| GET | `/api/esg/challenges` | Gamification challenges |
| GET | `/api/mobile/bootstrap/{employeeId}` | Initialize mobile session |
| GET | `/api/rag/search?query=` | ESG insight RAG retrieval |
| GET | `/api/rag/flow` | RAG pipeline stages |
| GET | `/api/rag/metrics` | Retrieval eval metrics |

### CI

GitHub Actions (`.github/workflows/ci.yml`) on push to `main`: frontend lint + build, backend smoke tests.

### How to sign in

See **[Login & passwords](#login--passwords)** at the top of this README for the full account table.

1. Open **http://localhost:8090/login**
2. Choose your **role** (Super Admin, ESG Manager, Department Manager, or Employee)
3. Select your **account** from the list (assigned in Administration for non–Super Admin roles)
4. Enter the **role password** (same password for every account in that role)
5. Click **Sign in** — you land on the home screen for that role (see table above)

After login, open **Digital Twin** from the sidebar (`/digital-twin`) — Super Admin and ESG Manager see all facilities; other web roles are scoped to their assigned facility.

### Build for production

```bash
npm run build
npm run preview
```

---

## Project structure

```
frontend/
├── src/
│   ├── routes/
│   │   ├── index.tsx                 # ESG Command Center (/)
│   │   ├── login.tsx                 # Role-based login
│   │   ├── digital-twin.tsx          # Digital Twin floor view
│   │   ├── admin.tsx                 # Super Admin console
│   │   ├── manager.tsx               # ESG Manager hub
│   │   ├── department.tsx            # Department Manager dashboard
│   │   ├── mobile/                   # Employee mobile app
│   │   └── environment.tsx           # Environment cases
│   ├── components/ecosphere/
│   │   ├── EcoShell.tsx              # Layout (sidebar + header)
│   │   ├── EcoKpiRow.tsx             # Top KPI cards
│   │   ├── EsgHeatmap.tsx            # Tamil Nadu ESG heatmap
│   │   ├── AiLiveFeed.tsx            # AI insights stream
│   │   ├── DepartmentTable.tsx       # Department ESG scores
│   │   └── EcoChartsGrid.tsx         # Trends & health charts
│   ├── context/EcoAuthContext.tsx    # Auth & admin config
│   └── data/ecosphere.ts             # Demo KPIs, facilities, departments, feed
├── package.json
└── vite.config.ts
backend/                              # FastAPI — ESG API, mobile bootstrap, RAG
├── main.py
├── seed_data.py
├── rag_pipeline.py
├── streamlit_rag_dashboard.py
└── routes/                           # esg, mobile, rag
.github/workflows/ci.yml              # Frontend + backend CI
```

---

## Roadmap (ERP integration)

This submission focuses on the **unified executive dashboard** and data model alignment. A full Odoo integration would:

1. Sync master data (departments, emission factors, policies, badges, rewards)
2. Ingest transactional ERP events (purchases, manufacturing, fleet) into carbon transactions
3. Drive gamification (challenges, XP, leaderboards) from real employee actions
4. Generate module reports and custom exports from live data
5. Enforce business rules via Odoo settings (auto-carbon, evidence, notifications)

---

## License

Submitted for the **Odoo Hackathon** — [Athina09/Odoo-Hackathon-](https://github.com/Athina09/Odoo-Hackathon-).
