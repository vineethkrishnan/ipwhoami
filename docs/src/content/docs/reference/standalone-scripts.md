---
title: Standalone Scripts
description: Use ipwho without Node.js via Bash or PowerShell scripts.
---

ipwho ships standalone scripts for environments where Node.js isn't available. These are feature-equivalent to the npm version.

## Bash Script (macOS / Linux)

**Requires:** `curl`, `jq`

### Install

```bash
curl -fsSL https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/install.sh | bash
```

### Usage

The Bash script accepts the same flags as the npm version:

```bash
ipwho                      # Your public IP
ipwho 8.8.8.8              # Specific IP
ipwho -c 1.1.1.1           # Compare mode
ipwho -p ipapi 8.8.8.8     # Choose provider
ipwho -r 8.8.8.8           # Raw JSON
```

### Location

After install, the script lives at `/usr/local/bin/ipwho`.

## PowerShell Script (Windows / macOS / Linux)

**Requires:** PowerShell 5.1+ (built into Windows 10/11) or PowerShell 7+

### Install

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/scripts/ipwho.ps1" -OutFile "$HOME\ipwho.ps1"

# Add alias
Add-Content $PROFILE 'Set-Alias ipwho "$HOME\ipwho.ps1"'
```

### Usage

PowerShell uses named parameters:

```powershell
ipwho                              # Your public IP
ipwho 8.8.8.8                      # Specific IP
ipwho -Compare 1.1.1.1             # Compare mode
ipwho -Provider ipapi 8.8.8.8      # Choose provider
ipwho -Raw 8.8.8.8                 # Raw JSON
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
