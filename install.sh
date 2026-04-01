#!/usr/bin/env bash

set -euo pipefail

REPO="vineethkrishnan/ipwhoami"
INSTALL_DIR="/usr/local/bin"

echo "Installing ipwhoami..."

# Detect platform
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
case "$OS" in
  linux|darwin)
    ;;
  *)
    echo "error: unsupported platform: $OS"
    echo "On Windows, use: Install-Script -Name ipwhoami (PowerShell) or copy ipwhoami.ps1 manually."
    exit 1
    ;;
esac

# Download
TMPFILE=$(mktemp)
curl -fsSL "https://raw.githubusercontent.com/$REPO/main/scripts/ipwhoami.sh" -o "$TMPFILE"

# Install
if [ -w "$INSTALL_DIR" ]; then
  mv "$TMPFILE" "$INSTALL_DIR/ipwhoami"
  chmod +x "$INSTALL_DIR/ipwhoami"
else
  echo "Need sudo to install to $INSTALL_DIR"
  sudo mv "$TMPFILE" "$INSTALL_DIR/ipwhoami"
  sudo chmod +x "$INSTALL_DIR/ipwhoami"
fi

echo "Installed ipwhoami to $INSTALL_DIR/ipwhoami"
echo "Run 'ipwhoami --help' to get started."
