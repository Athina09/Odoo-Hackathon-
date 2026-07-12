"""ESG RAG pipeline — ingest, chunk, retrieve for EcoSphere insights."""

from __future__ import annotations

import re
from typing import Any

RAG_FLOW: list[dict[str, Any]] = [
    {"id": "ingest", "label": "1. Ingest", "status": "live", "detail": "ESG transactions, CSR, compliance, and challenges seeded from ERP mock data."},
    {"id": "chunk", "label": "2. Chunk", "status": "live", "detail": "Each insight row is one searchable chunk with module + department metadata."},
    {"id": "embed", "label": "3. Embed", "status": "planned", "detail": "Vector embeddings for semantic ESG search (demo uses keyword retrieval)."},
    {"id": "retrieve", "label": "4. Retrieve", "status": "live", "detail": "GET /api/rag/search — token overlap ranked by hit count."},
    {"id": "rerank", "label": "5. Rerank", "status": "planned", "detail": "Cross-encoder rerank for executive Q&A."},
    {"id": "generate", "label": "6. Generate", "status": "planned", "detail": "LLM summaries for Command Center AI feed."},
]

DOMAIN_USES: list[dict[str, str]] = [
    {"domain": "environmental", "use": "Carbon transactions and emission factor lookup"},
    {"domain": "social", "use": "CSR participation and diversity insights"},
    {"domain": "governance", "use": "Compliance issues and audit findings"},
    {"domain": "gamification", "use": "Challenge progress and leaderboard context"},
    {"domain": "reports", "use": "Custom report builder export context"},
    {"domain": "mobile", "use": "Employee challenge and CSR bootstrap"},
]


def retrieve_esg_chunks(
    chunks: list[dict[str, Any]],
    query: str,
    *,
    n_results: int = 5,
    module: str | None = None,
) -> dict[str, Any]:
    tokens = set(re.findall(r"\w+", query.lower()))
    scored: list[tuple[int, dict[str, Any]]] = []
    for item in chunks:
        meta = item.get("metadata") or {}
        if module and meta.get("module", "").lower() != module.lower():
            continue
        text = (item.get("document", "") + " " + str(meta)).lower()
        hits = sum(1 for t in tokens if t in text)
        if hits:
            scored.append((hits, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    results = []
    for hits, item in scored[:n_results]:
        results.append(
            {
                "document": item.get("document", ""),
                "metadata": item.get("metadata", {}),
                "match_score": hits,
                "distance": round(1.0 / max(hits, 1), 3),
            }
        )
    return {
        "query": query,
        "module": module,
        "tokens": sorted(tokens),
        "chunks_scanned": len(chunks),
        "chunks_matched": len(scored),
        "results": results,
    }
