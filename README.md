# ipwho

IP geolocation lookup from your terminal. Query multiple providers and compare results side-by-side.

Works on **macOS**, **Linux**, and **Windows**.

## Features

- Look up geolocation for any IP address (or auto-detect yours)
- Choose from 3 providers: [ipinfo.io](https://ipinfo.io), [ipapi.co](https://ipapi.co), [ip-api.com](http://ip-api.com)
- Compare results across all providers at once
- Raw JSON output for scripting and piping
- No API keys required
- Cross-platform: Bash (macOS/Linux) + PowerShell (Windows/macOS/Linux)

## Install

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/install.sh | bash
```

Or manually:

```bash
curl -O https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/ipwho
chmod +x ipwho
sudo mv ipwho /usr/local/bin/
```

### Windows (PowerShell)

```powershell
# Download the script
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/vineethkrishnan/ipwho/main/ipwho.ps1" -OutFile "$HOME\ipwho.ps1"

# Add an alias to your PowerShell profile
Add-Content $PROFILE 'Set-Alias ipwho "$HOME\ipwho.ps1"'
```

Or just download `ipwho.ps1` and run it directly.

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

## Requirements

### Bash version (macOS/Linux)
- `curl`
- `jq`

### PowerShell version (Windows/macOS/Linux)
- PowerShell 5.1+ (built into Windows) or PowerShell 7+

## Providers

| Provider | HTTPS | Rate Limit | Notes |
|----------|-------|------------|-------|
| [ipinfo.io](https://ipinfo.io) | Yes | 50k/month free | Default provider |
| [ipapi.co](https://ipapi.co) | Yes | 1k/day free | Good detail |
| [ip-api.com](http://ip-api.com) | No (HTTP) | 45/min free | Includes ISP info |

## License

[MIT](LICENSE)
