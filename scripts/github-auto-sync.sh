#!/bin/zsh
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export GIT_TERMINAL_PROMPT=0

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
LOCK_DIR="${TMPDIR:-/tmp}/gzl-github-auto-sync.lock"

cleanup() {
  rmdir "$LOCK_DIR" >/dev/null 2>&1 || true
}

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  exit 0
fi

trap cleanup EXIT

cd "$ROOT_DIR"

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

if [ -z "$(git status --porcelain --untracked-files=all)" ]; then
  exit 0
fi

git add -A

if git diff --cached --quiet; then
  exit 0
fi

COMMIT_MESSAGE="chore: auto sync $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MESSAGE"

if git ls-remote --exit-code --heads origin "$BRANCH_NAME" >/dev/null 2>&1; then
  if ! git pull --rebase origin "$BRANCH_NAME"; then
    git rebase --abort >/dev/null 2>&1 || true
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Rebase failed. Resolve conflicts manually."
    exit 1
  fi

  git push origin "$BRANCH_NAME"
else
  git push -u origin "$BRANCH_NAME"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Synced branch $BRANCH_NAME to GitHub."
