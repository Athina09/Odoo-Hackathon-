from fastapi import APIRouter, Query

from rag_metrics import get_all_metrics
from rag_pipeline import DOMAIN_USES, RAG_FLOW, retrieve_esg_chunks
from seed_data import RAG_CHUNKS

router = APIRouter(prefix="/api/rag", tags=["rag"])


@router.get("/flow")
def rag_flow():
    return {"stages": RAG_FLOW, "domains": DOMAIN_USES}


@router.get("/metrics")
def rag_metrics():
    return get_all_metrics()


@router.get("/search")
def rag_search(
    query: str,
    n_results: int = Query(5, ge=1, le=20),
    module: str | None = Query(None),
):
    return retrieve_esg_chunks(RAG_CHUNKS, query, n_results=n_results, module=module)
