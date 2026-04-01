---
title: Installation
description: Install ipwho on macOS, Linux, or Windows.
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

## Requirements

| Method | Requires |
|--------|----------|
| npm | Node.js >= 18 |
| Homebrew | macOS or Linux |
| Scoop | Windows |
| Docker | Docker Engine |
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

## Homebrew (macOS / Linux)

```bash
brew tap vineethkrishnan/ipwho
brew install ipwho
```

The formula is auto-updated on each release.

## Scoop (Windows)

```powershell
scoop bucket add ipwho https://github.com/vineethkrishnan/scoop-ipwho
scoop install ipwho
```

Update later with:

```powershell
scoop update ipwho
```

## Docker

No installation needed — just run the image:

```bash
# Look up an IP
docker run --rm vineethkrishnan/ipwho 8.8.8.8

# Compare providers
docker run --rm vineethkrishnan/ipwho -c 1.1.1.1

# Raw JSON output
docker run --rm vineethkrishnan/ipwho -r 8.8.8.8
```

Also available from GitHub Container Registry:

```bash
docker run --rm ghcr.io/vineethkrishnan/ipwho 8.8.8.8
```

### Use in CI pipelines

```yaml
# GitHub Actions example
- name: Get server geolocation
  run: docker run --rm vineethkrishnan/ipwho -r $SERVER_IP
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
  <TabItem label="Homebrew">
    ```bash
    brew uninstall ipwho
    brew untap vineethkrishnan/ipwho
    ```
  </TabItem>
  <TabItem label="Scoop">
    ```powershell
    scoop uninstall ipwho
    scoop bucket rm ipwho
    ```
  </TabItem>
  <TabItem label="Docker">
    ```bash
    docker rmi vineethkrishnan/ipwho
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
