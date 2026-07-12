import sys
import os

# Add Ai-engine to path
ai_engine_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "Ai-engine")
sys.path.insert(0, os.path.abspath(ai_engine_path))

try:
    from EsgAiEngine import get_engine as _get_engine
    _engine_instance = _get_engine()
except ImportError:
    # Fallback mock engine
    class MockEsgEngine:
        def compute_esg_summary(self):
            return {"overall_score": 91, "carbon_footprint": 124, "ai_confidence": 94, "compliance_issues": 4}
        
        def generate_live_feed(self):
            return [
                {"id": "1", "t": "9s ago", "text": "Manufacturing emissions increased 18%", "tag": "carbon"},
                {"id": "2", "t": "14s ago", "text": "New CSR challenge uploaded", "tag": "social"},
                {"id": "3", "t": "1m ago", "text": "HR completed diversity policy review", "tag": "governance"},
                {"id": "4", "t": "3m ago", "text": "Finance reached Gold Badge", "tag": "social"},
                {"id": "5", "t": "6m ago", "text": "Audit approved — Warehouse Q2", "tag": "governance"},
                {"id": "6", "t": "11m ago", "text": "Carbon reduced by 7% — Chennai Plant", "tag": "environment"},
                {"id": "7", "t": "18m ago", "text": "AI flagged overdue audit in HR", "tag": "ai"},
            ]
        
        def generate_recommendations(self):
            return [
                {"id": "r1", "title": "Switch 5 diesel fleet vehicles to EV", "impact": "Save 21 tons CO₂", "esgBoost": "+8 ESG"},
                {"id": "r2", "title": "Enable smart HVAC in Office Chennai", "impact": "−14% energy use", "esgBoost": "+3 ESG"},
            ]
    
    _engine_instance = MockEsgEngine()


def get_engine():
    return _engine_instance