---
title: Installation
description: Install ipwho on macOS, Linux, or Windows.
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

## Requirements

| Method | Requires |
|--------|----------|
| npm | Node.js >= 18 |
| Bash script | `curl` + `jq` |
| PowerShell script | PowerShell 5.1+ or 7+ |

## Install via npm (recommended)

Works on **all platforms** where Node.js is available.

```bash
npm install -g ipwho
```

Verify the installation:

```bash
ipwho --version
```

### Run without installing

```bash
npx ipwho 8.8.8.8
```

## Standalone Bash Script (macOS / Linux)

No Node.js needed — just `curl` and `jq`.

### One-liner install

```bash
curl -fsSL https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/install.sh | bash
```

### Manual install

```bash
curl -O https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/scripts/ipwho.sh
chmod +x ipwho.sh
sudo mv ipwho.sh /usr/local/bin/ipwho
```

## Standalone PowerShell Script (Windows)

No Node.js needed — uses built-in `Invoke-RestMethod`.

```powershell
# Download
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/scripts/ipwho.ps1" -OutFile "$HOME\ipwho.ps1"

# Add alias to your profile
Add-Content $PROFILE 'Set-Alias ipwho "$HOME\ipwho.ps1"'
```

Restart your terminal, then run:

```powershell
ipwho 8.8.8.8
```

## Uninstall

<Tabs>
  <TabItem label="npm">
    ```bash
    npm uninstall -g ipwho
    ```
  </TabItem>
  <TabItem label="Bash">
    ```bash
    sudo rm /usr/local/bin/ipwho
    ```
  </TabItem>
  <TabItem label="PowerShell">
    ```powershell
    Remove-Item "$HOME\ipwho.ps1"
    ```
  </TabItem>
</Tabs>
