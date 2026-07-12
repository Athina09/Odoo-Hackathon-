from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend.models import (
    User, KPISnapshot, DepartmentScore, Facility, FeedItem,
    CarbonTrend, EsgRadar, DepartmentScoresChart, TopEmitters,
    AIRecommendation, EnvironmentCase
)
from backend.security import get_password_hash


def seed_all():
    db = SessionLocal()
    try:
        if db.query(User).first():
            return  # Already seeded

        # Users
        users = [
            User(
                email="superadmin@ecosphere.in",
                hashed_password=get_password_hash("admin123"),
                full_name="Super Admin",
                role="superadmin",
                is_active=1,
            ),
            User(
                email="alex.morgan@ecosphere.in",
                hashed_password=get_password_hash("manager"),
                full_name="Alex Morgan",
                role="manager",
                is_active=1,
            ),
            User(
                email="john.carter@ecosphere.in",
                hashed_password=get_password_hash("dept123"),
                full_name="John Carter",
                role="dept_manager",
                is_active=1,
            ),
        ]
        db.add_all(users)

        # KPI Snapshot
        kpi = KPISnapshot(
            overall_score_value=91,
            overall_score_label="Excellent",
            overall_score_trend="↑ +4%",
            carbon_value="124 tCO₂",
            carbon_trend="↓ 12%",
            ai_confidence_value="94%",
            ai_confidence_sub="Verified",
            compliance_issues_value=4,
            compliance_issues_sub="2 Critical",
            csr_participation_value="87%",
            csr_participation_trend="↑ 8%",
            challenges_active_value=18,
            challenges_active_sub="6 ending soon",
        )
        db.add(kpi)

        # Departments
        departments = [
            DepartmentScore(dept_id="mfg", department="Manufacturing", esg=71, carbon="high", csr=68, governance=74, confidence=83, risk="high", status="watch"),
            DepartmentScore(dept_id="hr", department="HR", esg=92, carbon="low", csr=94, governance=96, confidence=97, risk="low", status="excellent"),
            DepartmentScore(dept_id="it", department="IT", esg=88, carbon="medium", csr=85, governance=90, confidence=91, risk="medium", status="good"),
            DepartmentScore(dept_id="fin", department="Finance", esg=95, carbon="low", csr=93, governance=98, confidence=99, risk="low", status="excellent"),
            DepartmentScore(dept_id="ops", department="Operations", esg=79, carbon="medium", csr=77, governance=82, confidence=86, risk="medium", status="good"),
            DepartmentScore(dept_id="legal", department="Legal & Compliance", esg=90, carbon="low", csr=88, governance=97, confidence=95, risk="low", status="excellent"),
        ]
        db.add_all(departments)

        # Facilities
        facilities = [
            Facility(facility_id="chennai-plant", name="Chennai Plant", district="Chennai", lat=13.0827, lng=80.2707, status="critical", energy=91, water=88, carbon=94, employees=420, waste=82, risk="high"),
            Facility(facility_id="coimbatore-factory", name="Coimbatore Factory", district="Coimbatore", lat=11.0168, lng=76.9558, status="good", energy=78, water=81, carbon=55, employees=310, waste=62, risk="low"),
            Facility(facility_id="madurai-warehouse", name="Madurai Warehouse", district="Madurai", lat=9.9252, lng=78.1198, status="watch", energy=64, water=58, carbon=72, employees=180, waste=65, risk="medium"),
            Facility(facility_id="salem-unit", name="Salem Unit", district="Salem", lat=11.6643, lng=78.146, status="good", energy=76, water=74, carbon=58, employees=145, waste=60, risk="low"),
            Facility(facility_id="trichy-office", name="Trichy Office", district="Trichy", lat=10.7905, lng=78.7047, status="watch", energy=70, water=68, carbon=66, employees=95, waste=58, risk="medium"),
            Facility(facility_id="tirunelveli-site", name="Tirunelveli Site", district="Tirunelveli", lat=8.7139, lng=77.7567, status="good", energy=72, water=79, carbon=48, employees=88, waste=54, risk="low"),
            Facility(facility_id="vellore-lab", name="Vellore Lab", district="Vellore", lat=12.9165, lng=79.1325, status="watch", energy=68, water=71, carbon=61, employees=120, waste=57, risk="medium"),
            Facility(facility_id="kanyakumari-depot", name="Kanyakumari Depot", district="Kanyakumari", lat=8.0883, lng=77.5385, status="good", energy=65, water=83, carbon=42, employees=52, waste=50, risk="low"),
        ]
        db.add_all(facilities)

        # Feed Items
        feed_items = [
            FeedItem(feed_id="1", t="9s ago", text="Manufacturing emissions increased 18%", tag="carbon"),
            FeedItem(feed_id="2", t="14s ago", text="New CSR challenge uploaded", tag="social"),
            FeedItem(feed_id="3", t="1m ago", text="HR completed diversity policy review", tag="governance"),
            FeedItem(feed_id="4", t="3m ago", text="Finance reached Gold Badge", tag="social"),
            FeedItem(feed_id="5", t="6m ago", text="Audit approved — Warehouse Q2", tag="governance"),
            FeedItem(feed_id="6", t="11m ago", text="Carbon reduced by 7% — Chennai Plant", tag="environment"),
            FeedItem(feed_id="7", t="18m ago", text="AI flagged overdue audit in HR", tag="ai"),
        ]
        db.add_all(feed_items)

        # Charts
        carbon_trend = [
            CarbonTrend(month="Jan", tco2=148),
            CarbonTrend(month="Feb", tco2=142),
            CarbonTrend(month="Mar", tco2=138),
            CarbonTrend(month="Apr", tco2=135),
            CarbonTrend(month="May", tco2=130),
            CarbonTrend(month="Jun", tco2=124),
        ]
        db.add_all(carbon_trend)

        esg_radar = [
            EsgRadar(axis="Environment", score=88),
            EsgRadar(axis="Social", score=92),
            EsgRadar(axis="Governance", score=94),
            EsgRadar(axis="Ethics", score=89),
            EsgRadar(axis="Supply Chain", score=85),
        ]
        db.add_all(esg_radar)

        dept_scores = [
            DepartmentScoresChart(name="HR", value=92),
            DepartmentScoresChart(name="Finance", value=95),
            DepartmentScoresChart(name="IT", value=88),
            DepartmentScoresChart(name="Ops", value=79),
            DepartmentScoresChart(name="Mfg", value=71),
        ]
        db.add_all(dept_scores)

        top_emitters = [
            TopEmitters(site="Chennai Plant", tco2=42),
            TopEmitters(site="Madurai Warehouse", tco2=28),
            TopEmitters(site="Coimbatore Factory", tco2=22),
            TopEmitters(site="Trichy Office", tco2=18),
        ]
        db.add_all(top_emitters)

        # AI Recommendations
        recommendations = [
            AIRecommendation(rec_id="r1", title="Switch 5 diesel fleet vehicles to EV", impact="Save 21 tons CO₂", esg_boost="+8 ESG"),
            AIRecommendation(rec_id="r2", title="Enable smart HVAC in Office Chennai", impact="−14% energy use", esg_boost="+3 ESG"),
        ]
        db.add_all(recommendations)

        # Environment Cases
        env_cases = [
            EnvironmentCase(case_id="ES-101", ref="ENV/2026/CHN/0042", title="Chennai Plant Carbon Overrun", district="Chennai", status="Active", severity="critical", ai_confidence=94, flagged=1, officer="M. Priya", opened="2026-05-10", type="Carbon", site="Chennai Plant"),
            EnvironmentCase(case_id="ES-102", ref="ENV/2026/MDU/0018", title="Madurai Warehouse Waste Breach", district="Madurai", status="Active", severity="critical", ai_confidence=88, flagged=1, officer="R. Kumar", opened="2026-05-12", type="Waste", site="Madurai Warehouse"),
            EnvironmentCase(case_id="ES-103", ref="ENV/2026/CBE/0033", title="Coimbatore Energy Audit Failure", district="Coimbatore", status="Review", severity="high", ai_confidence=72, flagged=1, officer="S. Anand", opened="2026-05-14", type="Energy", site="Coimbatore Factory"),
            EnvironmentCase(case_id="ES-104", ref="ENV/2026/SLM/0012", title="Salem Scope 2 Reporting Gap", district="Salem", status="Active", severity="medium", ai_confidence=58, flagged=0, officer="K. Devi", opened="2026-05-03", type="Reporting", site="Salem Unit"),
            EnvironmentCase(case_id="ES-105", ref="ENV/2026/TRY/0029", title="Trichy Water Usage Anomaly", district="Trichy", status="Active", severity="high", ai_confidence=83, flagged=1, officer="A. Ramesh", opened="2026-05-04", type="Water", site="Trichy Office"),
            EnvironmentCase(case_id="ES-106", ref="ENV/2026/TIR/0007", title="Tirunelveli Solar Offset Delay", district="Tirunelveli", status="Watch", severity="medium", ai_confidence=41, flagged=0, officer="D. Vinod", opened="2026-03-19", type="Renewable", site="Tirunelveli Site"),
            EnvironmentCase(case_id="ES-107", ref="ENV/2026/VEL/0051", title="Vellore Emissions Spike", district="Vellore", status="Active", severity="critical", ai_confidence=79, flagged=1, officer="S. Hari", opened="2026-05-06", type="Emissions", site="Vellore Lab"),
            EnvironmentCase(case_id="ES-108", ref="ENV/2026/KNY/0002", title="Kanyakumari Plastic Waste Audit", district="Kanyakumari", status="Review", severity="low", ai_confidence=33, flagged=0, officer="L. Thomas", opened="2026-05-07", type="Waste", site="Kanyakumari Depot"),
        ]
        db.add_all(env_cases)

        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()