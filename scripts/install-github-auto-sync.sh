#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STATE_DIR="$HOME/Library/Application Support/gzl-github-sync"
PID_FILE="$STATE_DIR/auto-sync.pid"
PLIST_PATH="$HOME/Library/LaunchAgents/com.luqiling.gzl.github-auto-sync.plist"
LOG_DIR="$HOME/Library/Logs/gzl-github-sync"
LOG_FILE="$LOG_DIR/loop.log"

mkdir -p "$STATE_DIR" "$LOG_DIR"

if [ -f "$PLIST_PATH" ]; then
  launchctl bootout "gui/$(id -u)" "$PLIST_PATH" >/dev/null 2>&1 || true
  rm -f "$PLIST_PATH"
fi

if [ -f "$PID_FILE" ]; then
  EXISTING_PID="$(cat "$PID_FILE")"
  if kill -0 "$EXISTING_PID" >/dev/null 2>&1; then
    echo "Auto sync is already running with PID $EXISTING_PID"
    echo "Logs: $LOG_FILE"
    exit 0
  fi

  rm -f "$PID_FILE"
fi

nohup /bin/zsh "$ROOT_DIR/scripts/github-auto-sync-loop.sh" > "$LOG_FILE" 2>&1 < /dev/null &
NEW_PID=$!
echo "$NEW_PID" > "$PID_FILE"

echo "Started auto sync process: $NEW_PID"
echo "PID file: $PID_FILE"
echo "Logs: $LOG_DIR"
