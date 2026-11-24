#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8898}"
exec python3 server.py --port "${PORT}"
