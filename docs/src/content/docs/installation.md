---
title: Installation
description: Install ipwhoami on macOS, Linux, or Windows.
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
npm install -g ipwhoami
```

Verify the installation:

```bash
ipwhoami --version
```

### Run without installing

```bash
npx ipwhoami 8.8.8.8
```

## Homebrew (macOS / Linux)

```bash
brew tap vineethkrishnan/ipwhoami
brew install ipwhoami
```

The formula is auto-updated on each release.

## Scoop (Windows)

```powershell
scoop bucket add ipwhoami https://github.com/vineethkrishnan/scoop-ipwhoami
scoop install ipwhoami
```

Update later with:

```powershell
scoop update ipwhoami
```

## Docker

No installation needed — just run the image:

```bash
# Look up an IP
docker run --rm vineethnkrishnan/ipwhoami 8.8.8.8

# Compare providers
docker run --rm vineethnkrishnan/ipwhoami -c 1.1.1.1

# Raw JSON output
docker run --rm vineethnkrishnan/ipwhoami -r 8.8.8.8
```

Also available from GitHub Container Registry:

```bash
docker run --rm ghcr.io/vineethkrishnan/ipwhoami 8.8.8.8
```

### Use in CI pipelines

```yaml
# GitHub Actions example
- name: Get server geolocation
  run: docker run --rm vineethnkrishnan/ipwhoami -r $SERVER_IP
```

## Standalone Bash Script (macOS / Linux)

No Node.js needed — just `curl` and `jq`.

### One-liner install

```bash
curl -fsSL https://raw.githubusercontent.com/vineethkrishnan/ipwhoami/main/install.sh | bash
```

### Manual install

```bash
curl -O https://raw.githubusercontent.com/vineethkrishnan/ipwhoami/main/scripts/ipwhoami.sh
chmod +x ipwhoami.sh
sudo mv ipwhoami.sh /usr/local/bin/ipwhoami
```

## Standalone PowerShell Script (Windows)

No Node.js needed — uses built-in `Invoke-RestMethod`.

```powershell
# Download
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/vineethkrishnan/ipwhoami/main/scripts/ipwhoami.ps1" -OutFile "$HOME\ipwhoami.ps1"

# Add alias to your profile
Add-Content $PROFILE 'Set-Alias ipwhoami "$HOME\ipwhoami.ps1"'
```

Restart your terminal, then run:

```powershell
ipwhoami 8.8.8.8
```

## Uninstall

<Tabs>
  <TabItem label="npm">
    ```bash
    npm uninstall -g ipwhoami
    ```
  </TabItem>
  <TabItem label="Homebrew">
    ```bash
    brew uninstall ipwhoami
    brew untap vineethkrishnan/ipwhoami
    ```
  </TabItem>
  <TabItem label="Scoop">
    ```powershell
    scoop uninstall ipwhoami
    scoop bucket rm ipwhoami
    ```
  </TabItem>
  <TabItem label="Docker">
    ```bash
    docker rmi vineethnkrishnan/ipwhoami
    ```
  </TabItem>
  <TabItem label="Bash">
    ```bash
    sudo rm /usr/local/bin/ipwhoami
    ```
  </TabItem>
  <TabItem label="PowerShell">
    ```powershell
    Remove-Item "$HOME\ipwhoami.ps1"
    ```
  </TabItem>
</Tabs>
