from sqlalchemy.orm import Session
from typing import List

from backend.models.feed import FeedItem
from backend.schemas.dashboard import FeedItem as FeedItemSchema
from backend.ai_bridge import get_engine


class FeedService:
    def __init__(self, db: Session):
        self.db = db
        self.engine = get_engine()

    def get_live_feed(self) -> List[FeedItemSchema]:
        feed_items = self.db.query(FeedItem).all()
        if not feed_items:
            return self._get_default_feed()
        return [
            FeedItemSchema(
                id=f.feed_id,
                t=f.t,
                text=f.text,
                tag=f.tag,
            )
            for f in feed_items
        ]

    def get_ai_live_feed(self) -> List[FeedItemSchema]:
        # Call AI engine for live feed
        ai_feed = self.engine.generate_live_feed()
        return [FeedItemSchema(**item) for item in ai_feed]

    def _get_default_feed(self) -> List[FeedItemSchema]:
        return [
            FeedItemSchema(id="1", t="9s ago", text="Manufacturing emissions increased 18%", tag="carbon"),
            FeedItemSchema(id="2", t="14s ago", text="New CSR challenge uploaded", tag="social"),
            FeedItemSchema(id="3", t="1m ago", text="HR completed diversity policy review", tag="governance"),
            FeedItemSchema(id="4", t="3m ago", text="Finance reached Gold Badge", tag="social"),
            FeedItemSchema(id="5", t="6m ago", text="Audit approved — Warehouse Q2", tag="governance"),
            FeedItemSchema(id="6", t="11m ago", text="Carbon reduced by 7% — Chennai Plant", tag="environment"),
            FeedItemSchema(id="7", t="18m ago", text="AI flagged overdue audit in HR", tag="ai"),
        ]