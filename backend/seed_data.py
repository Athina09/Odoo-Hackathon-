"""EcoSphere demo seed data — mirrors frontend mock datasets."""

from __future__ import annotations

SEED_VERSION = "ecosphere-v1"

DEPARTMENTS = [
    {"id": "DEP001", "name": "Manufacturing", "head": "R. Iyer", "employeeCount": 42},
    {"id": "DEP002", "name": "HR", "head": "Emily Watson", "employeeCount": 18},
    {"id": "DEP003", "name": "Finance", "head": "Michael Brown", "employeeCount": 15},
    {"id": "DEP004", "name": "Operations", "head": "K. Menon", "employeeCount": 30},
    {"id": "DEP005", "name": "Transport", "head": "David Wilson", "employeeCount": 25},
    {"id": "DEP006", "name": "IT", "head": "S. Rao", "employeeCount": 20},
]

EMISSION_FACTORS = [
    {"id": "ef1", "name": "Diesel", "unit": "Liter", "factor": "2.68 kg CO₂/L"},
    {"id": "ef2", "name": "Electricity", "unit": "kWh", "factor": "0.49 kg CO₂/kWh"},
    {"id": "ef3", "name": "Natural Gas", "unit": "m³", "factor": "1.90 kg CO₂/m³"},
]

CARBON_TRANSACTIONS = [
    {"id": "ct1", "date": "Jun 28", "source": "Diesel generator", "department": "Manufacturing", "amount": "420 L", "co2Kg": 1120},
    {"id": "ct2", "date": "Jul 1", "source": "Grid electricity", "department": "Manufacturing", "amount": "12,400 kWh", "co2Kg": 6080},
    {"id": "ct3", "date": "Jul 4", "source": "Office electricity", "department": "HR", "amount": "890 kWh", "co2Kg": 436},
    {"id": "ct4", "date": "Jul 5", "source": "Office electricity", "department": "Finance", "amount": "410 kWh", "co2Kg": 201},
    {"id": "ct5", "date": "Jun 30", "source": "Fleet diesel", "department": "Transport", "amount": "890 L", "co2Kg": 2340},
]

CSR_ACTIVITIES = [
    {"id": "csr1", "activity": "Tree Plantation Drive", "department": "HR", "participants": 42, "points": 150, "status": "excellent"},
    {"id": "csr2", "activity": "Factory Floor Blood Donation", "department": "Manufacturing", "participants": 61, "points": 180, "status": "excellent"},
    {"id": "csr3", "activity": "Financial Literacy Workshop", "department": "Finance", "participants": 8, "points": 90, "status": "medium"},
]

COMPLIANCE_ISSUES = [
    {"id": "ci1", "issue": "Fire exit partially blocked, Floor 3", "department": "Manufacturing", "severity": "critical", "owner": "R. Iyer", "dueDate": "Jul 5"},
    {"id": "ci2", "issue": "Late quarterly financial audit", "department": "Finance", "severity": "low", "owner": "Michael Brown", "dueDate": "Jun 30"},
]

CHALLENGES = [
    {"id": "ch1", "title": "No Plastic Week", "category": "Reduce Plastic Usage", "xp": 250, "participants": 84},
    {"id": "ch2", "title": "Cycle to Work Challenge", "category": "Cycle to Work", "xp": 350, "participants": 42},
    {"id": "ch3", "title": "Paperless Office", "category": "Paperless Office", "xp": 150, "participants": 120},
]

ESG_KPIS = {
    "overallEsgScore": 78,
    "carbonFootprintTco2": 12.4,
    "complianceScore": 86,
    "csrParticipation": 72,
    "activeChallenges": 18,
    "aiConfidence": 91,
}

ESG_INSIGHTS = [
    {"id": "i1", "module": "Environmental", "text": "Manufacturing grid load up 12% vs last week — Lines 1–4 peak draw", "timestamp": "22s ago"},
    {"id": "i2", "module": "Social", "text": "Finance CSR participation at 31% — lowest in org", "timestamp": "1m ago"},
    {"id": "i3", "module": "Governance", "text": "Manufacturing fire exit blocked Floor 3 — overdue since Jul 5", "timestamp": "3m ago"},
    {"id": "i4", "module": "Gamification", "text": "No Plastic Week 72% complete — 84 participants", "timestamp": "5m ago"},
    {"id": "i5", "module": "Environmental", "text": "Transport fleet diesel batch #TR-449 accounts for 24% of quarterly emissions", "timestamp": "8m ago"},
]

EMPLOYEES = [
    {"id": "EMP001", "name": "John Carter", "email": "john.carter@ecosphere.in", "departmentId": "DEP001", "role": "DEPARTMENT_MANAGER"},
    {"id": "EMP004", "name": "Alex Morgan", "email": "alex.morgan@ecosphere.in", "departmentId": "DEP002", "role": "ESG_MANAGER"},
    {"id": "EMP005", "name": "Sarah Johnson", "email": "sarah.j@ecosphere.in", "departmentId": "DEP006", "role": "EMPLOYEE"},
    {"id": "EMP006", "name": "David Wilson", "email": "david.w@ecosphere.in", "departmentId": "DEP005", "role": "EMPLOYEE"},
]

MOBILE_BOOTSTRAP = {
    "EMP005": {
        "employeeId": "EMP005",
        "xp": 1240,
        "points": 680,
        "rank": 12,
        "badges": ["eco-starter"],
        "challenges": [
            {"id": "mc1", "title": "No Plastic Week", "progress": 4, "progressTarget": 7, "xpReward": 200, "status": "in_progress"},
            {"id": "mc2", "title": "Cycle to Office 5 Times", "progress": 2, "progressTarget": 5, "xpReward": 250, "status": "in_progress"},
        ],
        "csrActivities": [
            {"id": "ms1", "title": "Tree Plantation Drive", "date": "Jul 18", "points": 150, "status": "approved"},
        ],
        "notifications": [
            {"id": "n1", "text": "Challenge approved: No Plastic Week +200 XP", "read": False},
            {"id": "n2", "text": "CSR proof accepted for Tree Plantation Drive", "read": True},
        ],
    },
    "EMP006": {
        "employeeId": "EMP006",
        "xp": 980,
        "points": 420,
        "rank": 18,
        "badges": ["eco-starter"],
        "challenges": [
            {"id": "mc3", "title": "Energy Saving Sprint", "progress": 6, "progressTarget": 10, "xpReward": 180, "status": "in_progress"},
        ],
        "csrActivities": [],
        "notifications": [
            {"id": "n3", "text": "New challenge: Cycle to Work Challenge", "read": False},
        ],
    },
}

RAG_CHUNKS = [
    {"document": "Manufacturing grid electricity 12,400 kWh Jul 1 — 6,080 kg CO₂", "metadata": {"module": "Environmental", "department": "Manufacturing"}},
    {"document": "Finance CSR participation 31% lowest department during close season", "metadata": {"module": "Social", "department": "Finance"}},
    {"document": "Fire exit partially blocked Floor 3 Manufacturing overdue Jul 5 owner R. Iyer", "metadata": {"module": "Governance", "department": "Manufacturing"}},
    {"document": "No Plastic Week challenge 72% complete 84 participants gamification", "metadata": {"module": "Gamification", "department": "HR"}},
    {"document": "Transport fleet diesel 890 L accounts for 24% quarterly emissions", "metadata": {"module": "Environmental", "department": "Transport"}},
    {"document": "HR Tree Plantation Drive 42 participants highest single-activity turnout", "metadata": {"module": "Social", "department": "HR"}},
    {"document": "Policy acknowledgement HR 100% Manufacturing 82% governance gap", "metadata": {"module": "Governance", "department": "HR"}},
]

RAG_EVAL_QUERIES = [
    {"query": "manufacturing carbon electricity", "expected_module": "Environmental"},
    {"query": "finance csr participation low", "expected_module": "Social"},
    {"query": "fire exit compliance overdue", "expected_module": "Governance"},
    {"query": "plastic week challenge participants", "expected_module": "Gamification"},
]
