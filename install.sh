#!/usr/bin/env bash

set -euo pipefail

REPO="vineethkrishnan/ipwho"
INSTALL_DIR="/usr/local/bin"

echo "Installing ipwho..."

# Detect platform
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
case "$OS" in
  linux|darwin)
    ;;
  *)
    echo "error: unsupported platform: $OS"
    echo "On Windows, use: Install-Script -Name ipwho (PowerShell) or copy ipwho.ps1 manually."
    exit 1
    ;;
esac

# Download
TMPFILE=$(mktemp)
curl -fsSL "https://raw.githubusercontent.com/$REPO/main/scripts/ipwho.sh" -o "$TMPFILE"

# Install
if [ -w "$INSTALL_DIR" ]; then
  mv "$TMPFILE" "$INSTALL_DIR/ipwho"
  chmod +x "$INSTALL_DIR/ipwho"
else
  echo "Need sudo to install to $INSTALL_DIR"
  sudo mv "$TMPFILE" "$INSTALL_DIR/ipwho"
  sudo chmod +x "$INSTALL_DIR/ipwho"
fi

echo "Installed ipwho to $INSTALL_DIR/ipwho"
echo "Run 'ipwho --help' to get started."
