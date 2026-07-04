#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
PLIST_DIR="$HOME/Library/LaunchAgents"
PLIST_PATH="$PLIST_DIR/com.luqiling.gzl.github-auto-sync.plist"
LABEL="com.luqiling.gzl.github-auto-sync"
LOG_DIR="$HOME/Library/Logs/gzl-github-sync"
OUT_LOG="$LOG_DIR/stdout.log"
ERR_LOG="$LOG_DIR/stderr.log"
PID_FILE="$HOME/Library/Application Support/gzl-github-sync/auto-sync.pid"
LOCK_DIR="${TMPDIR:-/tmp}/gzl-github-auto-sync.lock"

mkdir -p "$PLIST_DIR" "$LOG_DIR"

if [ -f "$PID_FILE" ]; then
  PID_VALUE="$(cat "$PID_FILE")"
  if kill -0 "$PID_VALUE" >/dev/null 2>&1; then
    kill "$PID_VALUE"
  fi

  rm -f "$PID_FILE"
fi

rm -f "$LOCK_DIR/pid" >/dev/null 2>&1 || true
rmdir "$LOCK_DIR" >/dev/null 2>&1 || true

cat > "$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>$LABEL</string>
    <key>ProgramArguments</key>
    <array>
      <string>/bin/zsh</string>
      <string>$ROOT_DIR/scripts/github-auto-sync.sh</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$ROOT_DIR</string>
    <key>RunAtLoad</key>
    <true/>
    <key>StartInterval</key>
    <integer>30</integer>
    <key>StandardOutPath</key>
    <string>$OUT_LOG</string>
    <key>StandardErrorPath</key>
    <string>$ERR_LOG</string>
  </dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)" "$PLIST_PATH" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$PLIST_PATH"
launchctl kickstart -k "gui/$(id -u)/$LABEL"

echo "Installed auto sync agent: $LABEL"
echo "LaunchAgent: $PLIST_PATH"
echo "Logs: $LOG_DIR"
echo "Uploads now require manual confirmation via ./scripts/confirm-github-upload.sh"
