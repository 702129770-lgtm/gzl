#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
INTERVAL_SECONDS="${AUTO_SYNC_INTERVAL_SECONDS:-30}"

while true; do
  /bin/zsh "$ROOT_DIR/scripts/github-auto-sync.sh" || true
  sleep "$INTERVAL_SECONDS"
done
