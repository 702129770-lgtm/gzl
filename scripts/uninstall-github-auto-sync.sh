#!/bin/zsh
set -euo pipefail

PLIST_PATH="$HOME/Library/LaunchAgents/com.luqiling.gzl.github-auto-sync.plist"
LABEL="com.luqiling.gzl.github-auto-sync"

if [ -f "$PLIST_PATH" ]; then
  launchctl bootout "gui/$(id -u)" "$PLIST_PATH" >/dev/null 2>&1 || true
  rm -f "$PLIST_PATH"
fi

echo "Removed auto sync agent: $LABEL"
