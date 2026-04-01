---
title: Standalone Scripts
description: Use ipwhoami without Node.js via Bash or PowerShell scripts.
---

ipwhoami ships standalone scripts for environments where Node.js isn't available. These are feature-equivalent to the npm version.

## Bash Script (macOS / Linux)

**Requires:** `curl`, `jq`

### Install

```bash
curl -fsSL https://raw.githubusercontent.com/vineethkrishnan/ipwhoami/main/install.sh | bash
```

### Usage

The Bash script accepts the same flags as the npm version:

```bash
ipwhoami                      # Your public IP
ipwhoami 8.8.8.8              # Specific IP
ipwhoami -c 1.1.1.1           # Compare mode
ipwhoami -p ipapi 8.8.8.8     # Choose provider
ipwhoami -r 8.8.8.8           # Raw JSON
```

### Location

After install, the script lives at `/usr/local/bin/ipwhoami`.

## PowerShell Script (Windows / macOS / Linux)

**Requires:** PowerShell 5.1+ (built into Windows 10/11) or PowerShell 7+

### Install

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/vineethkrishnan/ipwhoami/main/scripts/ipwhoami.ps1" -OutFile "$HOME\ipwhoami.ps1"

# Add alias
Add-Content $PROFILE 'Set-Alias ipwhoami "$HOME\ipwhoami.ps1"'
```

### Usage

PowerShell uses named parameters:

```powershell
ipwhoami                              # Your public IP
ipwhoami 8.8.8.8                      # Specific IP
ipwhoami -Compare 1.1.1.1             # Compare mode
ipwhoami -Provider ipapi 8.8.8.8      # Choose provider
ipwhoami -Raw 8.8.8.8                 # Raw JSON
```

## Feature Comparison

| Feature | npm | Bash | PowerShell |
|---------|-----|------|------------|
| Lookup | Yes | Yes | Yes |
| Compare mode | Yes | Yes | Yes |
| Raw JSON | Yes | Yes | Yes |
| Provider selection | Yes | Yes | Yes |
| IPv6 support | Yes | Yes | Yes |
| Auto-detect IP | Yes | Yes | Yes |
| Dependencies | Node >= 18 | curl + jq | PowerShell 5.1+ |
