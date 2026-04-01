# ipwho

IP geolocation lookup from your terminal. Query multiple providers and compare results side-by-side.

Works on **macOS**, **Linux**, and **Windows**. Zero dependencies.

## Features

- Look up geolocation for any IP address (or auto-detect yours)
- Choose from 3 providers: [ipinfo.io](https://ipinfo.io), [ipapi.co](https://ipapi.co), [ip-api.com](http://ip-api.com)
- Compare results across all providers at once
- Raw JSON output for scripting and piping
- No API keys required
- Zero dependencies
- Cross-platform: Node.js, Bash, and PowerShell

## Install

### npm (recommended)

```bash
npm install -g ipwho
```

Or run directly without installing:

```bash
npx ipwho 8.8.8.8
```

### Standalone Bash script (macOS / Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/install.sh | bash
```

Or manually:

```bash
curl -O https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/scripts/ipwho.sh
chmod +x ipwho.sh
sudo mv ipwho.sh /usr/local/bin/ipwho
```

### Standalone PowerShell script (Windows)

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/scripts/ipwho.ps1" -OutFile "$HOME\ipwho.ps1"

# Add an alias to your PowerShell profile
Add-Content $PROFILE 'Set-Alias ipwho "$HOME\ipwho.ps1"'
```

## Usage

```
ipwho [options] [ip]
```

### Options

| Flag | Description |
|------|-------------|
| `-p, --provider NAME` | Use a specific provider: `ipinfo`, `ipapi`, `ip-api` (default: `ipinfo`) |
| `-c, --compare` | Compare results from all providers |
| `-r, --raw` | Output raw JSON |
| `-h, --help` | Show help |
| `-v, --version` | Show version |

### Examples

```bash
# Look up your own public IP
ipwho

# Look up a specific IP
ipwho 8.8.8.8

# Compare across all providers
ipwho -c 1.1.1.1

# Use a specific provider
ipwho -p ipapi 8.8.8.8

# Get raw JSON (great for piping)
ipwho -r 8.8.8.8 | jq .city
```

### Sample Output

```
$ ipwho -c 8.8.8.8
Comparing geolocation for: 8.8.8.8
────────────────────────────────────────

[ipinfo]
  IP:        8.8.8.8
  City:      Mountain View
  Region:    California
  Country:   US
  Org:       AS15169 Google LLC
  Location:  37.4056,-122.0775
  Timezone:  America/Los_Angeles

[ipapi]
  IP:        8.8.8.8
  City:      Mountain View
  Region:    California
  Country:   United States
  Org:       Google LLC
  Location:  37.4223, -122.085
  Timezone:  America/Los_Angeles

[ip-api]
  IP:        8.8.8.8
  City:      Mountain View
  Region:    California
  Country:   United States
  ISP:       Google LLC
  Location:  37.4056, -122.0775
  Timezone:  America/Los_Angeles
```

## Providers

| Provider | HTTPS | Rate Limit | Notes |
|----------|-------|------------|-------|
| [ipinfo.io](https://ipinfo.io) | Yes | 50k/month free | Default provider |
| [ipapi.co](https://ipapi.co) | Yes | 1k/day free | Good detail |
| [ip-api.com](http://ip-api.com) | No (HTTP) | 45/min free | Includes ISP info |

## Adding a Provider

Providers live in `src/providers/`. To add a new one:

1. Create a new file in `src/providers/` (see existing ones for the pattern)
2. Implement the `lookup(ip)` method returning a normalized result object
3. Register it in `src/providers/index.js`

## Project Structure

```
ipwho/
├── bin/
│   └── ipwho.js              # CLI entry point
├── src/
│   ├── cli.js                # Argument parsing & command routing
│   ├── colors.js             # Terminal color helpers
│   ├── config.js             # Constants & defaults
│   ├── formatter.js          # Output formatting
│   ├── ip.js                 # IP validation & public IP resolution
│   └── providers/
│       ├── base.js           # Shared HTTP fetch logic
│       ├── index.js          # Provider registry
│       ├── ipinfo.js         # ipinfo.io
│       ├── ipapi.js          # ipapi.co
│       └── ip-api.js         # ip-api.com
├── scripts/
│   ├── ipwho.sh              # Standalone Bash version
│   └── ipwho.ps1             # Standalone PowerShell version
├── .github/workflows/
│   ├── ci.yml                # Lint & test on PRs
│   └── release.yml           # GitHub Release + npm publish on tags
├── package.json
├── CHANGELOG.md
├── LICENSE
└── README.md
```

## Release

To publish a new version:

```bash
# 1. Bump version in package.json and config.js
# 2. Update CHANGELOG.md
# 3. Commit, tag, and push
git tag v1.0.0
git push origin v1.0.0
```

The GitHub Actions workflow will automatically create a GitHub Release and publish to npm.

## Requirements

- **npm version**: Node.js >= 18 (uses built-in `fetch`)
- **Bash version**: `curl` + `jq`
- **PowerShell version**: PowerShell 5.1+ or 7+

## License

[MIT](LICENSE)
