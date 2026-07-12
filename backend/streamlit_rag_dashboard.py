"""EcoSphere ESG insight RAG dashboard — streamlit run streamlit_rag_dashboard.py"""

from __future__ import annotations

import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parent
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

import pandas as pd
import streamlit as st

from rag_metrics import get_all_metrics
from rag_pipeline import RAG_FLOW, retrieve_esg_chunks
from seed_data import RAG_CHUNKS

st.set_page_config(page_title="EcoSphere RAG", layout="wide")
st.title("EcoSphere — ESG RAG Pipeline")
st.caption("Retrieve ESG insights from seeded ERP chunks")

metrics = get_all_metrics()
col1, col2, col3 = st.columns(3)
col1.metric("Chunks indexed", metrics["chunks_indexed"])
col2.metric("Retrieval precision", f"{metrics['retrieval']['precision'] * 100:.0f}%")
col3.metric("Eval queries", metrics["retrieval"]["queries_evaluated"])

st.subheader("Pipeline stages")
st.dataframe(pd.DataFrame(RAG_FLOW)[["label", "status", "detail"]], use_container_width=True, hide_index=True)

st.divider()
query = st.text_input("Search ESG insights", placeholder="e.g. manufacturing carbon fire exit")
module = st.selectbox("Module filter", ["All", "Environmental", "Social", "Governance", "Gamification"])
if query:
    mod = None if module == "All" else module
    out = retrieve_esg_chunks(RAG_CHUNKS, query, n_results=5, module=mod)
    st.caption(f"Matched {out['chunks_matched']} / {out['chunks_scanned']} chunks")
    for r in out["results"]:
        st.markdown(f"**{r['metadata'].get('module', '—')}** · {r['document']}")
