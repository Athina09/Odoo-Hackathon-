import numpy as np
from logger import logger


class EsgRiskScorer:
    """Compute ESG risk density per department/facility"""

    def __init__(self, weights: dict = None):
        self.weights = weights or {
            "environmental": 0.4,
            "social": 0.3,
            "governance": 0.3,
        }
        logger.info("EsgRiskScorer initialized")

    def compute_risk(self, dept_data: dict) -> dict:
        """Compute ESG risk score for a department"""
        env_score = dept_data.get("environmental", 0) or (100 - dept_data.get("carbon_score", 0))
        soc_score = dept_data.get("social", 0) or dept_data.get("csr", 0)
        gov_score = dept_data.get("governance", 0)
        
        # Weighted risk (inverse of performance)
        env_risk = (100 - env_score) * self.weights["environmental"]
        soc_risk = (100 - soc_score) * self.weights["social"]
        gov_risk = (100 - gov_score) * self.weights["governance"]
        
        total_risk = env_risk + soc_risk + gov_risk
        risk_level = self._classify_risk(total_risk)
        
        return {
            "department": dept_data.get("department", "unknown"),
            "environmental_risk": round(env_risk, 2),
            "social_risk": round(soc_risk, 2),
            "governance_risk": round(gov_risk, 2),
            "total_risk": round(total_risk, 2),
            "risk_level": risk_level,
        }

    def compute_facility_risk(self, facility_data: dict) -> dict:
        """Compute risk for a facility based on metrics"""
        energy_risk = min(facility_data.get("energy", 0) / 100, 1.0)
        water_risk = min(facility_data.get("water", 0) / 100, 1.0)
        carbon_risk = min(facility_data.get("carbon", 0) / 100, 1.0)
        waste_risk = min(facility_data.get("waste", 0) / 100, 1.0)
        
        avg_risk = np.mean([energy_risk, water_risk, carbon_risk, waste_risk])
        risk_level = self._classify_risk(avg_risk * 100)
        
        return {
            "facility": facility_data.get("name", "unknown"),
            "energy_risk": round(energy_risk, 3),
            "water_risk": round(water_risk, 3),
            "carbon_risk": round(carbon_risk, 3),
            "waste_risk": round(waste_risk, 3),
            "avg_risk": round(avg_risk, 3),
            "risk_level": risk_level,
        }

    def _classify_risk(self, score: float) -> str:
        if score <= 25: return "low"
        elif score <= 50: return "medium"
        elif score <= 75: return "high"
        else: return "critical"

    def score_all_departments(self, departments: list) -> list:
        return [self.compute_risk(d) for d in departments]

    def score_all_facilities(self, facilities: list) -> list:
        return [self.compute_facility_risk(f) for f in facilities]


def compute_esg_risk(data: dict) -> dict:
    """Convenience function"""
    scorer = EsgRiskScorer()
    if "departments" in data:
        return {"departments": scorer.score_all_departments(data["departments"])}
    if "facilities" in data:
        return {"facilities": scorer.score_all_facilities(data["facilities"])}
    return {}