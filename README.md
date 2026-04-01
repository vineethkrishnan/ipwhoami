# ipwhoami

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
npm install -g ipwhoami
```

Or run directly without installing:

```bash
npx ipwhoami 8.8.8.8
```

### Homebrew (macOS / Linux)

```bash
brew tap vineethkrishnan/ipwhoami
brew install ipwhoami
```

### Scoop (Windows)

```powershell
scoop bucket add ipwhoami https://github.com/vineethkrishnan/scoop-ipwhoami
scoop install ipwhoami
```

### Docker

```bash
docker run --rm vineethnkrishnan/ipwhoami 8.8.8.8
docker run --rm vineethnkrishnan/ipwhoami -c 1.1.1.1
```

### Standalone Bash script (macOS / Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/vineethkrishnan/ipwhoami/main/install.sh | bash
```

### Standalone PowerShell script (Windows)

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/vineethkrishnan/ipwhoami/main/scripts/ipwhoami.ps1" -OutFile "$HOME\ipwhoami.ps1"
Add-Content $PROFILE 'Set-Alias ipwhoami "$HOME\ipwhoami.ps1"'
```

## Usage

```
ipwhoami [options] [ip]
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
ipwhoami

# Look up a specific IP
ipwhoami 8.8.8.8

# Compare across all providers
ipwhoami -c 1.1.1.1

# Use a specific provider
ipwhoami -p ipapi 8.8.8.8

# Get raw JSON (great for piping)
ipwhoami -r 8.8.8.8 | jq .city
```

### Sample Output

```
$ ipwhoami -c 8.8.8.8
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
ipwhoami/
├── bin/
│   └── ipwhoami.js              # CLI entry point
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
│   ├── ipwhoami.sh              # Standalone Bash version
│   └── ipwhoami.ps1             # Standalone PowerShell version
├── test/                     # Unit & integration tests
├── docs/                     # Starlight documentation site
├── Dockerfile
├── .github/workflows/
│   ├── ci.yml                # Lint & test on PRs
│   ├── release.yml           # Release Please + npm + Docker + Homebrew + Scoop
│   └── deploy-docs.yml       # Cloudflare Pages docs deploy
├── package.json
├── CHANGELOG.md
├── LICENSE
└── README.md
```

## Release

Releases are fully automated via [Release Please](https://github.com/googleapis/release-please):

1. Push commits to `main` using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, etc.)
2. Release Please auto-creates a **Release PR** that bumps `package.json`, `src/config.js`, and `CHANGELOG.md`
3. Merge the PR to trigger the full release pipeline:
   - Creates a GitHub Release with auto-generated notes
   - Publishes to npm
   - Builds and pushes Docker images (Docker Hub + GHCR)
   - Updates the Homebrew formula
   - Updates the Scoop manifest

## Requirements

- **npm / Homebrew / Scoop**: Node.js >= 18
- **Docker**: No requirements (Node.js included in image)
- **Bash script**: `curl` + `jq`
- **PowerShell script**: PowerShell 5.1+ or 7+

## License

[MIT](LICENSE)
