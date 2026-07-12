#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
echo "EcoSphere backend ready. Run: cd backend && source .venv/bin/activate && uvicorn main:app --port 8000"
