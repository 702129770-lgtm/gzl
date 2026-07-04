#!/bin/zsh
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export GIT_TERMINAL_PROMPT=0

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
STATE_DIR="$HOME/Library/Application Support/gzl-github-sync"
PENDING_FILE="$STATE_DIR/pending-upload.txt"
LOCK_DIR="${TMPDIR:-/tmp}/gzl-github-auto-sync.lock"
LOCK_PID_FILE="$LOCK_DIR/pid"
TEMP_FILE=""

cleanup() {
  rm -f "$TEMP_FILE" >/dev/null 2>&1 || true
  rm -f "$LOCK_PID_FILE" >/dev/null 2>&1 || true
  rmdir "$LOCK_DIR" >/dev/null 2>&1 || true
}

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  if [ -f "$LOCK_PID_FILE" ]; then
    LOCK_PID="$(cat "$LOCK_PID_FILE" 2>/dev/null || true)"
    if [ -n "$LOCK_PID" ] && ! kill -0 "$LOCK_PID" >/dev/null 2>&1; then
      rm -f "$LOCK_PID_FILE" >/dev/null 2>&1 || true
      rmdir "$LOCK_DIR" >/dev/null 2>&1 || true
      mkdir "$LOCK_DIR" 2>/dev/null || exit 0
    else
      exit 0
    fi
  else
    rmdir "$LOCK_DIR" >/dev/null 2>&1 || exit 0
    mkdir "$LOCK_DIR" 2>/dev/null || exit 0
  fi
fi

echo "$$" > "$LOCK_PID_FILE"

trap cleanup EXIT

cd "$ROOT_DIR"
mkdir -p "$STATE_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Not a git repository: $ROOT_DIR"
  exit 1
fi

BRANCH_NAME="$(git branch --show-current)"
if [ -z "$BRANCH_NAME" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] No current branch to sync."
  exit 1
fi

if ! git config user.name >/dev/null 2>&1 || ! git config user.email >/dev/null 2>&1; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Missing git user.name or user.email."
  exit 1
fi

STATUS_OUTPUT="$(git status --short --untracked-files=all)"

if [ -z "$STATUS_OUTPUT" ]; then
  if [ -f "$PENDING_FILE" ]; then
    rm -f "$PENDING_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Working tree is clean."
  fi

  exit 0
fi

TEMP_FILE="$(mktemp "${TMPDIR:-/tmp}/gzl-pending-upload.XXXXXX")"

{
  echo "Pending GitHub upload confirmation"
  echo "Updated: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "Repository: $ROOT_DIR"
  echo "Branch: $BRANCH_NAME"
  echo
  echo "Changed files:"
  printf '%s\n' "$STATUS_OUTPUT"
  echo
  echo "To review pending changes:"
  echo "  ./scripts/show-github-upload-status.sh"
  echo
  echo "To upload after your confirmation:"
  echo "  ./scripts/confirm-github-upload.sh"
} > "$TEMP_FILE"

if ! cmp -s "$TEMP_FILE" "$PENDING_FILE" 2>/dev/null; then
  mv "$TEMP_FILE" "$PENDING_FILE"
  TEMP_FILE=""
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Pending changes detected. Waiting for manual confirmation."
fi
