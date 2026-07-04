#!/bin/zsh
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export GIT_TERMINAL_PROMPT=0

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
STATE_DIR="$HOME/Library/Application Support/gzl-github-sync"
PENDING_FILE="$STATE_DIR/pending-upload.txt"

cd "$ROOT_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository: $ROOT_DIR"
  exit 1
fi

BRANCH_NAME="$(git branch --show-current)"
if [ -z "$BRANCH_NAME" ]; then
  echo "No current branch to upload."
  exit 1
fi

if ! git config user.name >/dev/null 2>&1 || ! git config user.email >/dev/null 2>&1; then
  echo "Missing git user.name or user.email."
  exit 1
fi

STATUS_OUTPUT="$(git status --short --untracked-files=all)"
if [ -z "$STATUS_OUTPUT" ]; then
  rm -f "$PENDING_FILE" >/dev/null 2>&1 || true
  echo "No pending changes to upload."
  exit 0
fi

echo "Repository: $ROOT_DIR"
echo "Branch: $BRANCH_NAME"
echo
echo "Pending changes:"
printf '%s\n' "$STATUS_OUTPUT"
echo

printf "确认上传到 GitHub 吗？[y/N] "
read -r CONFIRMATION

case "$CONFIRMATION" in
  [yY]|[yY][eE][sS])
    ;;
  *)
    echo "Canceled. Changes were not uploaded."
    exit 0
    ;;
esac

git add -A

if git diff --cached --quiet; then
  echo "No staged changes to upload."
  exit 0
fi

COMMIT_MESSAGE="${1:-chore: manual sync $(date '+%Y-%m-%d %H:%M:%S')}"
git commit -m "$COMMIT_MESSAGE"

if git ls-remote --exit-code --heads origin "$BRANCH_NAME" >/dev/null 2>&1; then
  if ! git pull --rebase origin "$BRANCH_NAME"; then
    git rebase --abort >/dev/null 2>&1 || true
    echo "Rebase failed. Resolve conflicts manually before retrying."
    exit 1
  fi

  git push origin "$BRANCH_NAME"
else
  git push -u origin "$BRANCH_NAME"
fi

rm -f "$PENDING_FILE" >/dev/null 2>&1 || true
echo "Uploaded branch $BRANCH_NAME to GitHub."
