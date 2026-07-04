#!/bin/zsh
set -euo pipefail

PID_FILE="$HOME/Library/Application Support/gzl-github-sync/auto-sync.pid"
PENDING_FILE="$HOME/Library/Application Support/gzl-github-sync/pending-upload.txt"
PLIST_PATH="$HOME/Library/LaunchAgents/com.luqiling.gzl.github-auto-sync.plist"
LOCK_DIR="${TMPDIR:-/tmp}/gzl-github-auto-sync.lock"

if [ -f "$PLIST_PATH" ]; then
  launchctl bootout "gui/$(id -u)" "$PLIST_PATH" >/dev/null 2>&1 || true
  rm -f "$PLIST_PATH"
fi

if [ -f "$PID_FILE" ]; then
  PID_VALUE="$(cat "$PID_FILE")"
  if kill -0 "$PID_VALUE" >/dev/null 2>&1; then
    kill "$PID_VALUE"
  fi

  rm -f "$PID_FILE"
fi

rm -f "$LOCK_DIR/pid" >/dev/null 2>&1 || true
rmdir "$LOCK_DIR" >/dev/null 2>&1 || true
rm -f "$PENDING_FILE" >/dev/null 2>&1 || true

echo "Stopped GitHub auto sync."
