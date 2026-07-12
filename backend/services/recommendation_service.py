from sqlalchemy.orm import Session
from typing import List

from backend.models.recommendation import AIRecommendation
from backend.schemas.dashboard import AIRecommendation as AIRecSchema
from backend.ai_bridge import get_engine


class RecommendationService:
    def __init__(self, db: Session):
        self.db = db
        self.engine = get_engine()

    def get_ai_recommendations(self) -> List[AIRecSchema]:
        recs = self.db.query(AIRecommendation).all()
        if not recs:
            return self._get_default_recommendations()
        return [
            AIRecSchema(
                id=r.rec_id,
                title=r.title,
                impact=r.impact,
                esgBoost=r.esg_boost,
            )
            for r in recs
        ]

    def get_ai_engine_recommendations(self) -> List[AIRecSchema]:
        ai_recs = self.engine.generate_recommendations()
        return [AIRecSchema(**item) for item in ai_recs]

    def _get_default_recommendations(self) -> List[AIRecSchema]:
        return [
            AIRecSchema(id="r1", title="Switch 5 diesel fleet vehicles to EV", impact="Save 21 tons CO₂", esgBoost="+8 ESG"),
            AIRecSchema(id="r2", title="Enable smart HVAC in Office Chennai", impact="−14% energy use", esgBoost="+3 ESG"),
        ]