#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
STATE_DIR="$HOME/Library/Application Support/gzl-github-sync"
PENDING_FILE="$STATE_DIR/pending-upload.txt"

cd "$ROOT_DIR"

if [ -f "$PENDING_FILE" ]; then
  cat "$PENDING_FILE"
  exit 0
fi

echo "No pending GitHub upload confirmation."
echo
git status --short --branch
